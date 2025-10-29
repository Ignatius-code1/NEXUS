# from app import ma
# from app.models.session_model import Session
# from marshmallow import fields

# class SessionSchema(ma.SQLAlchemyAutoSchema):
#     class Meta:
#         model = Session
#         load_instance = True
#         include_fk = True

#     attendant = fields.Nested("AttendantSchema", only=("id", "name", "email"))

# session_schema = SessionSchema()
# sessions_schema = SessionSchema(many=True)
