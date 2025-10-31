from marshmallow import Schema, fields, validate

class SessionCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    course_code = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    schedule = fields.Str(required=True)

class SessionResponseSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    course_code = fields.Str()
    schedule = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime()