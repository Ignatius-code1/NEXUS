from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='Attendee')  # Admin, Attendant, Attendee
    serial = db.Column(db.String(20), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    sessions = db.relationship("Session", back_populates="attendant", lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def generate_serial(self):
        """Generate serial number based on role"""
        if self.role == 'Attendee':
            self.serial = f"A-{1000 + self.id}"
        elif self.role == 'Attendant':
            self.serial = f"T-{2000 + self.id}"
        else:
            self.serial = f"ADM-{self.id}"
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'serial': self.serial,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }