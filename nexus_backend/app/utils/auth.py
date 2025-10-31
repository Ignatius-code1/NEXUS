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

            # Extract numeric ID from token (format: "attendant_2", "attendee_6", "admin_1")
            if isinstance(current_user_id, str) and '_' in current_user_id:
                user_id = int(current_user_id.split('_')[1])
            else:
                user_id = current_user_id

            return f(user_id, *args, **kwargs)
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
            from app.models.admin_model import Admin

            # Extract ID from token (format: "admin_1")
            if isinstance(current_user_id, str) and current_user_id.startswith('admin_'):
                admin_id = int(current_user_id.split('_')[1])
                admin = Admin.query.get(admin_id)

                if not admin:
                    return jsonify({'error': 'Admin access required'}), 403

                return f(admin_id, *args, **kwargs)
            else:
                return jsonify({'error': 'Admin access required'}), 403
        except Exception as e:
            return jsonify({'error': 'Access denied'}), 403
    return decorated_function