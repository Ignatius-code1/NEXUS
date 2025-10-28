<<<<<<< HEAD
import os
from datetime import timedelta

class Config:
    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'your-supabase-url')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-supabase-key')
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///nexus.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-flask-secret-key')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
=======
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key')
JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1hr time session

# App Configuration
DEBUG = os.getenv('DEBUG', 'False') == 'True'
TESTING = os.getenv('TESTING', 'False') == 'True'
>>>>>>> 871b0a69155a1b0ee752938bebdcdb803872651c
