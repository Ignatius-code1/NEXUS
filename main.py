from flask import Flask, request, jsonify
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Setup Supabase
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

@app.route('/')
def index():
    return "Welcome to NEXUS!"

@app.route('/register', methods=['POST'])
def handle_register():
    from app.auth import register
    return register()

@app.route('/login', methods=['POST'])
def handle_login():
    from app.auth import login
    return login()

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'This is a protected route'})

from app.services.attendance_service import save_attendance_record

@app.route('/attendance/mark-ble', methods=['POST'])
@jwt_required()
def mark_attendance():
    data = request.get_json()
    
    # easy validation
    if not data or not data.get('device_id') or not data.get('attendee_id'):
        return jsonify({'message': 'Device ID and Attendee ID required'}), 400
    
    # Save attendance record
    if not save_attendance_record(data['device_id'], data['attendee_id']):
        return jsonify({'message': 'Failed to save attendance record'}), 500
    
    return jsonify({
        'message': 'Attendance marked successfully',
        'device_id': data['device_id'],
        'attendee_id': data['attendee_id']
    })

if __name__ == '__main__':
    app.run(debug=True)


