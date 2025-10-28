import re
from typing import Tuple

BLE_ID_RE = re.compile(r"^[0-9A-F]{8,12}$") # after cleaning -- flexible length

def _remove_separators(s: str) -> str:
return re.sub(r"[^0-9A-Fa-f]", "", s)

def clean_ble_id(raw: str) -> str:
if raw is None:
raise ValueError("ble_id is required")
raw = str(raw).strip()
if raw == "":
raise ValueError("ble_id is empty")
cleaned = _remove_separators(raw).upper()
if not BLE_ID_RE.match(cleaned):
raise ValueError(f"invalid ble_id format after cleaning: '{cleaned}'")
return cleaned

def clean_rssi(raw) -> int:
if raw is None:
raise ValueError("rssi is required")
try:
r = int(float(raw))
except Exception:
raise ValueError("rssi must be numeric")
# sensible bounds for RSSI in dBm
if r > 0:
# RSSI shouldn't be positive for BLE; clamp to a realistic max
r = min(r, -30)
if r < -120:
r = -120
return r

def parse_and_validate(raw_ble, raw_rssi) -> Tuple[str, int]:
"""Return (ble_id, rssi) after cleaning and validation."""
ble = clean_ble_id(raw_ble)
rssi = clean_rssi(raw_rssi)
return ble, rssi