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
    db.create_all()
    print('Initialized the database.')

if __name__ == '__main__':
    app.run(debug=True)
