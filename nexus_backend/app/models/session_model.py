from app.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Session(db.Model, SerializerMixin):
    
    # Represents a class session created by a teacher.
    # Each session has a unique code and is linked to one teacher (User).
    
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(120), nullable=False)
    session_code = db.Column(db.String(50), unique=True, nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    # Foreign key → teacher who created this session
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationships
    teacher = db.relationship("User", back_populates="sessions")
    attendances = db.relationship("Attendance", back_populates="session", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Session {self.class_name} - {self.subject}>"