# app/schemas/attendant_schema.py
from app import ma
from app.models.attendant_model import Attendant

class AttendantSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attendant
        load_instance = True
        include_fk = False  # no foreign keys in this model

attendant_schema = AttendantSchema()
attendants_schema = AttendantSchema(many=True)

# include_fk = False is set because Attendant model does not have foreign keys.