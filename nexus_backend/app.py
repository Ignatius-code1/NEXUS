from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Flask server starting on http://localhost:5001")
    print("📋 Grace's NEXUS endpoints:")
    print("  POST /api/v1/session/start - Start BLE session")
    print("  POST /api/v1/session/stop - Stop BLE session")
    print("  GET /api/v1/session/status/<id> - Session status")
    print("  GET /api/v1/reports/student/<id>/class/<id>/percentage")
    print("  GET /api/v1/reports/class/<id>/absentees")
    print("  GET /api/v1/reports/student/<id>/history")
    print("  GET /api/v1/reports/class/<id>/summary")
    print("  GET /api/v1/reports/overview")
    app.run(debug=True, port=5001)