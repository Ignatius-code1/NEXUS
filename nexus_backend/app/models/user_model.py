from app.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    #  Primary Key
    id = db.Column(db.Integer, primary_key=True)

    #  Basic Info
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'teacher'

    #  Authentication
    password_hash = db.Column(db.String(255), nullable=False)

    #  Device relationship (for teachers)
    devices = db.relationship('Device', back_populates='teacher', lazy=True)

    #  Sessions (for teachers)
    sessions = db.relationship('Session', back_populates='teacher', lazy=True)

    #  Attendance logs (for students)
    attendance_records = db.relationship('Attendance', back_populates='student', lazy=True)

    #  Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #  Serializer config
    serialize_rules = ('-password_hash', '-devices.teacher', '-sessions.teacher', '-attendance_records.student')

    def __repr__(self):
        return f"<User {self.name} ({self.role})>"
