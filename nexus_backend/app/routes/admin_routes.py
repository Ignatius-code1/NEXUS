from flask import Blueprint, request, jsonify
from app import db
from app.models.admin_model import Admin
from app.models.attendant_model import Attendant
from app.models.attendee_model import Attendee
from app.models.session_model import Session
from app.utils.auth import admin_required
from app.utils.email import send_welcome_email
import secrets

admin_bp = Blueprint('admin', __name__)

# Helper function to get user by role
def get_user_by_role(role, user_id):
    """Get user from correct table based on role"""
    if role == 'Admin':
        return Admin.query.get_or_404(user_id)
    elif role == 'Attendant':
        return Attendant.query.get_or_404(user_id)
    elif role == 'Attendee':
        return Attendee.query.get_or_404(user_id)
    else:
        return None

# User Management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user_id):
    """Get all users (admins, attendants, attendees)"""
    try:
        # Get all users from all three tables
        admins = [user.to_dict() for user in Admin.query.all()]
        attendants = [user.to_dict() for user in Attendant.query.all()]
        attendees = [user.to_dict() for user in Attendee.query.all()]

        # Combine and return
        return jsonify(admins + attendants + attendees), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user(current_user_id):
    """Create new user (admin, attendant, or attendee)"""
    try:
        data = request.get_json()

        # Validate input
        if not data or not data.get('name') or not data.get('email') or not data.get('role'):
            return jsonify({'error': 'Name, email and role required'}), 400

        role = data['role']
        email = data['email']

        # Check if email exists
        if (Admin.query.filter_by(email=email).first() or
            Attendant.query.filter_by(email=email).first() or
            Attendee.query.filter_by(email=email).first()):
            return jsonify({'error': 'Email already exists'}), 400

        # Create user based on role
        if role == 'Admin':
            user = Admin(name=data['name'], email=email)
        elif role == 'Attendant':
            user = Attendant(name=data['name'], email=email)
        elif role == 'Attendee':
            user = Attendee(name=data['name'], email=email)
        else:
            return jsonify({'error': 'Invalid role'}), 400

        # Set password and save
        temp_password = secrets.token_urlsafe(8)
        user.set_password(temp_password)
        db.session.add(user)
        db.session.commit()

        # Generate serial
        user.generate_serial()
        db.session.commit()

        # Send email
        send_welcome_email(user.email, user.name, temp_password)

        return jsonify(user.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

@admin_bp.route('/users/<string:role>/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(current_user_id, role, user_id):
    """Update user (requires role in URL: /users/Admin/1 or /users/Attendant/2)"""
    try:
        # Get user
        user = get_user_by_role(role, user_id)
        if not user:
            return jsonify({'error': 'Invalid role'}), 400

        # Update fields
        data = request.get_json()
        if data.get('name'):
            user.name = data['name']
        if data.get('email'):
            user.email = data['email']

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update user'}), 500

@admin_bp.route('/users/<string:role>/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user_id, role, user_id):
    """Delete user (requires role in URL: /users/Admin/1 or /users/Attendant/2)"""
    try:
        # Get user
        user = get_user_by_role(role, user_id)
        if not user:
            return jsonify({'error': 'Invalid role'}), 400

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete user'}), 500

# Session Management
@admin_bp.route('/sessions', methods=['GET'])
@admin_required
def get_sessions(current_user_id):
    """Get all sessions"""
    try:
        sessions = Session.query.all()
        return jsonify([session.to_dict() for session in sessions]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500

@admin_bp.route('/sessions', methods=['POST'])
@admin_required
def create_session(current_user_id):
    """Create new session"""
    try:
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('attendantName'):
            return jsonify({'error': 'Title and attendant name required'}), 400

        # Create session
        session = Session(
            title=data['title'],
            attendant_name=data['attendantName'],
            schedule=data.get('schedule', ''),
            course_code=data.get('courseCode', ''),
            attendant_id=current_user_id,
            is_active=data.get('isActive', True)
        )
        
        # Set members if provided
        if data.get('members'):
            session.set_members(data['members'])
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify(session.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create session'}), 500

# Analytics
@admin_bp.route('/analytics', methods=['GET'])
@admin_required
def get_analytics(current_user_id):
    """Get system analytics"""
    try:
        # Count users from each table
        admins_count = Admin.query.count()
        attendants_count = Attendant.query.count()
        attendees_count = Attendee.query.count()
        total_users = admins_count + attendants_count + attendees_count
        active_sessions = Session.query.filter_by(is_active=True).count()

        return jsonify({
            'totalUsers': total_users,
            'activeUnits': active_sessions,
            'avgAttendance': 85,  # Mock data
            'activeSessions': active_sessions,
            'userDistribution': {
                'attendees': attendees_count,
                'attendants': attendants_count,
                'admins': admins_count
            },
            'recentActivity': [
                'New user registered',
                'Session created',
                'User updated'
            ]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch analytics'}), 500

# Full Attendance Report
@admin_bp.route('/reports/full', methods=['GET'])
@admin_required
def get_full_report(current_user_id):
    """Get comprehensive attendance report"""
    try:
        from app.models.attendance import Attendance

        # Get all sessions
        all_sessions = Session.query.all()
        total_sessions = len(all_sessions)
        active_sessions_count = Session.query.filter_by(is_active=True).count()

        # Get all attendance records
        all_attendance = Attendance.query.all()
        total_attendance_records = len(all_attendance)

        # Calculate attendance by status
        present_count = Attendance.query.filter_by(status='Present').count()

        # Get all attendees
        all_attendees = Attendee.query.all()
        total_attendees = len(all_attendees)

        # Calculate average attendance percentage
        avg_attendance = (present_count / total_attendance_records * 100) if total_attendance_records > 0 else 0

        # Get session details with attendance
        sessions_report = []
        for session in all_sessions:
            session_attendance = Attendance.query.filter_by(session_id=session.id).all()
            present_in_session = len([a for a in session_attendance if a.status == 'Present'])

            sessions_report.append({
                'id': session.id,
                'title': session.title,
                'courseCode': session.course_code,
                'attendantName': session.attendant_name,
                'schedule': session.schedule,
                'isActive': session.is_active,
                'totalAttendees': len(session_attendance),
                'presentCount': present_in_session,
                'attendanceRate': (present_in_session / len(session_attendance) * 100) if len(session_attendance) > 0 else 0,
                'createdAt': session.created_at.isoformat() if session.created_at else None
            })

        # Get student attendance summary
        students_report = []
        for attendee in all_attendees:
            attendee_records = Attendance.query.filter_by(attendee_id=attendee.id).all()
            present_records = len([r for r in attendee_records if r.status == 'Present'])

            students_report.append({
                'id': attendee.id,
                'name': attendee.name,
                'email': attendee.email,
                'serial': attendee.serial,
                'enrolledCourses': attendee.units.split(',') if attendee.units else [],
                'totalSessions': len(attendee_records),
                'presentCount': present_records,
                'attendanceRate': (present_records / len(attendee_records) * 100) if len(attendee_records) > 0 else 0
            })

        # Sort students by attendance rate (lowest first to identify at-risk students)
        students_report.sort(key=lambda x: x['attendanceRate'])

        return jsonify({
            'summary': {
                'totalSessions': total_sessions,
                'activeSessions': active_sessions_count,
                'totalAttendanceRecords': total_attendance_records,
                'totalStudents': total_attendees,
                'averageAttendance': round(avg_attendance, 2),
                'presentCount': present_count
            },
            'sessions': sessions_report,
            'students': students_report,
            'generatedAt': datetime.now(timezone.utc).isoformat()
        }), 200

    except Exception as e:
        print(f"❌ Error generating report: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to generate report'}), 500