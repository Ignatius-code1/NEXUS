from app.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Attendance(db.Model, SerializerMixin):
    
    # Stores attendance logs when an attendee successfully checks in via Bluetooth.
    # Each record ties an attendee to a session and marks the check-in time.
    
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)

    # Foreign keys
    attendee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey("sessions.id"), nullable=False)

    # Attendance details
    check_in_time = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="Present")  # e.g., Present, Late, Absent
    rssi_strength = db.Column(db.Float, nullable=True)     # optional: Bluetooth signal for verification

    # Relationships
    attendee = db.relationship("User", back_populates="attendances")
    session = db.relationship("Session", back_populates="attendances")

    def __repr__(self):
        return f"<Attendance Attendee={self.attendee_id}, Session={self.session_id}, Status={self.status}>"
