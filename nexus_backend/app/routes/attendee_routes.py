from flask import Blueprint, request, jsonify
from app import db
from app.models.attendee_model import Attendee
from app.models.session_model import Session
from app.models.attendance import Attendance
from app.utils.auth import auth_required

attendee_bp = Blueprint('attendee', __name__)

@attendee_bp.route('/sessions', methods=['GET'])
@auth_required
def get_available_sessions(current_user_id):
    """Get sessions available to this attendee based on their registered units"""
    try:
        # Get attendee's registered units
        attendee = Attendee.query.get(current_user_id)
        if not attendee:
            return jsonify({'error': 'Attendee not found'}), 404

        # Get attendee's units as a list
        attendee_units = [unit.strip() for unit in attendee.units.split(',')] if attendee.units else []

        # Get all active sessions
        sessions = Session.query.filter(Session.is_active == True).all()
        available_sessions = []

        for session in sessions:
            # Check if session's course_code matches any of attendee's units
            if session.course_code in attendee_units:
                available_sessions.append(session.to_dict())

        return jsonify(available_sessions), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500

@attendee_bp.route('/sessions/<int:session_id>/join', methods=['POST'])
@auth_required
def join_session(current_user_id, session_id):
    """Join a session and mark attendance"""
    try:
        # Get the session
        session = Session.query.get(session_id)
        if not session:
            return jsonify({'error': 'Session not found'}), 404

        if not session.is_active:
            return jsonify({'error': 'Session is not active'}), 400

        # Get attendee
        attendee = Attendee.query.get(current_user_id)
        if not attendee:
            return jsonify({'error': 'Attendee not found'}), 404

        # Check if attendee is registered for this course
        attendee_units = [unit.strip() for unit in attendee.units.split(',')] if attendee.units else []
        if session.course_code not in attendee_units:
            return jsonify({'error': 'You are not registered for this course'}), 403

        # Check if already marked attendance
        existing_attendance = Attendance.query.filter_by(
            attendee_id=current_user_id,
            session_id=session_id
        ).first()

        if existing_attendance:
            return jsonify({
                'message': 'Attendance already marked',
                'attendance': existing_attendance.to_dict()
            }), 200

        # Mark attendance
        attendance = Attendance(
            attendee_id=current_user_id,
            session_id=session_id,
            status='Present'
        )

        db.session.add(attendance)
        db.session.commit()

        return jsonify({
            'message': 'Attendance marked successfully',
            'attendance': attendance.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attendee_bp.route('/attendance', methods=['GET'])
@auth_required
def get_my_attendance(current_user_id):
    """Get attendance records for this attendee"""
    try:
        attendance_records = Attendance.query.filter_by(attendee_id=current_user_id).all()

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
        attendee = Attendee.query.get(current_user_id)
        if not attendee:
            return jsonify({'error': 'Attendee not found'}), 404

        # Get attendance stats
        total_sessions = Attendance.query.filter_by(attendee_id=current_user_id).count()
        present_count = Attendance.query.filter_by(
            attendee_id=current_user_id,
            status='Present'
        ).count()

        attendance_rate = (present_count / total_sessions * 100) if total_sessions > 0 else 0

        profile = attendee.to_dict()
        profile['attendance_stats'] = {
            'total_sessions': total_sessions,
            'present_count': present_count,
            'attendance_rate': round(attendance_rate, 2)
        }

        return jsonify(profile), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch profile'}), 500