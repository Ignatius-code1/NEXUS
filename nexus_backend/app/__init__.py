# Import Flask to create our application
from flask import Flask

# This function creates and configures the Flask app
def create_app(config_file='config.py'):
    # Create the Flask application instance
    app = Flask(__name__)
    
    # Load configuration from file
    app.config.from_pyfile(config_file)
    
    # Future: Add your routes or blueprints here
    # Example:
    # from .routes import main_routes
    # app.register_blueprint(main_routes)
    
    return app  

