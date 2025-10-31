from app import db
from datetime import datetime

class Device(db.Model):
    __tablename__ = "devices"

    id = db.Column(db.Integer, primary_key=True)
    attendant_id = db.Column(db.Integer, db.ForeignKey("attendants.id"), nullable=False)

    # BLE (Bluetooth Low Energy) identification details
    ble_id = db.Column(db.String(120), unique=True, nullable=False)
    device_name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=False)
    last_activated = db.Column(db.DateTime, nullable=True)

    # Relationship: A device belongs to one attendant
    attendant = db.relationship("Attendant", back_populates="devices")

    def activate(self):
        """Activate the device when a session starts."""
        self.is_active = True
        self.last_activated = datetime.utcnow()

    def deactivate(self):
        """Deactivate the device after session ends."""
        self.is_active = False

    def __repr__(self):
        return f"<Device BLE={self.ble_id}, Active={self.is_active}>"
