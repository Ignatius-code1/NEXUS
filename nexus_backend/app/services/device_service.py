from datetime import datetime
.filter_by(admin_id=admin_id, active=True)
.with_for_update()
.all()

for s in existing:
s.active = False
s.stopped_at = datetime.utcnow()

session = adminSession.query.filter_by(admin_id=admin_id, ble_id=ble_id).first()
if session is None:
session = adminSession(admin_id=admin_id, ble_id=ble_id)
db.session.add(session)

session.active = True
session.started_at = datetime.utcnow()
session.stopped_at = None

try:
db.session.commit()
except Exception as e:
db.session.rollback()
raise DeviceServiceError(f"failed to start session: {e}")
return session

@staticmethod
def stop_session(admin_id: int, ble_id: Optional[str] = None) -> Optional[adminSession]:
#Stop the active session. If ble_id provided, stop that session; otherwise stop any active session for admin.
#Returns the stopped adminSession or None if none found.
query = adminSession.query.filter_by(admin_id=admin_id, active=True)
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
raise DeviceServiceError(f"failed to stop session: {e}")
return session

@staticmethod
def is_ble_active(ble_id: str) -> bool:
#Return True if ble_id is currently active for any admin/session."""
return (
adminSession.query.filter_by(ble_id=ble_id, active=True).count() > 0
)