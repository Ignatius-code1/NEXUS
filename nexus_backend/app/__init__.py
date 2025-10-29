from flask import Flask
from supabase import create_client
from flask_jwt_extended import JWTManager

def create_app(config_file='config.py'):
    # Create the Flask application instance
    app = Flask(__name__)
    
    # Load configuration from file
    app.config.from_pyfile(config_file)
    
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
