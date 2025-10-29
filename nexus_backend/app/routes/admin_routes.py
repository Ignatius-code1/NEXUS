from flask import Blueprint, request, jsonify
from app import db
from app.models.user_model import User
from app.models.session_model import Session
from app.utils.auth import admin_required
from app.utils.email import send_welcome_email
import secrets

admin_bp = Blueprint('admin', __name__)

# User Management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user_id):
    """Get all users"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user(current_user_id):
    """Create new user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('email') or not data.get('role'):
            return jsonify({'error': 'Name, email and role required'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Generate random password
        temp_password = secrets.token_urlsafe(8)  # Simple 8-character password
        
        # Create user
        user = User(
            name=data['name'],
            email=data['email'],
            role=data['role']
        )
        user.set_password(temp_password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate serial
        user.generate_serial()
        db.session.commit()
        
        # Send welcome email with login details
        send_welcome_email(user.email, user.name, temp_password)
        
        return jsonify(user.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(current_user_id, user_id):
    """Update user"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if data.get('name'):
            user.name = data['name']
        if data.get('email'):
            user.email = data['email']
        if data.get('role'):
            user.role = data['role']
            user.generate_serial()  # Regenerate serial if role changes
        
        db.session.commit()
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update user'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user_id, user_id):
    """Delete user"""
    try:
        user = User.query.get_or_404(user_id)
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
        total_users = User.query.count()
        attendees = User.query.filter_by(role='Attendee').count()
        attendants = User.query.filter_by(role='Attendant').count()
        admins = User.query.filter_by(role='Admin').count()
        active_sessions = Session.query.filter_by(is_active=True).count()
        
        return jsonify({
            'totalUsers': total_users,
            'activeUnits': active_sessions,
            'avgAttendance': 85,  # Mock data
            'activeSessions': active_sessions,
            'userDistribution': {
                'attendees': attendees,
                'attendants': attendants,
                'admins': admins
            },
            'recentActivity': [
                'New user registered',
                'Session created',
                'User updated'
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch analytics'}), 500