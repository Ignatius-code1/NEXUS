from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from app.config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    # Create Flask application
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Import models (needed for migrations)
    from app.models import admin_model, attendant_model, attendee_model, password_reset, session_model, attendance
    
    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.attendant_routes import attendant_bp
    from app.routes.attendee_routes import attendee_bp
    from app.routes.bulk_upload import bulk_bp
    from app.routes.report_routes import report_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(attendant_bp, url_prefix='/api/attendant')
    app.register_blueprint(attendee_bp, url_prefix='/api/attendee')
    app.register_blueprint(bulk_bp, url_prefix='/api/bulk')
    app.register_blueprint(report_bp, url_prefix='/api/v1')
    
    return app