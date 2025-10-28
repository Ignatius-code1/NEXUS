#!/usr/bin/env python3
"""
Simple setup script for NEXUS Backend
"""
import os
import subprocess
import sys

def run_command(command):
    """Run shell command"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {command}")
        print(f"Error: {e.stderr}")
        return False

def setup_backend():
    """Setup NEXUS Backend"""
    print("🚀 Setting up NEXUS Backend...")
    
    # Install requirements
    print("\n📦 Installing dependencies...")
    if not run_command("pip install -r requirements.txt"):
        print("❌ Failed to install dependencies")
        return False
    
    # Create .env if not exists
    if not os.path.exists('.env'):
        print("\n📝 Creating .env file...")
        run_command("cp .env.example .env")
        print("⚠️  Please edit .env file with your actual values")
    
    # Initialize database
    print("\n🗄️  Initializing database...")
    if not run_command("python run.py init-db"):
        print("❌ Failed to initialize database")
        return False
    
    # Create admin user
    print("\n👤 Creating admin user...")
    if not run_command("python run.py create-admin"):
        print("❌ Failed to create admin user")
        return False
    
    print("\n🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your Supabase and email settings")
    print("2. Run: python run.py")
    print("3. Test login: admin@nexus.com / admin123")
    
    return True

if __name__ == "__main__":
    setup_backend()