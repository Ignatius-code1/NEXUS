from app import ma
from app.models.attendance_model import Attendance
from marshmallow import fields


class AttendanceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attendance
        load_instance = True
        include_fk = True

    # Nested relationships — link to attendant & session info
    attendant = fields.Nested("AttendantSchema", only=("id", "name", "email"))
    session = fields.Nested("SessionSchema", only=("id", "topic", "start_time", "end_time"))


# Single and multiple instances for easy use
attendance_schema = AttendanceSchema()
attendances_schema = AttendanceSchema(many=True)
