<<<<<<< HEAD
from typing import List, Dict, Optional
from datetime import datetime

from ..models import db, Attendance, ClassSession, attendee

class ReportService:
    @staticmethod
    def get_attendee_attendance_percentage(attendee_id: int, class_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> float:
        """Return attendance percentage (0-100) for a attendee in a class over the given date range.
        If no sessions in range, returns 0.0."""
        
        query = ClassSession.query.filter_by(class_id=class_id)
        if start_date:
            query = query.filter(ClassSession.date >= start_date)
        if end_date:
            query = query.filter(ClassSession.date <= end_date)
        
        session_ids = [s.id for s in query.with_entities(ClassSession.id).all()]
        if not session_ids:
            return 0.0
        
        total_sessions = len(session_ids)
        
        present_count = (
            Attendance.query
            .filter(Attendance.attendee_id == attendee_id, Attendance.class_session_id.in_(session_ids), Attendance.status == 'present')
            .count()
        )
        
        percentage = (present_count / total_sessions) * 100.0
        return round(percentage, 2)


    @staticmethod
    def list_absent_attendees(class_id: int, session_date: datetime) -> List[Dict]:
        """Return a list of attendees marked absent for the class session on session_date.
        Each dict: { 'attendee_id': int, 'name': str }"""
        
        session = ClassSession.query.filter_by(class_id=class_id, date=session_date.date() if isinstance(session_date, datetime) else session_date).first()
        if session is None:
            return []
        
        absent_rows = (
            db.session.query(attendee.id, attendee.name)
            .join(Attendance, Attendance.attendee_id == attendee.id)
            .filter(Attendance.class_session_id == session.id, Attendance.status == 'absent')
            .all()
        )
        
        return [{'attendee_id': r.id, 'name': r.name} for r in absent_rows]

    @staticmethod
    def get_student_attendance_percentage(student_id: int, class_id: int, start_dt: str = None, end_dt: str = None) -> float:
        """Wrapper method to match route expectations"""
        start_date = datetime.fromisoformat(start_dt) if start_dt else None
        end_date = datetime.fromisoformat(end_dt) if end_dt else None
        return ReportService.get_attendee_attendance_percentage(student_id, class_id, start_date, end_date)

    @staticmethod
    def get_class_absentees(class_id: int, date_str: str) -> List[Dict]:
        """Wrapper method to match route expectations"""
        session_date = datetime.fromisoformat(date_str) if date_str else datetime.now()
        return ReportService.list_absent_attendees(class_id, session_date)

    @staticmethod
    def get_student_attendance_history(student_id: int) -> List[Dict]:
        """Return all attendance records for a student"""
        records = (
            db.session.query(Attendance, ClassSession)
            .join(ClassSession, Attendance.class_session_id == ClassSession.id)
            .filter(Attendance.attendee_id == student_id)
            .all()
        )
        return [{
            'date': record.ClassSession.date.isoformat(),
            'class_id': record.ClassSession.class_id,
            'status': record.Attendance.status
        } for record in records]

    @staticmethod
    def get_class_summary(class_id: int) -> Dict:
        """Return class attendance summary"""
        sessions = ClassSession.query.filter_by(class_id=class_id).all()
        if not sessions:
            return {'total_sessions': 0, 'average_attendance': 0}
        
        total_sessions = len(sessions)
        session_ids = [s.id for s in sessions]
        
        total_present = Attendance.query.filter(
            Attendance.class_session_id.in_(session_ids),
            Attendance.status == 'present'
        ).count()
        
        total_possible = Attendance.query.filter(
            Attendance.class_session_id.in_(session_ids)
        ).count()
        
        avg_attendance = (total_present / total_possible * 100) if total_possible > 0 else 0
        
        return {
            'total_sessions': total_sessions,
            'average_attendance': round(avg_attendance, 2),
            'total_present': total_present,
            'total_possible': total_possible
        }

    @staticmethod
    def get_overall_summary(start_dt: str = None, end_dt: str = None) -> Dict:
        """Return overall attendance statistics"""
        query = ClassSession.query
        if start_dt:
            query = query.filter(ClassSession.date >= datetime.fromisoformat(start_dt).date())
        if end_dt:
            query = query.filter(ClassSession.date <= datetime.fromisoformat(end_dt).date())
        
        sessions = query.all()
        if not sessions:
            return {'total_classes': 0, 'total_sessions': 0, 'overall_attendance': 0}
        
        session_ids = [s.id for s in sessions]
        unique_classes = len(set(s.class_id for s in sessions))
        
        total_present = Attendance.query.filter(
            Attendance.class_session_id.in_(session_ids),
            Attendance.status == 'present'
        ).count()
        
        total_possible = Attendance.query.filter(
            Attendance.class_session_id.in_(session_ids)
        ).count()
        
        overall_attendance = (total_present / total_possible * 100) if total_possible > 0 else 0
        
        return {
            'total_classes': unique_classes,
            'total_sessions': len(sessions),
            'overall_attendance': round(overall_attendance, 2),
            'total_present': total_present,
            'total_possible': total_possible
        }
=======
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
>>>>>>> 00f41723bc8c435ea5303763c898af3a7fb50300
