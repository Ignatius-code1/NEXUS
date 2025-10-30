# from typing import List, Dict, Optional
# from datetime import datetime

# from app.models import db, Attendance, ClassSession, attendee
# #class ReportServiceError(Exception):
# #pass

# class ReportService:
# @staticmethod
# def get_attendee_attendance_percentage(attendee_id: int, class_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> float:
# #Return attendance percentage (0-100) for a attendee in a class over the given date range.
# #If no sessions in range, returns 0.0.

# query = ClassSession.query.filter_by(class_id=class_id)
# if start_date:
# query = query.filter(ClassSession.date >= start_date)
# if end_date:
# query = query.filter(ClassSession.date <= end_date)


# session_ids = [s.id for s in query.with_entities(ClassSession.id).all()]
# if not session_ids:
# return 0.0


# total_sessions = len(session_ids)


# present_count = (
# Attendance.query
# .filter(Attendance.attendee_id == attendee_id, Attendance.class_session_id.in_(session_ids), Attendance.status == 'present')
# .count()
# )


# percentage = (present_count / total_sessions) * 100.0
# return round(percentage, 2)


# @staticmethod
# def list_absent_attendees(class_id: int, session_date: datetime) -> List[Dict]:
# #Return a list of attendees marked absent for the class session on session_date.
# #Each dict: { 'attendee_id': int, 'name': str }

# session = ClassSession.query.filter_by(class_id=class_id, date=session_date.date() if isinstance(session_date, datetime) else session_date).first()
# if session is None:
# return []


# absent_rows = (
# db.session.query(attendee.id, attendee.name)
# .join(Attendance, Attendance.attendee_id == attendee.id)
# .filter(Attendance.class_session_id == session.id, Attendance.status == 'absent')
# .all()
# )


# return [{'attendee_id': r.id, 'name': r.name} for r in absent_rows]

from typing import List, Dict, Optional
from datetime import datetime
from app import db
from app.models.attendance import Attendance
from app.models.session_model import Session
from app.models.attendee_model import Attendee
from sqlalchemy import func


class ReportService:
    @staticmethod
    def get_attendee_attendance_percentage(
        attendee_id: int,
        session_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> float:
        """Return attendance percentage (0–100) for an attendee in a session over a date range."""

        query = Session.query.filter_by(id=session_id)
        if start_date:
            query = query.filter(Session.created_at >= start_date)
        if end_date:
            query = query.filter(Session.created_at <= end_date)

        sessions = query.all()
        if not sessions:
            return 0.0

        total_sessions = len(sessions)

        present_count = (
            Attendance.query
            .filter(
                Attendance.attendee_id == attendee_id,
                Attendance.session_id.in_([s.id for s in sessions]),
                Attendance.status == 'present'
            )
            .count()
        )

        percentage = (present_count / total_sessions) * 100.0
        return round(percentage, 2)

    @staticmethod
    def list_absent_attendees(session_id: int, session_date: datetime) -> List[Dict]:
        """Return a list of attendees marked absent for a specific session/date."""
        session = Session.query.filter_by(id=session_id).first()
        if not session:
            return []

        absent_rows = (
            db.session.query(Attendee.id, Attendee.name)
            .join(Attendance, Attendance.attendee_id == Attendee.id)
            .filter(
                Attendance.session_id == session.id,
                Attendance.status == 'absent'
            )
            .all()
        )

        return [{'attendee_id': r.id, 'name': r.name} for r in absent_rows]
