from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.attendance import Attendance
from app.models.attendee_model import Attendee
from app.services.bluetoothservive import is_attendance_valid
from app.schemas.attendance_schema import AttendanceMarkSchema, AttendanceResponseSchema
from datetime import datetime, timezone

attendance_bp = Blueprint('attendance_bp', __name__)

@attendance_bp.route('/attendance/mark-ble', methods=['POST'])
@jwt_required()
def mark_attendance_ble():
    """Main check-in API endpoint for BLE-based attendance"""
    current_user_id = get_jwt_identity()
    schema = AttendanceMarkSchema()
    
    try:
        data = schema.load(request.json)
    except Exception as e:
        return jsonify({'error': 'Invalid input data', 'details': str(e)}), 400
    
    # Validate BLE attendance using Grace's logic
    result = is_attendance_valid(
        admin_ble_raw=data['admin_ble_raw'],
        student_ble_raw=data['student_ble_raw'],
        student_rssi_raw=data['student_rssi_raw']
    )
    
    if result == 'NO':
        return jsonify({
            'status': 'FAILED',
            'message': 'Attendance validation failed - weak signal or inactive session'
        }), 400
    
    # Find active session (simplified - assumes one active session)
    from app.models.session_model import Session
    active_session = Session.query.filter_by(is_active=True).first()
    if not active_session:
        return jsonify({
            'status': 'FAILED',
            'message': 'No active session found'
        }), 400
    
    # Create attendance record
    attendance = Attendance(
        attendee_id=current_user_id,
        session_id=active_session.id,
        status='Present',
        timestamp=datetime.now(timezone.utc)
    )
    
    db.session.add(attendance)
    db.session.commit()
    
    return jsonify({
        'status': 'SUCCESS',
        'message': 'Attendance marked successfully',
        'attendance': AttendanceResponseSchema().dump(attendance.to_dict())
    }), 201

@attendance_bp.route('/attendance/history', methods=['GET'])
@jwt_required()
def get_attendance_history():
    """Get attendance history for current user"""
    current_user_id = get_jwt_identity()
    records = Attendance.query.filter_by(attendee_id=current_user_id).all()
    return jsonify([AttendanceResponseSchema().dump(r.to_dict()) for r in records])