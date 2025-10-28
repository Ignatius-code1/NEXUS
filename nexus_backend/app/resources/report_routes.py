from flask import Blueprint, jsonify, request
from datetime import datetime
from app.services.report_service import ReportService

report_bp = Blueprint('reports', __name__, url_prefix='/reports')

@report_bp.route('/attendee/<int:attendee_id>/class/<int:class_id>/percentage')  
def attendee_percentage(attendee_id, class_id):
start = request.args.get('start')
end = request.args.get('end')
start_dt = datetime.fromisoformat(start) if start else None
end_dt = datetime.fromisoformat(end) if end else None


try:
pct = ReportService.get_attendee_attendance_percentage(attendee_id, class_id, start_dt, end_dt)
except Exception as e:
return jsonify({'error': str(e)}), 500
return jsonify({'attendee_id': attendee_id, 'class_id': class_id, 'attendance_percentage': pct})

@report_bp.route('/class/<int:class_id>/absentees')
def class_absentees(class_id):
date_str = request.args.get('date')
if not date_str:
return jsonify({'error': 'date parameter required, format YYYY-MM-DD'}), 400
try:
session_date = datetime.fromisoformat(date_str)
except Exception:
return jsonify({'error': 'invalid date format, use YYYY-MM-DD'}), 400

try:
rows = ReportService.list_absent_attendees(class_id, session_date)
except Exception as e:
return jsonify({'error': str(e)}), 500
return jsonify({'class_id': class_id, 'date': date_str, 'absentees': rows})