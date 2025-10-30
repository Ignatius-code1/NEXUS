from app.services.bluetoothservive import is_attendance_valid
from app.models.attendance import Attendance
from app.models.device_model import Device
from app import db
from datetime import datetime


class AttendanceService:
    """Handles attendance validation and record management."""

    @staticmethod
    def mark_attendance(admin_ble_raw: str, student_ble_raw: str, student_rssi_raw: int):
        """
        Validates BLE signals and records attendance if valid.
        Returns a tuple (status, message).
        """

        # Step 1: Validate BLE signal match
        result = is_attendance_valid(
            admin_ble_raw=admin_ble_raw,
            student_ble_raw=student_ble_raw,
            student_rssi_raw=student_rssi_raw
        )

        if result == 'NO':
            return "NO", "Invalid BLE signal or weak proximity"

        # Step 2: Find the student device
        student_device = Device.query.filter_by(ble_id=student_ble_raw).first()
        if not student_device:
            return "NO", "Student device not found"

        student_id = student_device.owner_id  # Assuming each device belongs to a student

        # Step 3: Record attendance
        new_record = Attendance(
            student_id=student_id,
            timestamp=datetime.utcnow(),
            status='PRESENT'
        )
        db.session.add(new_record)
        db.session.commit()

        return "YES", f"Attendance marked for student ID {student_id}"

    @staticmethod
    def get_attendance(student_id: int):
        """Retrieve attendance history for a given student."""
        return Attendance.query.filter_by(student_id=student_id).order_by(Attendance.timestamp.desc()).all()

    @staticmethod
    def get_all_attendance():
        """Retrieve all attendance records."""
        return Attendance.query.order_by(Attendance.timestamp.desc()).all()
