from app.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Session(db.Model, SerializerMixin):
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(120), nullable=False)
    session_code = db.Column(db.String(50), unique=True, nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    # Foreign key → attendant (teacher)
    attendant_id = db.Column(db.Integer, db.ForeignKey("attendants.id"), nullable=False)

    # Relationships
    attendant = db.relationship("Attendant", back_populates="sessions")
    attendance_records = db.relationship("Attendance", back_populates="session", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Session {self.class_name} - {self.subject}>"
