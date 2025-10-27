from app import ma
from app.models.attendance_model import Attendance
from marshmallow import fields


class AttendanceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attendance
        load_instance = True
        include_fk = True

    # Nested relationships — show basic info
    attendee = fields.Nested("UserSchema", only=("id", "full_name", "email"), dump_only=True)
    attendant = fields.Nested("UserSchema", only=("id", "full_name", "email"), dump_only=True)
    session = fields.Nested("SessionSchema", only=("id", "topic", "start_time", "end_time"), dump_only=True)


attendance_schema = AttendanceSchema()
attendances_schema = AttendanceSchema(many=True)
