from app import db
from datetime import datetime, timezone

class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    attendee_id = db.Column(db.Integer, db.ForeignKey('attendees.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    status = db.Column(db.String(20), default='Present')  # Present, Absent, Late
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationships
    attendee = db.relationship("Attendee", backref="attendance_records")
    session = db.relationship("Session", backref="attendance_records")

    def to_dict(self):
        return {
            'id': self.id,
            'attendee_id': self.attendee_id,
            'session_id': self.session_id,
            'status': self.status,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }