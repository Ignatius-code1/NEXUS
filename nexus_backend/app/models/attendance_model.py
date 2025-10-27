from app.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


class Attendance(db.Model, SerializerMixin):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)

    # Foreign keys
    attendee_id = db.Column(db.Integer, db.ForeignKey("attendees.id"), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey("sessions.id"), nullable=False)

    # Attendance details
    check_in_time = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="Present")  # e.g., Present, Late, Absent
    rssi_strength = db.Column(db.Float, nullable=True)    # Bluetooth signal strength for verification

    # Relationships
    attendee = db.relationship("Attendee", back_populates="attendance_records")
    session = db.relationship("Session", back_populates="attendance_records")

    # Serializer config
    serialize_rules = ("-attendee.attendance_records", "-session.attendance_records",)

    def __repr__(self):
        return f"<Attendance Attendee={self.attendee_id}, Session={self.session_id}, Status={self.status}>"
