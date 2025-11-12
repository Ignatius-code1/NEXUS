"""Routes package - API endpoints for NEXUS"""

from app.routes.auth_routes import auth_bp
from app.routes.admin_routes import admin_bp
from app.routes.attendant_routes import attendant_bp
from app.routes.attendee_routes import attendee_bp
from app.routes.bulk_upload import bulk_bp

__all__ = [
    'auth_bp',
    'admin_bp',
    'attendant_bp',
    'attendee_bp',
    'bulk_bp'
]

