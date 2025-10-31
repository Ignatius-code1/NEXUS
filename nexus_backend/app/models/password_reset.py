from app import db
from datetime import datetime, timedelta, timezone
import secrets

class PasswordReset(db.Model):
    __tablename__ = 'password_resets'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    @staticmethod
    def generate_code():
        """Generate 6-digit reset code"""
        return str(secrets.randbelow(900000) + 100000)
    
    @staticmethod
    def create_reset_code(email):
        """Create new password reset code"""
        # Delete old codes for this email
        PasswordReset.query.filter_by(email=email).delete()
        
        # Create new code
        reset = PasswordReset(
            email=email,
            code=PasswordReset.generate_code(),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)  # 15 minutes expiry
        )
        
        db.session.add(reset)
        db.session.commit()
        return reset
    
    def is_valid(self):
        """Check if code is still valid"""
        return not self.used and datetime.now(timezone.utc) < self.expires_at
    
    def mark_used(self):
        """Mark code as used"""
        self.used = True
        db.session.commit()