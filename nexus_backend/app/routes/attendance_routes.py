from flask import Blueprint, request, jsonify
from app.services.bluetoothservie import is_attendance_valid
from app.models.attendance import Attendance
from app.models.session_model import Session      
from app.models.attendee_model import Attendee
from app.db import db
import logging

attendance_bp = Blueprint('attendance', __name__, url_prefix='/api/attendance')
logger = logging.getLogger(__name__)


@attendance_bp.route('/validate', methods=['POST'])
def validate_attendance():
    """
    Validate BLE-based attendance.
    Expected JSON body:
    {
        "admin_ble_raw": "...",
        "student_ble_raw": "...",
        "student_rssi_raw": -60
    }
    """
    try:
        data = request.get_json()

        # Extract and validate required fields
        admin_ble_raw = data.get("admin_ble_raw")
        student_ble_raw = data.get("student_ble_raw")
        student_rssi_raw = data.get("student_rssi_raw")

        if not all([admin_ble_raw, student_ble_raw, student_rssi_raw is not None]):
            return jsonify({"error": "Missing required fields"}), 400

        # Use Bluetooth service to check validity
        result = is_attendance_valid(admin_ble_raw, student_ble_raw, student_rssi_raw)

        logger.info(f"BLE validation result: {result}")

        if result == 'YES':
            return jsonify({"valid": True, "message": "Attendance validated"}), 200
        else:
            return jsonify({"valid": False, "message": "Validation failed"}), 400

    except Exception as e:
        logger.exception("Error during BLE validation")
        return jsonify({"error": str(e)}), 500


@attendance_bp.route('/mark', methods=['POST'])
def mark_attendance():
    """
    Mark student attendance after BLE validation.
    Expected JSON body:
    {
        "session_id": 1,
        "attendee_id": 5,
        "status": "present" or "absent"
    }
    """
    try:
        data = request.get_json()

        session_id = data.get("session_id")
        attendee_id = data.get("attendee_id")
        status = data.get("status", "present")

        if not all([session_id, attendee_id]):
            return jsonify({"error": "Missing session_id or attendee_id"}), 400

        #  use the Session model instead of ClassSession
        session = Session.query.get(session_id)
        attendee = Attendee.query.get(attendee_id)

        if not session or not attendee:
            return jsonify({"error": "Invalid session or attendee"}), 404

        # Create attendance record
        attendance = Attendance(
            class_session_id=session_id,
            attendee_id=attendee_id,
            status=status
        )

        db.session.add(attendance)
        db.session.commit()

        return jsonify({"message": "Attendance marked successfully"}), 201

    except Exception as e:
        db.session.rollback()
        logger.exception("Error marking attendance")
        return jsonify({"error": str(e)}), 500
