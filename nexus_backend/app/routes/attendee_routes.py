from flask import Blueprint, request, jsonify
from app import db
from app.models.user_model import User
from app.models.session_model import Session
from app.models.attendance import Attendance
from app.utils.auth import auth_required

attendee_bp = Blueprint('attendee', __name__)

@attendee_bp.route('/sessions', methods=['GET'])
@auth_required
def get_available_sessions(current_user_id):
    """Get sessions available to this attendee"""
    try:
        # Get sessions where this user is a member
        sessions = Session.query.filter(Session.is_active == True).all()
        available_sessions = []
        
        for session in sessions:
            if session.members:
                import json
                member_ids = json.loads(session.members)
                if str(current_user_id) in member_ids:
                    available_sessions.append(session.to_dict())
        
        return jsonify(available_sessions), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500

@attendee_bp.route('/attendance', methods=['GET'])
@auth_required
def get_my_attendance(current_user_id):
    """Get attendance records for this attendee"""
    try:
        attendance_records = Attendance.query.filter_by(user_id=current_user_id).all()
        
        records = []
        for record in attendance_records:
            record_dict = record.to_dict()
            # Add session info
            session = Session.query.get(record.session_id)
            if session:
                record_dict['session_title'] = session.title
                record_dict['session_code'] = session.course_code
            records.append(record_dict)
        
        return jsonify(records), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch attendance'}), 500

@attendee_bp.route('/profile', methods=['GET'])
@auth_required
def get_profile(current_user_id):
    """Get attendee profile"""
    try:
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Get attendance stats
        total_sessions = Attendance.query.filter_by(user_id=current_user_id).count()
        present_count = Attendance.query.filter_by(
            user_id=current_user_id, 
            status='Present'
        ).count()
        
        attendance_rate = (present_count / total_sessions * 100) if total_sessions > 0 else 0
        
        profile = user.to_dict()
        profile['attendance_stats'] = {
            'total_sessions': total_sessions,
            'present_count': present_count,
            'attendance_rate': round(attendance_rate, 2)
        }
        
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch profile'}), 500