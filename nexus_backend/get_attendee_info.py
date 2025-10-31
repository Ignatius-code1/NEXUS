"""
Get attendee information
"""
from app import create_app, db
from app.models.attendee_model import Attendee

app = create_app()

with app.app_context():
    print("\n" + "="*60)
    print("👤 ATTENDEE INFORMATION")
    print("="*60 + "\n")
    
    attendees = Attendee.query.all()
    
    for attendee in attendees:
        print(f"ID: {attendee.id}")
        print(f"Name: {attendee.name}")
        print(f"Email: {attendee.email}")
        print(f"Serial: {attendee.serial}")
        print(f"Units: {attendee.units if attendee.units else 'None'}")
        print(f"Password Hash: {attendee.password[:30]}..." if attendee.password else "No password")
        print("-" * 60)
    
    print("\n💡 To test the scan endpoint, use one of these emails")
    print("   and try logging in through the mobile app first.\n")

