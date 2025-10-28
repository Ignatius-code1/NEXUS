
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

@app.cli.command()
def create_attendant():
    """Create a test attendant (teacher) user."""
    with app.app_context():
        from app.models.attendant_model import Attendant

        # Check if attendant already exists
        if Attendant.query.filter_by(email='teacher@nexus.com').first():
            print('Attendant already exists!')
            return

        attendant = Attendant(
            name='Teacher User',
            email='teacher@nexus.com'
        )
        attendant.set_password('teacher123')

        db.session.add(attendant)
        db.session.commit()

        # Generate serial number
        attendant.generate_serial()
        db.session.commit()

        print(f' Attendant created: {attendant.email} / teacher123')
        print(f'   Serial: {attendant.serial}')

@app.cli.command()
def create_attendee():
    """Create a test attendee (student) user."""
    with app.app_context():
        from app.models.attendee_model import Attendee

        # Check if attendee already exists
        if Attendee.query.filter_by(email='student@nexus.com').first():
            print('Attendee already exists!')
            return

        attendee = Attendee(
            name='Student User',
            email='student@nexus.com'
        )
        attendee.set_password('student123')

        db.session.add(attendee)
        db.session.commit()

        # Generate serial number
        attendee.generate_serial()
        db.session.commit()

        print(f' Attendee created: {attendee.email} / student123')
        print(f'   Serial: {attendee.serial}')

if __name__ == '__main__':
   
    # Run: flask db upgrade for new tables
    app.run(debug=True, host='0.0.0.0', port=3000)


    