from flask import Blueprint, jsonify, request
from services.report_service import ReportService

report_bp = Blueprint("report_bp", __name__)

# Student Attendance Percentage
@report_bp.route("/reports/student/<int:student_id>/class/<int:class_id>/percentage", methods=["GET"])
def get_student_attendance_percentage(student_id, class_id):
    start_dt = request.args.get("start")
    end_dt = request.args.get("end")

    pct = ReportService.get_student_attendance_percentage(student_id, class_id, start_dt, end_dt)
    return jsonify({
        "student_id": student_id,
        "class_id": class_id,
        "attendance_percentage": pct
    })


# Class Absentees
@report_bp.route("/reports/class/<int:class_id>/absentees", methods=["GET"])
def get_class_absentees(class_id):
    date_str = request.args.get("date")
    absentees = ReportService.get_class_absentees(class_id, date_str)
    return jsonify({
        "class_id": class_id,
        "date": date_str,
        "absentees": absentees
    })


# Student Attendance History
@report_bp.route("/reports/student/<int:student_id>/history", methods=["GET"])
def get_student_history(student_id):
    """Return all attendance records for a specific student."""
    history = ReportService.get_student_attendance_history(student_id)
    return jsonify({
        "student_id": student_id,
        "attendance_history": history
    })


#  Class Attendance Summary
@report_bp.route("/reports/class/<int:class_id>/summary", methods=["GET"])
def get_class_summary(class_id):
    """Return class-level attendance summary (averages, totals, etc)."""
    summary = ReportService.get_class_summary(class_id)
    return jsonify({
        "class_id": class_id,
        "summary": summary
    })


# Overall Attendance Overview
@report_bp.route("/reports/overview", methods=["GET"])
def get_overview():
    """Return overall attendance stats for all classes."""
    start_dt = request.args.get("start")
    end_dt = request.args.get("end")
    overview = ReportService.get_overall_summary(start_dt, end_dt)
    return jsonify({
        "overview": overview
    })
