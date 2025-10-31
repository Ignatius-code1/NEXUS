from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.attendant_model import Attendant
from app.models.attendee_model import Attendee
from app.schemas.user_schema import UserCreateSchema, UserResponseSchema

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users/attendants', methods=['POST'])
@jwt_required()
def create_attendant():
    schema = UserCreateSchema()
    data = schema.load(request.json)
    
    attendant = Attendant(
        name=data['name'],
        email=data['email']
    )
    attendant.set_password(data['password'])
    
    db.session.add(attendant)
    db.session.commit()
    attendant.generate_serial()
    db.session.commit()
    
    return jsonify(UserResponseSchema().dump(attendant.to_dict())), 201

@user_bp.route('/users/attendees', methods=['POST'])
@jwt_required()
def create_attendee():
    schema = UserCreateSchema()
    data = schema.load(request.json)
    
    attendee = Attendee(
        name=data['name'],
        email=data['email']
    )
    attendee.set_password(data['password'])
    
    db.session.add(attendee)
    db.session.commit()
    attendee.generate_serial()
    db.session.commit()
    
    return jsonify(UserResponseSchema().dump(attendee.to_dict())), 201

@user_bp.route('/users/attendants', methods=['GET'])
@jwt_required()
def get_attendants():
    attendants = Attendant.query.all()
    return jsonify([UserResponseSchema().dump(a.to_dict()) for a in attendants])

@user_bp.route('/users/attendees', methods=['GET'])
@jwt_required()
def get_attendees():
    attendees = Attendee.query.all()
    return jsonify([UserResponseSchema().dump(a.to_dict()) for a in attendees])