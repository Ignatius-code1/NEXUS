from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from app.db import db
from app.models.user_model import Attendee, Attendant, Admin
from app.schemas.user_schema import UserSchema

# Blueprint setup
user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# Schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)


#  Register a user (attendee, attendant, or admin)

@user_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    role = data.get("role")
    email = data.get("email")
    password = data.get("password")
    name = data.get("full_name")

    if role not in ["attendee", "attendant", "admin"]:
        return jsonify({"error": "Invalid role type"}), 400

    # Hash password
    password_hash = generate_password_hash(password)

    try:
        if role == "attendee":
            new_user = Attendee(
                name=name,
                email=email,
                registration_number=data.get("attendee_code"),
                password_hash=password_hash
            )
        elif role == "attendant":
            new_user = Attendant(
                name=name,
                email=email,
                employee_id=data.get("attendant_code"),
                password_hash=password_hash
            )
        else:  # Admin
            new_user = Admin(
                name=name,
                email=email,
                password_hash=password_hash
            )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": f"{role.capitalize()} registered successfully!",
            "user": user_schema.dump(new_user)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



#  Login user

@user_bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # Try to find user across all roles
    user = (
        Attendant.query.filter_by(email=email).first() or
        Attendee.query.filter_by(email=email).first() or
        Admin.query.filter_by(email=email).first()
    )

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Identify role for token payload
    role = (
        "attendant" if isinstance(user, Attendant)
        else "attendee" if isinstance(user, Attendee)
        else "admin"
    )

    # Create JWT
    access_token = create_access_token(
        identity={"id": user.id, "role": role, "email": user.email},
        expires_delta=timedelta(hours=5)
    )

    return jsonify({
        "message": f"Welcome back, {user.name}!",
        "access_token": access_token,
        "role": role
    }), 200



#  Get current user profile

@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    role = current_user.get("role")
    user_id = current_user.get("id")

    user = None
    if role == "attendant":
        user = Attendant.query.get(user_id)
    elif role == "attendee":
        user = Attendee.query.get(user_id)
    elif role == "admin":
        user = Admin.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": user_schema.dump(user), "role": role}), 200


#  Get all users by role

@user_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_users():
    role = request.args.get("role")

    if role == "attendee":
        users = Attendee.query.all()
    elif role == "attendant":
        users = Attendant.query.all()
    elif role == "admin":
        users = Admin.query.all()
    else:
        return jsonify({"error": "Please specify a valid role parameter"}), 400

    return jsonify(users_schema.dump(users)), 200



#  Delete a user

@user_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user = get_jwt_identity()
    if current_user.get("role") != "admin":
        return jsonify({"error": "Unauthorized – admin only"}), 403

    user = (
        Attendant.query.get(user_id) or
        Attendee.query.get(user_id) or
        Admin.query.get(user_id)
    )

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user.name} deleted successfully"}), 200
