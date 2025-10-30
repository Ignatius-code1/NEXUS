from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from dotenv import load_dotenv
import os
# from .models import db  # TODO: Uncomment after pulling models from other branch
from .routes.report_routes import report_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/nexus_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    # db.init_app(app)  # TODO: Uncomment after pulling models from other branch
    CORS(app)
    api = Api(app)
    
    # Register blueprints
    app.register_blueprint(report_bp, url_prefix='/api/v1')
    
    # with app.app_context():  # TODO: Uncomment after pulling models from other branch
    #     db.create_all()
    
    return app