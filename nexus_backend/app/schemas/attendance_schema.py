# app/schemas/attendance_schema.py
from app import ma
from app.models.attendance_model import Attendance

class AttendanceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attendance
        load_instance = True
        include_fk = True  # include user_id and session_id

attendance_schema = AttendanceSchema()
attendances_schema = AttendanceSchema(many=True)

# This schema is used to serialize and deserialize Attendance model instances.
# It includes all fields from the Attendance model and allows for instance loading.
# The `include_fk` option ensures that foreign keys (user_id, session_id) are included in the serialized output.
# The `load_instance` option allows for deserialization into model instances.
# The `attendance_schema` is used for single attendance records, while `attendances_schema
