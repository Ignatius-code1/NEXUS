"""
Quick test script to check if sessions exist in the database
"""
from app import create_app, db
from app.models.session_model import Session
from app.models.attendant_model import Attendant
from app.models.attendee_model import Attendee

app = create_app()

with app.app_context():
    print("\n" + "="*60)
    print("🔍 CHECKING DATABASE FOR SESSIONS")
    print("="*60 + "\n")
    
    # Check all sessions
    all_sessions = Session.query.all()
    print(f"📊 Total sessions in database: {len(all_sessions)}\n")
    
    if all_sessions:
        for session in all_sessions:
            print(f"  ID: {session.id}")
            print(f"  Title: {session.title}")
            print(f"  Course Code: {session.course_code}")
            print(f"  Attendant: {session.attendant_name}")
            print(f"  Schedule: {session.schedule}")
            print(f"  Active: {session.is_active}")
            print(f"  Created: {session.created_at}")
            print("-" * 60)
    else:
        print("  ⚠️  No sessions found in database!")
        print("  💡 Create a session as an attendant first.\n")
    
    # Check active sessions
    active_sessions = Session.query.filter(Session.is_active == True).all()
    print(f"\n✅ Active sessions: {len(active_sessions)}")
    
    # Check attendants
    attendants = Attendant.query.all()
    print(f"👨‍🏫 Total attendants: {len(attendants)}")
    
    # Check attendees
    attendees = Attendee.query.all()
    print(f"👤 Total attendees: {len(attendees)}")
    
    if attendees:
        print("\n📚 Attendee enrollments:")
        for attendee in attendees:
            units = attendee.units if attendee.units else "None"
            print(f"  {attendee.name}: {units}")
    
    print("\n" + "="*60)

