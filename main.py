from flask import Flask, request
from app import create_app
from supabase import create_client
from flask_jwt_extended import jwt_required
from app.auth import register, login

app = create_app('app/config.py')
supabase = create_client(app.config['SUPABASE_URL'], app.config['SUPABASE_KEY'])

@app.route('/')
def index():
    return "Hello!"

@app.route('/register', methods=['POST'])
def handle_register():
    return register()

@app.route('/login', methods=['POST'])
def handle_login():
    return login()

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'This is a protected route'})

if __name__ == '__main__':
    app.run(debug=True)


