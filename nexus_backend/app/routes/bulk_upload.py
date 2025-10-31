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

# Helper function to create user from CSV row
def create_user_from_row(row, user_type):
    """Create a single user (Attendee or Attendant) from CSV row"""
    name = row.get('name', '').strip()
    email = row.get('email', '').strip().lower()
    units = row.get('units', '').strip()  # Get units/classes

    # Skip if missing data
    if not name or not email:
        return None

    # Check if email exists
    if user_type == 'Attendee':
        if Attendee.query.filter_by(email=email).first():
            raise Exception('Email already exists')
        user = Attendee(name=name, email=email, units=units if units else None)
    else:  # Attendant
        if Attendant.query.filter_by(email=email).first():
            raise Exception('Email already exists')
        user = Attendant(name=name, email=email, units=units if units else None)

    # Set password and save
    temp_password = secrets.token_urlsafe(8)
    user.set_password(temp_password)
    db.session.add(user)
    db.session.flush()
    user.generate_serial()

    # Send email
    send_welcome_email(user.email, user.name, temp_password)

    return {
        'name': user.name,
        'email': user.email,
        'role': user_type,
        'serial': user.serial,
        'units': units if units else '',
        'password': temp_password
    }

@bulk_bp.route('/upload-attendees', methods=['POST'])
@admin_required
def bulk_upload_attendees(current_user_id):
    """Upload CSV file to create multiple attendees"""
    try:
        # Check file exists
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400

        # Read CSV
        content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(content))

        created = []
        failed = []

        # Process each row
        for row in csv_reader:
            try:
                result = create_user_from_row(row, 'Attendee')
                if result:
                    created.append(result)
            except Exception as e:
                failed.append({'email': row.get('email', ''), 'reason': str(e)})

        db.session.commit()
        return jsonify({
            'message': 'Upload completed',
            'created_count': len(created),
            'failed_count': len(failed),
            'created_users': created,
            'failed_users': failed
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bulk_bp.route('/upload-attendants', methods=['POST'])
@admin_required
def bulk_upload_attendants(current_user_id):
    """Upload CSV file to create multiple attendants"""
    try:
        # Check file exists
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400

        # Read CSV
        content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(content))

        created = []
        failed = []

        # Process each row
        for row in csv_reader:
            try:
                result = create_user_from_row(row, 'Attendant')
                if result:
                    created.append(result)
            except Exception as e:
                failed.append({'email': row.get('email', ''), 'reason': str(e)})

        db.session.commit()
        return jsonify({
            'message': 'Upload completed',
            'created_count': len(created),
            'failed_count': len(failed),
            'created_users': created,
            'failed_users': failed
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bulk_bp.route('/upload-mixed', methods=['POST'])
@admin_required
def bulk_upload_mixed(current_user_id):
    """Upload CSV file with both attendees and attendants (role column required)"""
    try:
        # Check file exists
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files allowed'}), 400

        # Read CSV
        content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(content))

        attendees = []
        attendants = []
        failed = []

        # Process each row
        for row in csv_reader:
            try:
                role = row.get('role', 'Attendee').strip()

                # Determine user type
                if role.lower() == 'attendant':
                    user_type = 'Attendant'
                else:
                    user_type = 'Attendee'

                # Create user
                result = create_user_from_row(row, user_type)
                if result:
                    if user_type == 'Attendant':
                        attendants.append(result)
                    else:
                        attendees.append(result)

            except Exception as e:
                failed.append({'email': row.get('email', ''), 'reason': str(e)})

        db.session.commit()
        return jsonify({
            'message': 'Upload completed',
            'attendees_created': len(attendees),
            'attendants_created': len(attendants),
            'failed_count': len(failed),
            'created_attendees': attendees,
            'created_attendants': attendants,
            'failed_users': failed
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bulk_bp.route('/login-activity', methods=['GET'])
@admin_required
def get_login_activity(current_user_id):
    """Get login activity for all users"""
    try:
        # Get all users
        all_users = Attendee.query.all() + Attendant.query.all()

        # Build activity list
        activity = []
        for user in all_users:
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

        return jsonify({'total_users': len(activity), 'login_activity': activity}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500