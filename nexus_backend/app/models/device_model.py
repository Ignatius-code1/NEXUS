from app.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Device(db.Model, SerializerMixin):
    
    # Stores the Bluetooth device information for teachers.
    # Each teacher can have one registered BLE device used during attendance sessions.

    __tablename__ = "devices"

    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # BLE (Bluetooth Low Energy) identification details
    ble_id = db.Column(db.String(120), unique=True, nullable=False)  # unique Bluetooth MAC / UUID
    device_name = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=False)  # Active when teacher starts a session
    last_activated = db.Column(db.DateTime, nullable=True)

    # Relationship: A device belongs to one teacher
    teacher = db.relationship("User", back_populates="device")

    def activate(self):
        """Activate the device when a session starts."""
        self.is_active = True
        self.last_activated = datetime.utcnow()

    def deactivate(self):
        """Deactivate the device after session ends."""
        self.is_active = False

    def __repr__(self):
        return f"<Device BLE={self.ble_id}, Active={self.is_active}>"