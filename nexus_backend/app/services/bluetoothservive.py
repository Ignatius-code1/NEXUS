# from typing import Literal
# from app.utils.device_fingerprint import parse_and_validate
# from app.services.device_service import DeviceService

# def is_attendance_valid(admin_ble_raw, student_ble_raw, student_rssi_raw, rssi_threshold: int = -65) -> Literal['YES', 'NO']:

# try:      #normalize inputs
# admin_ble, _ = parse_and_validate(admin_ble_raw, -90) # only need ble cleaning here
# except Exception:
# return 'NO'

# try:
# student_ble, student_rssi = parse_and_validate(student_ble_raw, student_rssi_raw)
# except Exception:
# return 'NO'

# admin_active = DeviceService.is_ble_active(admin_ble)   # check if the admin is  active

# if not admin_active:
# return 'NO'

# if student_rssi >= rssi_threshold:   # check rssi threshold (higher/more positive = stronger)
# return 'YES'
# return 'NO'

from typing import Literal
from app.utils.fingerprint import parse_and_validate
from app.services.device_service import DeviceService




def is_attendance_valid(
    admin_ble_raw: str,
    student_ble_raw: str,
    student_rssi_raw,
    rssi_threshold: int = -65
) -> Literal['YES', 'NO']:
    """Check if BLE-based attendance is valid."""

    # Normalize inputs
    try:
        admin_ble, _ = parse_and_validate(admin_ble_raw, -90)  # only BLE cleaning
    except Exception:
        return 'NO'

    try:
        student_ble, student_rssi = parse_and_validate(student_ble_raw, student_rssi_raw)
    except Exception:
        return 'NO'

    # Check if admin BLE is active
    admin_active = DeviceService.is_ble_active(admin_ble)
    if not admin_active:
        return 'NO'

    # Check RSSI threshold (higher/more positive = stronger)
    if student_rssi >= rssi_threshold:
        return 'YES'

    return 'NO'
