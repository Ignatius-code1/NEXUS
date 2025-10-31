from flask import Blueprint, request, jsonify
from app import db
from app.models.attendant_model import Attendant
from app.models.attendee_model import Attendee
from app.models.session_model import Session
from app.models.attendance import Attendance
from app.utils.auth import auth_required

attendant_bp = Blueprint('attendant', __name__)

@attendant_bp.route('/sessions', methods=['GET'])
@auth_required
def get_my_sessions(current_user_id):
    """Get sessions created by this attendant with attendance counts"""
    try:
        sessions = Session.query.filter_by(attendant_id=current_user_id).all()
        sessions_data = []

        for session in sessions:
            session_dict = session.to_dict()
            # Get actual attendance count for this session
            attendance_count = Attendance.query.filter_by(session_id=session.id).count()
            present_count = Attendance.query.filter_by(session_id=session.id, status='Present').count()

            session_dict['attendanceCount'] = attendance_count
            session_dict['presentCount'] = present_count
            sessions_data.append(session_dict)

        return jsonify(sessions_data), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500

@attendant_bp.route('/sessions', methods=['POST'])
@auth_required
def create_session(current_user_id):
    """Create new session (Attendant only)"""
    try:
        # Verify user is attendant
        attendant = Attendant.query.get(current_user_id)
        if not attendant:
            return jsonify({'error': 'Only attendants can create sessions'}), 403

        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({'error': 'Session title required'}), 400
        
        session = Session(
            title=data['title'],
            attendant_name=attendant.name,
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
        print(f"❌ Error creating session: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to create session: {str(e)}'}), 500

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
            attendee_id = record.get('attendee_id')
            status = record.get('status', 'Present')

            # Check if attendance already exists
            existing = Attendance.query.filter_by(
                attendee_id=attendee_id,
                session_id=session_id
            ).first()

            if existing:
                existing.status = status
            else:
                attendance = Attendance(
                    attendee_id=attendee_id,
                    session_id=session_id,
                    status=status
                )
                db.session.add(attendance)
        
        db.session.commit()
        return jsonify({'message': 'Attendance marked successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to mark attendance'}), 500

@attendant_bp.route('/students', methods=['GET'])
@auth_required
def get_all_students(current_user_id):
    """Get all students/attendees"""
    try:
        attendees = Attendee.query.all()
        return jsonify([{
            'id': attendee.id,
            'name': attendee.name,
            'email': attendee.email,
            'serial': attendee.serial,
            'units': attendee.units.split(',') if attendee.units else []
        } for attendee in attendees]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch students'}), 500

@attendant_bp.route('/students/<int:student_id>/add-course', methods=['POST'])
@auth_required
def add_student_to_course(current_user_id, student_id):
    """Add a student to a course"""
    try:
        data = request.get_json()
        course_code = data.get('courseCode')

        if not course_code:
            return jsonify({'error': 'Course code required'}), 400

        # Get the student
        student = Attendee.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        # Get current units
        current_units = [unit.strip() for unit in student.units.split(',')] if student.units else []

        # Check if already enrolled
        if course_code in current_units:
            return jsonify({'message': 'Student already enrolled in this course'}), 200

        # Add the course
        current_units.append(course_code)
        student.units = ','.join(current_units)

        db.session.commit()

        return jsonify({
            'message': 'Student added to course successfully',
            'student': {
                'id': student.id,
                'name': student.name,
                'email': student.email,
                'units': current_units
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add student to course'}), 500

@attendant_bp.route('/sessions/<int:session_id>/end', methods=['POST'])
@auth_required
def end_session(current_user_id, session_id):
    """End a session (set is_active to False)"""
    try:
        # Verify session belongs to this attendant
        session = Session.query.filter_by(id=session_id, attendant_id=current_user_id).first()
        if not session:
            return jsonify({'error': 'Session not found or access denied'}), 404

        # End the session
        session.is_active = False
        db.session.commit()

        return jsonify({
            'message': 'Session ended successfully',
            'session': session.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to end session'}), 500

@attendant_bp.route('/schedule', methods=['GET'])
@auth_required
def get_attendant_schedule(current_user_id):
    """Get attendant's teaching schedule (all their sessions)"""
    try:
        # Get attendant
        attendant = Attendant.query.get(current_user_id)
        if not attendant:
            return jsonify({'error': 'Attendant not found'}), 404

        # Get courses they teach
        attendant_courses = [unit.strip() for unit in attendant.units.split(',')] if attendant.units else []

        # Get all sessions created by this attendant
        all_sessions = Session.query.filter_by(attendant_id=current_user_id).all()

        # Format schedule data
        schedule = []
        for session in all_sessions:
            attendance_count = Attendance.query.filter_by(session_id=session.id).count()
            present_count = Attendance.query.filter_by(session_id=session.id, status='Present').count()

            schedule.append({
                'id': session.id,
                'courseCode': session.course_code,
                'title': session.title,
                'schedule': session.schedule,
                'isActive': session.is_active,
                'attendanceCount': attendance_count,
                'presentCount': present_count,
                'createdAt': session.created_at.isoformat() if session.created_at else None
            })

        return jsonify({
            'teachingCourses': attendant_courses,
            'sessions': schedule
        }), 200

    except Exception as e:
        print(f"❌ Error fetching attendant schedule: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch schedule'}), 500