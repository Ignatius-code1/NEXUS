from app import create_app
import psycopg2
from .env import load_.env
import os

except Exception as e:
    print(f"Failed to connect: {e}")

if __name__ == '__main__':
    app = create_app()
    print("Flask server starting on http://localhost:5001")
    print("Available Grace endpoints:")
    print("  POST /api/v1/session/start - Start BLE session")
    print("  POST /api/v1/session/stop - Stop BLE session")
    print("  GET /api/v1/session/status/<id> - Session status")
    print("  POST /api/v1/attendance/mark - Mark attendance")
    print("  GET /api/v1/reports/student/<id>/class/<id>/percentage")
    print("  GET /api/v1/reports/class/<id>/absentees")
    print("  GET /api/v1/reports/student/<id>/history")
    print("  GET /api/v1/reports/class/<id>/summary")
    print("  GET /api/v1/reports/overview")
    app.run(debug=True, port=5432)