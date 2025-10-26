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
