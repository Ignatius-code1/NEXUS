"""
Test the scan sessions endpoint
"""
import requests
import json

BASE_URL = "http://172.30.39.233:3000/api"

# First, login as an attendee to get a token
print("\n" + "="*60)
print("🔐 TESTING SCAN SESSIONS ENDPOINT")
print("="*60 + "\n")

# Try to login as an attendee
attendees = [
    {"email": "john.doe@example.com", "password": "password123"},
    {"email": "jane.smith@example.com", "password": "password123"},
    {"email": "jane@example.com", "password": "password123"},
]

token = None
for attendee in attendees:
    print(f"🔑 Trying to login as {attendee['email']}...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=attendee,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"✅ Login successful! Token: {token[:20]}...")
            print(f"   User: {data.get('user', {}).get('name')}")
            print(f"   Role: {data.get('user', {}).get('role')}")
            break
        else:
            print(f"❌ Login failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

if not token:
    print("\n⚠️  Could not login as any attendee. Please check credentials.")
    print("   Default password should be: password123")
    exit(1)

print("\n" + "-"*60)
print("📡 Testing /attendee/sessions/scan endpoint...")
print("-"*60 + "\n")

try:
    response = requests.get(
        f"{BASE_URL}/attendee/sessions/scan",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}\n")
    
    if response.status_code == 200:
        sessions = response.json()
        print(f"✅ SUCCESS! Found {len(sessions)} sessions\n")
        
        if sessions:
            for i, session in enumerate(sessions, 1):
                print(f"Session {i}:")
                print(f"  ID: {session.get('id')}")
                print(f"  Title: {session.get('title')}")
                print(f"  Course Code: {session.get('courseCode')}")
                print(f"  Attendant: {session.get('attendantName')}")
                print(f"  Schedule: {session.get('schedule')}")
                print(f"  Active: {session.get('isActive')}")
                print(f"  Enrolled: {session.get('isEnrolled')}")
                print("-" * 40)
        else:
            print("⚠️  No sessions returned (empty array)")
    else:
        print(f"❌ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Exception occurred: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)

