from app import ma
from app.models.session_model import Session
from marshmallow import fields


class SessionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Session
        load_instance = True
        include_fk = True
        # Optional: define fields if you want to exclude internal IDs, etc.
        # fields = ("id", "title", "description", "start_time", "end_time", "attendants")

    # If you have relationships, you can nest them
    attendants = fields.Nested('AttendantSchema', many=True, exclude=("sessions",))


# Create instances for easy use in routes
session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)
