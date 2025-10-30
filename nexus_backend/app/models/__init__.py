from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Mock models for testing
class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    attendee_id = db.Column(db.Integer, nullable=False)
    class_session_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)

class ClassSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)

class attendee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class AdminSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, nullable=False)
    ble_id = db.Column(db.String(20), nullable=False)
    active = db.Column(db.Boolean, default=False)
    started_at = db.Column(db.DateTime, nullable=True)
    stopped_at = db.Column(db.DateTime, nullable=True)