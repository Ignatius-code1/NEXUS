<<<<<<< HEAD
from app import create_app, db

# Create Flask application
app = create_app()

# Create database tables
with app.app_context():
=======
from flask import Flask
from .app.models.student_model import db
from .app import create_app

app = create_app()
db.init_app(app)

# Register blueprints
app.register_blueprint(auth_app)

@app.cli.command('init-db')
def init_db():
    """Initialize the database."""
>>>>>>> 871b0a69155a1b0ee752938bebdcdb803872651c
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)