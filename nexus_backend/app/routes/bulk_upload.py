from flask import Blueprint, request, jsonify
from app import db
from app.models.user_model import User
from app.utils.auth import admin_required
from app.utils.email import send_welcome_email
import csv
import io
import secrets

bulk_bp = Blueprint('bulk', __name__)

@bulk_bp.route('/upload-users', methods=['POST'])
@admin_required
def bulk_upload_users(current_user_id):
    """Upload CSV file to create multiple users automatically"""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Only accept CSV files
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400
        
        # Read CSV file
        file_content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(file_content))
        
        # Process each row
        created_users = []
        failed_users = []
        
        for row in csv_reader:
            try:
                name = row.get('name', '').strip()
                email = row.get('email', '').strip().lower()
                role = row.get('role', 'Attendee').strip()
                
                # Skip empty rows
                if not name or not email:
                    continue
                
                # Check if user already exists
                if User.query.filter_by(email=email).first():
                    failed_users.append({'email': email, 'reason': 'Email already exists'})
                    continue
                
                # Generate random password
                temp_password = secrets.token_urlsafe(8)
                
                # Create user
                user = User(
                    name=name,
                    email=email,
                    role=role if role in ['Admin', 'Attendant', 'Attendee'] else 'Attendee'
                )
                user.set_password(temp_password)
                
                db.session.add(user)
                db.session.flush()  # Get user ID
                
                # Generate serial
                user.generate_serial()
                
                # Send welcome email
                email_sent = send_welcome_email(user.email, user.name, temp_password)
                
                created_users.append({
                    'name': user.name,
                    'email': user.email,
                    'role': user.role,
                    'serial': user.serial,
                    'password': temp_password,
                    'email_sent': email_sent
                })
                
            except Exception as e:
                failed_users.append({'email': email, 'reason': str(e)})
        
        # Commit all changes
        db.session.commit()
        
        return jsonify({
            'message': f'Bulk upload completed',
            'created_count': len(created_users),
            'failed_count': len(failed_users),
            'created_users': created_users,
            'failed_users': failed_users
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Bulk upload failed: {str(e)}'}), 500

@bulk_bp.route('/download-template', methods=['GET'])
@admin_required
def download_template(current_user_id):
    """Get CSV template for bulk upload"""
    try:
        # Simple CSV template
        template = """name,email,role
John Doe,john@school.edu,Attendee
Jane Smith,jane@school.edu,Attendant
Bob Johnson,bob@school.edu,Attendee"""
        
        return jsonify({
            'template': template,
            'instructions': [
                'Required columns: name, email',
                'Optional column: role (Admin/Attendant/Attendee, defaults to Attendee)',
                'Save as CSV file',
                'Upload via POST /api/bulk/upload-users'
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Template generation failed: {str(e)}'}), 500