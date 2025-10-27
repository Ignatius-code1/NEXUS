from marshmallow import Schema, fields, validate

class DeviceSchema(Schema):
    """Schema for validating and serializing device data."""

    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True, description="Owner of the device (attendant ID)")
    ble_id = fields.Str(required=True, validate=validate.Length(min=5))
    device_name = fields.Str(required=True)
    is_active = fields.Bool(dump_only=True)
    registered_at = fields.DateTime(dump_only=True)


class DeviceRegisterSchema(Schema):
    """Schema for registering a new device (input-only)."""

    ble_id = fields.Str(required=True, validate=validate.Length(min=5))
    device_name = fields.Str(required=True)
