from flask import request, jsonify
from app.supabase import supabase
from werkzeug.security import generate_password_hash, check_password_hash


def register():
    data = request.get_json()

    # Simple validation
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400

    # Hash password before storing (recommended even for beginners)
    hashed = generate_password_hash(data['password'])

    user_data = {
        'email': data['email'],
        'password': hashed,
        'name': data.get('name'),
        'role': data.get('role', 'attendee')
    }

    response = supabase.table('users').insert(user_data).execute()

    if getattr(response, 'error', None):
        return jsonify({'message': 'Registration failed'}), 400

    return jsonify({'message': 'User registered successfully'}), 201


def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400

    response = supabase.table('users').select('*').eq('email', data['email']).execute()

    if not getattr(response, 'data', None) or len(response.data) == 0:
        return jsonify({'message': 'Invalid credentials'}), 401

    user = response.data[0]

    # Verify password
    if not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Return simple user info (you can add JWT here later)
    return jsonify({'message': 'Login successful', 'user_id': user['id'], 'role': user.get('role')}), 200
