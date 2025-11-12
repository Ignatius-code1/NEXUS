from marshmallow import Schema, fields, validate

class DeviceCreateSchema(Schema):
    ble_id = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    device_name = fields.Str(validate=validate.Length(max=100))

class DeviceResponseSchema(Schema):
    id = fields.Int()
    ble_id = fields.Str()
    device_name = fields.Str()
    is_active = fields.Bool()
    last_activated = fields.DateTime()