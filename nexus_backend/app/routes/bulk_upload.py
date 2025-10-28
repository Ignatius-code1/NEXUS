from flask import Blueprint, request, jsonify
from app import db
from app.models.attendant_model import Attendant
from app.models.attendee_model import Attendee
from app.utils.auth import admin_required
from app.utils.email import send_welcome_email
import csv
import io
import secrets

bulk_bp = Blueprint('bulk', __name__)

@bulk_bp.route('/upload-attendees', methods=['POST'])
@admin_required
def bulk_upload_attendees(current_user_id):
    """Upload CSV file to create multiple attendees"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400
        
        # Read CSV file
        file_content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(file_content))
        
        created_users = []
        failed_users = []
        
        for row in csv_reader:
            try:
                name = row.get('name', '').strip()
                email = row.get('email', '').strip().lower()
                
                if not name or not email:
                    continue
                
                # Check if email already exists
                if Attendee.query.filter_by(email=email).first():
                    failed_users.append({'email': email, 'reason': 'Email already exists'})
                    continue
                
                # Generate random password
                temp_password = secrets.token_urlsafe(8)
                
                # Create attendee
                attendee = Attendee(name=name, email=email)
                attendee.set_password(temp_password)
                
                db.session.add(attendee)
                db.session.flush()  # Get ID
                
                # Generate serial
                attendee.generate_serial()
                
                # Send welcome email
                email_sent = send_welcome_email(attendee.email, attendee.name, temp_password)
                
                created_users.append({
                    'name': attendee.name,
                    'email': attendee.email,
                    'role': 'Attendee',
                    'serial': attendee.serial,
                    'password': temp_password,
                    'email_sent': email_sent
                })
                
            except Exception as e:
                failed_users.append({'email': email, 'reason': str(e)})
        
        db.session.commit()
        
        return jsonify({
            'message': f'Attendees upload completed',
            'created_count': len(created_users),
            'failed_count': len(failed_users),
            'created_users': created_users,
            'failed_users': failed_users
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@bulk_bp.route('/upload-attendants', methods=['POST'])
@admin_required
def bulk_upload_attendants(current_user_id):
    """Upload CSV file to create multiple attendants"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400
        
        # Read CSV file
        file_content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(file_content))
        
        created_users = []
        failed_users = []
        
        for row in csv_reader:
            try:
                name = row.get('name', '').strip()
                email = row.get('email', '').strip().lower()
                
                if not name or not email:
                    continue
                
                # Check if email already exists
                if Attendant.query.filter_by(email=email).first():
                    failed_users.append({'email': email, 'reason': 'Email already exists'})
                    continue
                
                # Generate random password
                temp_password = secrets.token_urlsafe(8)
                
                # Create attendant
                attendant = Attendant(name=name, email=email)
                attendant.set_password(temp_password)
                
                db.session.add(attendant)
                db.session.flush()  # Get ID
                
                # Generate serial
                attendant.generate_serial()
                
                # Send welcome email
                email_sent = send_welcome_email(attendant.email, attendant.name, temp_password)
                
                created_users.append({
                    'name': attendant.name,
                    'email': attendant.email,
                    'role': 'Attendant',
                    'serial': attendant.serial,
                    'password': temp_password,
                    'email_sent': email_sent
                })
                
            except Exception as e:
                failed_users.append({'email': email, 'reason': str(e)})
        
        db.session.commit()
        
        return jsonify({
            'message': f'Attendants upload completed',
            'created_count': len(created_users),
            'failed_count': len(failed_users),
            'created_users': created_users,
            'failed_users': failed_users
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@bulk_bp.route('/upload-mixed', methods=['POST'])
@admin_required
def bulk_upload_mixed(current_user_id):
    """Upload CSV file with both attendees and attendants (role column required)"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400
        
        # Read CSV file
        file_content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(file_content))
        
        created_attendees = []
        created_attendants = []
        failed_users = []
        
        for row in csv_reader:
            try:
                name = row.get('name', '').strip()
                email = row.get('email', '').strip().lower()
                role = row.get('role', 'Attendee').strip()
                
                if not name or not email:
                    continue
                
                # Generate random password
                temp_password = secrets.token_urlsafe(8)
                
                if role.lower() == 'attendant':
                    # Check if email exists
                    if Attendant.query.filter_by(email=email).first():
                        failed_users.append({'email': email, 'reason': 'Email already exists'})
                        continue
                    
                    # Create attendant
                    user = Attendant(name=name, email=email)
                    user.set_password(temp_password)
                    db.session.add(user)
                    db.session.flush()
                    user.generate_serial()
                    
                    created_attendants.append({
                        'name': user.name,
                        'email': user.email,
                        'role': 'Attendant',
                        'serial': user.serial,
                        'password': temp_password
                    })
                else:
                    # Default to attendee
                    if Attendee.query.filter_by(email=email).first():
                        failed_users.append({'email': email, 'reason': 'Email already exists'})
                        continue
                    
                    # Create attendee
                    user = Attendee(name=name, email=email)
                    user.set_password(temp_password)
                    db.session.add(user)
                    db.session.flush()
                    user.generate_serial()
                    
                    created_attendees.append({
                        'name': user.name,
                        'email': user.email,
                        'role': 'Attendee',
                        'serial': user.serial,
                        'password': temp_password
                    })
                
                # Send welcome email
                send_welcome_email(user.email, user.name, temp_password)
                
            except Exception as e:
                failed_users.append({'email': email, 'reason': str(e)})
        
        db.session.commit()
        
        return jsonify({
            'message': 'Mixed upload completed',
            'attendees_created': len(created_attendees),
            'attendants_created': len(created_attendants),
            'failed_count': len(failed_users),
            'created_attendees': created_attendees,
            'created_attendants': created_attendants,
            'failed_users': failed_users
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@bulk_bp.route('/login-activity', methods=['GET'])
@admin_required
def get_login_activity(current_user_id):
    """Get login activity for all users"""
    try:
        # Get all users with their last login times
        attendees = Attendee.query.all()
        attendants = Attendant.query.all()
        
        activity = []
        
        for user in attendees + attendants:
            activity.append({
                'name': user.name,
                'email': user.email,
                'role': user.__class__.__name__,
                'serial': user.serial,
                'last_login': user.last_login.isoformat() if user.last_login else 'Never',
                'created_at': user.created_at.isoformat() if user.created_at else None
            })
        
        # Sort by last login (most recent first)
        activity.sort(key=lambda x: x['last_login'] if x['last_login'] != 'Never' else '1900-01-01', reverse=True)
        
        return jsonify({
            'total_users': len(activity),
            'login_activity': activity
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get activity: {str(e)}'}), 500