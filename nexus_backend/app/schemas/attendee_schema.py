# app/schemas/attendee_schema.py
from app import ma
from app.models.attendee_model import Attendee

class AttendeeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attendee
        load_instance = True
        include_fk = False  # Attendee doesn’t have any foreign keys

attendee_schema = AttendeeSchema()
attendees_schema = AttendeeSchema(many=True)
