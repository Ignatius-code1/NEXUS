from datetime import datetime, timezone
from typing import Optional
from app import db
from app.models.session_model import Session
from app.models.device_model import Device

class DeviceServiceError(Exception):
    """Custom exception for device service errors."""
    pass

class DeviceService:
    """Handles activation and management of session states."""

    @staticmethod
    def start_session(session_id: int) -> Session:
        """
        Mark a session as active and ensure only one active session per attendant.
        """
        session = Session.query.get(session_id)
        if not session:
            raise DeviceServiceError(f"Session with ID {session_id} not found.")

        # Deactivate any other active sessions by this attendant
        active_sessions = Session.query.filter_by(
            attendant_id=session.attendant_id,
            is_active=True
        ).all()

        for s in active_sessions:
            if s.id != session.id:
                s.is_active = False

        # Activate this session
        session.is_active = True
        session.created_at = datetime.now(timezone.utc)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise DeviceServiceError(f"Failed to start session: {e}")

        return session

    @staticmethod
    def stop_session(session_id: int) -> Optional[Session]:
        """
        Stop or deactivate a session.
        """
        session = Session.query.get(session_id)
        if not session:
            return None

        session.is_active = False

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise DeviceServiceError(f"Failed to stop session: {e}")

        return session

    @staticmethod
    def is_session_active(session_id: int) -> bool:
        """
        Check if a given session is currently active.
        """
        session = Session.query.get(session_id)
        return bool(session and session.is_active)

    @staticmethod
    def is_ble_active(ble_id: str) -> bool:
        """Check if a device with the given BLE ID is registered and active."""
        device = Device.query.filter_by(ble_id=ble_id, is_active=True).first()
        return device is not None
