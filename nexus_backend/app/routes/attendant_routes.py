from flask import Blueprint, request, jsonify
from app import db
from app.models.user_model import User
from app.models.session_model import Session
from app.models.attendance import Attendance
from app.utils.auth import auth_required

attendant_bp = Blueprint('attendant', __name__)

@attendant_bp.route('/sessions', methods=['GET'])
@auth_required
def get_my_sessions(current_user_id):
    """Get sessions created by this attendant"""
    try:
        sessions = Session.query.filter_by(attendant_id=current_user_id).all()
        return jsonify([session.to_dict() for session in sessions]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500

@attendant_bp.route('/sessions', methods=['POST'])
@auth_required
def create_session(current_user_id):
    """Create new session (Attendant only)"""
    try:
        # Verify user is attendant
        user = User.query.get(current_user_id)
        if user.role != 'Attendant':
            return jsonify({'error': 'Only attendants can create sessions'}), 403
            
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({'error': 'Session title required'}), 400
        
        session = Session(
            title=data['title'],
            attendant_name=user.name,
            schedule=data.get('schedule', ''),
            course_code=data.get('courseCode', ''),
            attendant_id=current_user_id,
            is_active=True
        )
        
        if data.get('members'):
            session.set_members(data['members'])
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify(session.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create session'}), 500

@attendant_bp.route('/attendance/<int:session_id>', methods=['POST'])
@auth_required
def mark_attendance(current_user_id, session_id):
    """Mark attendance for a session"""
    try:
        # Verify session belongs to this attendant
        session = Session.query.filter_by(id=session_id, attendant_id=current_user_id).first()
        if not session:
            return jsonify({'error': 'Session not found or access denied'}), 404
            
        data = request.get_json()
        attendance_data = data.get('attendance', [])
        
        for record in attendance_data:
            user_id = record.get('user_id')
            status = record.get('status', 'Present')
            
            # Check if attendance already exists
            existing = Attendance.query.filter_by(
                user_id=user_id, 
                session_id=session_id
            ).first()
            
            if existing:
                existing.status = status
            else:
                attendance = Attendance(
                    user_id=user_id,
                    session_id=session_id,
                    status=status
                )
                db.session.add(attendance)
        
        db.session.commit()
        return jsonify({'message': 'Attendance marked successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to mark attendance'}), 500