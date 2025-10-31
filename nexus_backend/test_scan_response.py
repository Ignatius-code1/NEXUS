"""
Test what the scan endpoint returns
"""
from app import create_app, db
from app.models.session_model import Session
from app.models.attendee_model import Attendee
import json

app = create_app()

with app.app_context():
    print("\n" + "="*60)
    print("🔍 SIMULATING SCAN ENDPOINT RESPONSE")
    print("="*60 + "\n")
    
    # Get all active sessions (same as endpoint)
    sessions = Session.query.filter(Session.is_active == True).all()
    
    print(f"📊 Found {len(sessions)} active sessions\n")
    
    # Get a sample attendee
    attendee = Attendee.query.first()
    if not attendee:
        print("❌ No attendees found in database!")
        exit(1)
    
    print(f"👤 Testing with attendee: {attendee.name}")
    print(f"   Email: {attendee.email}")
    print(f"   Units: {attendee.units if attendee.units else 'None'}\n")
    
    attendee_units = [unit.strip() for unit in attendee.units.split(',')] if attendee.units else []
    
    # Build response (same as endpoint)
    all_sessions = []
    for session in sessions:
        session_dict = session.to_dict()
        session_dict['isEnrolled'] = session.course_code in attendee_units
        all_sessions.append(session_dict)
    
    print("📡 API Response (JSON):")
    print("-" * 60)
    print(json.dumps(all_sessions, indent=2))
    print("-" * 60)
    
    print("\n✅ This is what the frontend should receive!")
    print(f"   Number of sessions: {len(all_sessions)}")
    
    if all_sessions:
        print("\n📋 Session Summary:")
        for i, s in enumerate(all_sessions, 1):
            print(f"   {i}. {s['title']} ({s['courseCode']}) - Enrolled: {s['isEnrolled']}")
    
    print("\n" + "="*60)

