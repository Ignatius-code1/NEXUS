from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize SQLAlchemy
db = SQLAlchemy()

# Initialize Migrate (we'll connect it in app/__init__.py)
migrate = Migrate()
 
