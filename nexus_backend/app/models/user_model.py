from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20))  # 'attendee' or 'attendant'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #  Serializer config
    serialize_rules = ('-password_hash', '-devices.attendant', '-sessions.attendant', '-attendance_records.attendee')

    def __repr__(self):
        return f"<User {self.name} ({self.role})>"
