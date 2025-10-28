from flask import Blueprint, request, jsonify
from app.models.session_model import Session
from app.models.user_model import Attendant
from app import db
from app.schemas.session_schema import session_schema, sessions_schema
from datetime import datetime

session_bp = Blueprint('sessions', __name__, url_prefix='/sessions')


# CREATE A NEW SESSION

@session_bp.route('/', methods=['POST'])
def create_session():
    data = request.get_json()

    required_fields = ['class_name', 'subject', 'session_code', 'teacher_id']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the teacher exists
    teacher = Attendant.query.get(data['teacher_id'])
    if not teacher:
        return jsonify({"error": "Attendant (teacher) not found"}), 404

    # Check if session_code already exists
    existing_session = Session.query.filter_by(session_code=data['session_code']).first()
    if existing_session:
        return jsonify({"error": "Session code already exists"}), 409

    new_session = Session(
        class_name=data['class_name'],
        subject=data['subject'],
        session_code=data['session_code'],
        teacher_id=data['teacher_id']
    )

    db.session.add(new_session)
    db.session.commit()

    return jsonify({
        "message": "Session created successfully",
        "session": session_schema.dump(new_session)
    }), 201



# GET ALL SESSIONS

@session_bp.route('/', methods=['GET'])
def get_all_sessions():
    sessions = Session.query.all()
    return jsonify(sessions_schema.dump(sessions)), 200


# GET SINGLE SESSION BY ID

@session_bp.route('/<int:session_id>', methods=['GET'])
def get_session(session_id):
    session = Session.query.get_or_404(session_id)
    return jsonify(session_schema.dump(session)), 200



# UPDATE A SESSION

@session_bp.route('/<int:session_id>', methods=['PATCH'])
def update_session(session_id):
    session = Session.query.get_or_404(session_id)
    data = request.get_json()

    if 'class_name' in data:
        session.class_name = data['class_name']
    if 'subject' in data:
        session.subject = data['subject']
    if 'end_time' in data:
        try:
            session.end_time = datetime.fromisoformat(data['end_time'])
        except Exception:
            return jsonify({"error": "Invalid end_time format (expected ISO 8601)"}), 400
    if 'is_active' in data:
        session.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({
        "message": "Session updated successfully",
        "session": session_schema.dump(session)
    }), 200



# DELETE A SESSION

@session_bp.route('/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    session = Session.query.get_or_404(session_id)
    db.session.delete(session)
    db.session.commit()
    return jsonify({"message": "Session deleted successfully"}), 200



# GET ALL SESSIONS BY ATTENDANT

@session_bp.route('/attendant/<int:attendant_id>', methods=['GET'])
def get_sessions_by_attendant(attendant_id):
    attendant = Attendant.query.get(attendant_id)
    if not attendant:
        return jsonify({"error": "Attendant not found"}), 404

    sessions = Session.query.filter_by(teacher_id=attendant_id).all()
    return jsonify({
        "attendant": {"id": attendant.id, "name": attendant.name},
        "sessions": sessions_schema.dump(sessions)
    }), 200
