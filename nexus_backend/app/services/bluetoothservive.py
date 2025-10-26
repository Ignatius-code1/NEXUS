from typing import Literal


from app.utils.device_fingerprint import parse_and_validate
from app.services.device_service import DeviceService




def is_attendance_valid(teacher_ble_raw, student_ble_raw, student_rssi_raw, rssi_threshold: int = -65) -> Literal['YES', 'NO']:
# normalize inputs
try:
teacher_ble, _ = parse_and_validate(teacher_ble_raw, -90) # only need ble cleaning here
except Exception:
return 'NO'


try:
student_ble, student_rssi = parse_and_validate(student_ble_raw, student_rssi_raw)
except Exception:
return 'NO'


# check teacher active
teacher_active = DeviceService.is_ble_active(teacher_ble)
if not teacher_active:
return 'NO'


# check rssi threshold (higher/more positive = stronger)
if student_rssi >= rssi_threshold:
return 'YES'


return 'NO'