from app.supabase import supabase
from datetime import datetime


def save_attendance_record(device_id, attendee_id):
    """Save a single attendance record to Supabase.

    Returns True on success, False on failure.
    """
    record = {
        'device_id': device_id,
        'attendee_id': attendee_id,
        'timestamp': datetime.utcnow().isoformat()
    }

    response = supabase.table('attendance').insert(record).execute()

    if getattr(response, 'error', None):
        return False

    return True
