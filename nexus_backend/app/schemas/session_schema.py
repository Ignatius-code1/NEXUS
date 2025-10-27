from app import ma
from app.models.session_model import Session
from marshmallow import fields


class SessionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Session
        load_instance = True
        include_fk = True

    # Show related attendants and attendees if you track them
    attendants = fields.Nested("UserSchema", many=True, only=("id", "full_name", "email"), dump_only=True)
    attendees = fields.Nested("UserSchema", many=True, only=("id", "full_name", "email"), dump_only=True)


session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)
