from flask import Flask
<<<<<<< HEAD
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
=======
from supabase import create_client
from flask_jwt_extended import JWTManager

def create_app(config_file='config.py'):
    # Create the Flask application instance
>>>>>>> 871b0a69155a1b0ee752938bebdcdb803872651c
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
<<<<<<< HEAD
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Import models (needed for migrations)
    from app.models import user_model, password_reset, session_model, attendance
    
    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.attendant_routes import attendant_bp
    from app.routes.attendee_routes import attendee_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(attendant_bp, url_prefix='/api/attendant')
    app.register_blueprint(attendee_bp, url_prefix='/api/attendee')
    
    return app
=======
    # Initialize Supabase client
    app.supabase = create_client(
        app.config['SUPABASE_URL'],
        app.config['SUPABASE_KEY']
    )
    
    # Setup JWT
    jwt = JWTManager(app)
    
    # Import and register blueprints
    from .routes import auth_routes
    app.register_blueprint(auth_routes)
    
    return app
>>>>>>> 871b0a69155a1b0ee752938bebdcdb803872651c
