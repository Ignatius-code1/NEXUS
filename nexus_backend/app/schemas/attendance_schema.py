from marshmallow import Schema, fields

class AttendanceMarkSchema(Schema):
    admin_ble_raw = fields.Str(required=True)
    student_ble_raw = fields.Str(required=True)
    student_rssi_raw = fields.Int(required=True)

class AttendanceResponseSchema(Schema):
    id = fields.Int()
    attendee_id = fields.Int()
    session_id = fields.Int()
    status = fields.Str()
    timestamp = fields.DateTime()