from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity,
    decode_token
)
from datetime import timedelta
import jwt as pyjwt

def generate_token(user_id):
    """Generate JWT token for user"""
    return create_access_token(
        identity=user_id,
        expires_delta=current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
    )

def verify_token(token):
    """Verify JWT token"""
    try:
        decoded = decode_token(token)
        return decoded['sub']  # user_id
    except Exception as e:
        return None

def auth_required(f):
    """Decorator for protected routes"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            current_user_id = get_jwt_identity()
            return f(current_user_id, *args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated_function

def admin_required(f):
    """Decorator for admin-only routes"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            current_user_id = get_jwt_identity()
            from app.models.user_model import User
            user = User.query.get(current_user_id)
            
            if not user or user.role != 'Admin':
                return jsonify({'error': 'Admin access required'}), 403
                
            return f(current_user_id, *args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Access denied'}), 403
    return decorated_function