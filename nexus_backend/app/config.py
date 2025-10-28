import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Flask application configuration"""

    # Supabase Configuration (for direct Supabase client if needed)
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'your-supabase-url')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-supabase-key')

    # Database Configuration - Use Supabase PostgreSQL
    # Format: postgresql://user:password@host:port/database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///nexus.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-flask-secret-key')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    TESTING = os.getenv('TESTING', 'False').lower() == 'true'
