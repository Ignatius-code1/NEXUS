# app/schemas/admin_schema.py
from app import ma
from app.models.admin_model import Admin

class AdminSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Admin
        load_instance = True
        include_fk = True

admin_schema = AdminSchema()
admins_schema = AdminSchema(many=True)

# This schema is used to serialize and deserialize Admin model instances.
# It includes all fields from the Admin model and allows for instance loading.