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

        # Check if attendee is already in another active session
        active_sessions = Session.query.filter(Session.is_active == True).all()
        for active_session in active_sessions:
            existing_attendance = Attendance.query.filter_by(
                attendee_id=current_user_id,
                session_id=active_session.id
            ).first()

            if existing_attendance and active_session.id != session_id:
                return jsonify({
                    'error': f'You are already in another active session: "{active_session.title}". Please wait for it to end before joining a new session.'
                }), 409

        # Auto-enroll attendee in the course if not already enrolled
        attendee_units = [unit.strip() for unit in attendee.units.split(',')] if attendee.units else []
        if session.course_code not in attendee_units:
            # Add the course to attendee's units (auto-enrollment)
            attendee_units.append(session.course_code)
            attendee.units = ','.join(attendee_units)

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

@attendee_bp.route('/sessions/scan', methods=['GET'])
@auth_required
def scan_all_sessions(current_user_id):
    """Scan for ALL active sessions (not filtered by enrolled courses)"""
    try:
        # Get all active sessions
        sessions = Session.query.filter(Session.is_active == True).all()

        print(f"🔍 Scanning sessions for attendee {current_user_id}")
        print(f"📊 Found {len(sessions)} active sessions")

        # Get attendee to check which courses they're enrolled in
        attendee = Attendee.query.get(current_user_id)
        attendee_units = [unit.strip() for unit in attendee.units.split(',')] if attendee and attendee.units else []

        print(f"👤 Attendee units: {attendee_units}")

        # Return all sessions with enrollment status
        all_sessions = []
        for session in sessions:
            session_dict = session.to_dict()
            session_dict['isEnrolled'] = session.course_code in attendee_units
            all_sessions.append(session_dict)
            print(f"  ✅ Session: {session.title} ({session.course_code}) - Active: {session.is_active}")

        return jsonify(all_sessions), 200
    except Exception as e:
        print(f"❌ Error scanning sessions: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to scan sessions'}), 500

@attendee_bp.route('/schedule', methods=['GET'])
@auth_required
def get_schedule(current_user_id):
    """Get attendee's class schedule based on enrolled courses"""
    try:
        # Get attendee
        attendee = Attendee.query.get(current_user_id)
        if not attendee:
            return jsonify({'error': 'Attendee not found'}), 404

        # Get enrolled courses
        attendee_units = [unit.strip() for unit in attendee.units.split(',')] if attendee.units else []

        # Get all sessions for enrolled courses (both active and ended)
        all_sessions = Session.query.filter(Session.course_code.in_(attendee_units)).all() if attendee_units else []

        # Format schedule data
        schedule = []
        for session in all_sessions:
            schedule.append({
                'id': session.id,
                'courseCode': session.course_code,
                'title': session.title,
                'attendantName': session.attendant_name,
                'schedule': session.schedule,
                'isActive': session.is_active,
                'createdAt': session.created_at.isoformat() if session.created_at else None
            })

        return jsonify({
            'enrolledCourses': attendee_units,
            'sessions': schedule
        }), 200

    except Exception as e:
        print(f"❌ Error fetching schedule: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch schedule'}), 500