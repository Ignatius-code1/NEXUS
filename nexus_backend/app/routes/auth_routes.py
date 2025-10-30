from flask import Blueprint, request, jsonify
from app import db
from app.models.admin_model import Admin
from app.models.attendant_model import Attendant
from app.models.attendee_model import Attendee
from app.models.password_reset import PasswordReset
from app.utils.auth import generate_token
from app.utils.email import send_reset_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Universal login for all user types"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data['email']
        password = data['password']
        user = None
        
        # Check Admin first
        user = Admin.query.filter_by(email=email).first()
        if user and user.check_password(password):
            user.update_last_login()
            token = generate_token(f"admin_{user.id}")
            return jsonify({'user': user.to_dict(), 'token': token}), 200
        
        # Check Attendant
        user = Attendant.query.filter_by(email=email).first()
        if user and user.check_password(password):
            user.update_last_login()
            token = generate_token(f"attendant_{user.id}")
            return jsonify({'user': user.to_dict(), 'token': token}), 200
        
        # Check Attendee
        user = Attendee.query.filter_by(email=email).first()
        if user and user.check_password(password):
            user.update_last_login()
            token = generate_token(f"attendee_{user.id}")
            return jsonify({'user': user.to_dict(), 'token': token}), 200
        
        return jsonify({'error': 'Invalid email or password'}), 401
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset code to email"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email required'}), 400
        
        email = data['email']
        
        # Check if user exists in any table
        user_exists = (Admin.query.filter_by(email=email).first() or
                      Attendant.query.filter_by(email=email).first() or
                      Attendee.query.filter_by(email=email).first())
        
        if not user_exists:
            return jsonify({'error': 'Email not found'}), 404
        
        # Create reset code
        reset = PasswordReset.create_reset_code(email)
        
        # Send email
        email_sent = send_reset_email(email, reset.code)
        
        return jsonify({'message': 'Reset code sent to your email'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to send reset code'}), 500

@auth_bp.route('/verify-reset-code', methods=['POST'])
def verify_reset_code():
    """Verify password reset code"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('code'):
            return jsonify({'error': 'Email and code required'}), 400
        
        email = data['email']
        code = data['code']
        
        # Find valid reset code
        reset = PasswordReset.query.filter_by(email=email, code=code).first()
        
        if not reset or not reset.is_valid():
            return jsonify({'error': 'Invalid or expired code'}), 400
        
        return jsonify({'message': 'Code verified successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Code verification failed'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with verified code"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('code') or not data.get('newPassword'):
            return jsonify({'error': 'Email, code, and new password required'}), 400
        
        email = data['email']
        code = data['code']
        new_password = data['newPassword']
        
        # Find valid reset code
        reset = PasswordReset.query.filter_by(email=email, code=code).first()
        
        if not reset or not reset.is_valid():
            return jsonify({'error': 'Invalid or expired code'}), 400
        
        # Find user in any table and update password
        user = (Admin.query.filter_by(email=email).first() or
                Attendant.query.filter_by(email=email).first() or
                Attendee.query.filter_by(email=email).first())
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update password
        user.set_password(new_password)
        reset.mark_used()
        
        db.session.commit()
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Password reset failed'}), 500