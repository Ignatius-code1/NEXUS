from app import db
from datetime import datetime

class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)  # Session name
    instructor = db.Column(db.String(120), nullable=False)  # Instructor name
    schedule = db.Column(db.String(200), nullable=False)  # Schedule info
    course_code = db.Column(db.String(50), nullable=False)  # Course code
    is_active = db.Column(db.Boolean, default=True)
    members = db.Column(db.Text, nullable=True)  # JSON string of member IDs
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign key to teacher/creator
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationships
    teacher = db.relationship("User", back_populates="sessions")

    def to_dict(self):
        """Convert session to dictionary"""
        import json
        return {
            'id': self.id,
            'title': self.title,
            'instructor': self.instructor,
            'schedule': self.schedule,
            'courseCode': self.course_code,
            'isActive': self.is_active,
            'members': json.loads(self.members) if self.members else [],
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

    def set_members(self, member_list):
        """Set members as JSON string"""
        import json
        self.members = json.dumps(member_list) if member_list else None