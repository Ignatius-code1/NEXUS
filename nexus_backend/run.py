#!/usr/bin/env python3
"""
Simple script to run the Flask application
"""
from app import create_app, db

app = create_app()

@app.cli.command()
def init_db():
    """Initialize the database."""
    db.create_all()
    print('Database initialized!')

@app.cli.command()
def create_admin():
    """Create admin user."""
    from app.models.user_model import User
    
    admin = User(
        name='Admin User',
        email='admin@nexus.com',
        role='Admin'
    )
    admin.set_password('admin123')
    
    db.session.add(admin)
    db.session.commit()
    admin.generate_serial()
    db.session.commit()
    
    print(f'Admin user created: {admin.email}')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=3000)