from datetime import datetime
from typing import Optional
from ..models import db, AdminSession

class DeviceServiceError(Exception):
    pass

class DeviceService:
    @staticmethod
    def start_session(admin_id: int, ble_id: str) -> AdminSession:
        """Start a BLE session for admin. Deactivates any existing active sessions first."""
        # Deactivate existing active sessions for this admin
        existing = AdminSession.query.filter_by(admin_id=admin_id, active=True).all()
        for s in existing:
            s.active = False
            s.stopped_at = datetime.utcnow()
        
        # Find or create session
        session = AdminSession.query.filter_by(admin_id=admin_id, ble_id=ble_id).first()
        if session is None:
            session = AdminSession(admin_id=admin_id, ble_id=ble_id)
            db.session.add(session)
        
        # Activate session
        session.active = True
        session.started_at = datetime.utcnow()
        session.stopped_at = None
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise DeviceServiceError(f"Failed to start session: {e}")
        return session
    
    @staticmethod
    def stop_session(admin_id: int, ble_id: Optional[str] = None) -> Optional[AdminSession]:
        """Stop active session. If ble_id provided, stop that session; otherwise stop any active session for admin."""
        query = AdminSession.query.filter_by(admin_id=admin_id, active=True)
        if ble_id is not None:
            query = query.filter_by(ble_id=ble_id)
        
        session = query.first()
        if not session:
            return None
        
        session.active = False
        session.stopped_at = datetime.utcnow()
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise DeviceServiceError(f"Failed to stop session: {e}")
        return session
    
    @staticmethod
    def is_ble_active(ble_id: str) -> bool:
        """Return True if ble_id is currently active for any admin/session."""
        return AdminSession.query.filter_by(ble_id=ble_id, active=True).count() > 0
    
    @staticmethod
    def get_active_sessions(admin_id: Optional[int] = None):
        """Get all active sessions, optionally filtered by admin_id."""
        query = AdminSession.query.filter_by(active=True)
        if admin_id is not None:
            query = query.filter_by(admin_id=admin_id)
        return query.all()