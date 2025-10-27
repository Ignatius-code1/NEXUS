from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    """Schema for validating and serializing user data (admin, attendant, attendee)."""

    id = fields.Int(dump_only=True)
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    role = fields.Str(required=True, validate=validate.OneOf(["admin", "attendant", "attendee"]))

    password = fields.Str(load_only=True, required=True, validate=validate.Length(min=6))

    # Optional role-specific data
    attendee_code = fields.Str(allow_none=True)
    department = fields.Str(allow_none=True)
    attendant_code = fields.Str(allow_none=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
