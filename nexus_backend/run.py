
from app import create_app, db

app = create_app()

@app.cli.command()
def init_db():
    """Initialize the database."""
    with app.app_context():
        db.create_all()
        print('Database initialized!')

@app.cli.command()
def create_admin():
    """Create admin user."""
    with app.app_context():
        from app.models.admin_model import Admin
        
        # Check if admin already exists
        if Admin.query.filter_by(email='admin@nexus.com').first():
            print('Admin already exists!')
            return
        
        admin = Admin(
            name='Admin User',
            email='admin@nexus.com'
        )
        admin.set_password('admin123')
        
        db.session.add(admin)
        db.session.commit()
        
        print(f'Admin user created: {admin.email} / admin123')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=3000)