from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    
    # Schema for validating and serializing user (attendant/attendee/admin) data.
    # Used in CRUD routes and authentication.
    
    id = fields.Int(dump_only=True)

    # Basic identity info
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    role = fields.Str(required=True, validate=validate.OneOf(["attendant", "attendee", "admin"]))

    # Optional fields for authentication
    password = fields.Str(load_only=True, required=True, validate=validate.Length(min=6))
 
    # Attendee-specific
    attendee_code = fields.Str(required=False, allow_none=True)
    department = fields.Str(required=False, allow_none=True)

    # Attendant-specific
    attendant_code = fields.Str(required=False, allow_none=True)

    # Metadata
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)