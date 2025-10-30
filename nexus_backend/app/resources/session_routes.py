from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.session_model import Session
from app.models.attendant_model import Attendant
from app.schemas.session_schema import SessionCreateSchema, SessionResponseSchema

session_bp = Blueprint('session_bp', __name__)

@session_bp.route('/sessions', methods=['POST'])
@jwt_required()
def create_session():
    current_user_id = get_jwt_identity()
    schema = SessionCreateSchema()
    data = schema.load(request.json)
    
    attendant = Attendant.query.get(current_user_id)
    if not attendant:
        return jsonify({'error': 'Attendant not found'}), 404
    
    session = Session(
        title=data['title'],
        attendant_name=attendant.name,
        schedule=data['schedule'],
        course_code=data['course_code'],
        attendant_id=current_user_id
    )
    
    db.session.add(session)
    db.session.commit()
    
    return jsonify(SessionResponseSchema().dump(session.to_dict())), 201

@session_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    current_user_id = get_jwt_identity()
    sessions = Session.query.filter_by(attendant_id=current_user_id).all()
    return jsonify([SessionResponseSchema().dump(s.to_dict()) for s in sessions])

@session_bp.route('/sessions/<int:session_id>/start', methods=['POST'])
@jwt_required()
def start_session(session_id):
    from app.services.device_service import DeviceService
    try:
        session = DeviceService.start_session(session_id)
        return jsonify({'message': 'Session started', 'session': SessionResponseSchema().dump(session.to_dict())})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@session_bp.route('/sessions/<int:session_id>/stop', methods=['POST'])
@jwt_required()
def stop_session(session_id):
    from app.services.device_service import DeviceService
    session = DeviceService.stop_session(session_id)
    if session:
        return jsonify({'message': 'Session stopped', 'session': SessionResponseSchema().dump(session.to_dict())})
    return jsonify({'error': 'Session not found'}), 404