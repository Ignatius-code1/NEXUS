from flask import Blueprint, request, jsonify
from ..services.device_service import DeviceService, DeviceServiceError

session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/session/start", methods=["POST"])
def start_session():
    """Start a BLE session for teacher"""
    try:
        data = request.get_json()
        if not data:
            raise handle_validation_error("Request body required")
        
        admin_id = data.get('admin_id')
        ble_id = data.get('ble_id')
        
        if not admin_id or not ble_id:
            raise handle_validation_error("admin_id and ble_id required")
        
        session = DeviceService.start_session(admin_id, ble_id)
        
        return jsonify({
            'success': True,
            'message': 'Session started',
            'session': {
                'id': session.id,
                'admin_id': session.admin_id,
                'ble_id': session.ble_id,
                'active': session.active,
                'started_at': session.started_at.isoformat()
            }
        }), 201
        
    except DeviceServiceError as e:
        raise APIError(str(e), 400, "DEVICE_ERROR")
    except APIError:
        raise
    except Exception as e:
        raise APIError(f"Failed to start session: {str(e)}", 500, "SERVER_ERROR")

@session_bp.route("/session/stop", methods=["POST"])
def stop_session():
    """Stop a BLE session for teacher"""
    try:
        data = request.get_json()
        if not data:
            raise handle_validation_error("Request body required")
        
        admin_id = data.get('admin_id')
        ble_id = data.get('ble_id')  # Optional
        
        if not admin_id:
            raise handle_validation_error("admin_id required")
        
        session = DeviceService.stop_session(admin_id, ble_id)
        
        if not session:
            return jsonify({
                'success': False,
                'message': 'No active session found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Session stopped',
            'session': {
                'id': session.id,
                'admin_id': session.admin_id,
                'ble_id': session.ble_id,
                'active': session.active,
                'stopped_at': session.stopped_at.isoformat()
            }
        }), 200
        
    except DeviceServiceError as e:
        raise APIError(str(e), 400, "DEVICE_ERROR")
    except APIError:
        raise
    except Exception as e:
        raise APIError(f"Failed to stop session: {str(e)}", 500, "SERVER_ERROR")

@session_bp.route("/session/status/<int:admin_id>", methods=["GET"])
def get_session_status(admin_id):
    """Get active sessions for admin"""
    try:
        sessions = DeviceService.get_active_sessions(admin_id)
        
        return jsonify({
            'admin_id': admin_id,
            'active_sessions': [{
                'id': s.id,
                'ble_id': s.ble_id,
                'started_at': s.started_at.isoformat() if s.started_at else None
            } for s in sessions]
        }), 200
        
    except Exception as e:
        raise APIError(f"Failed to get session status: {str(e)}", 500, "SERVER_ERROR")