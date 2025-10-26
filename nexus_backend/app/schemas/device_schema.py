from marshmallow import Schema, fields, validate

class DeviceSchema(Schema):
    
    # Schema for validating and serializing device data.
    # Used when a teacher/attendant registers their Bluetooth device.
    
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True, description="Owner of the device (attendant ID)")
    ble_id = fields.Str(required=True, validate=validate.Length(min=5), description="Unique Bluetooth ID")
    device_name = fields.Str(required=True, description="Device name or label")
    is_active = fields.Bool(dump_only=True, description="Whether the device is currently active")
    registered_at = fields.DateTime(dump_only=True)

# Optional — for simplified responses
class DeviceRegisterSchema(Schema):

    # Schema for registering a new device (input-only).
    
    ble_id = fields.Str(required=True, validate=validate.Length(min=5))
    device_name = fields.Str(required=True)
