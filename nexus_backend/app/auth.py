from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
from . import supabase

def register():
    data = request.get_json()
    
    # Simple validation
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400

    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    # Store user in Supabase
    user_data = {
        'email': data['email'],
        'password': hashed_password
    }
    
    response = supabase.table('users').insert(user_data).execute()
    
    if response.error:
        return jsonify({'message': 'Registration failed'}), 400
        
    return jsonify({'message': 'User registered successfully'}), 201

def login():
    auth = request.get_json()
    
    if not auth or not auth.get('email') or not auth.get('password'):
        return jsonify({'message': 'Email and password required'}), 400

    # Get user from Supabase
    response = supabase.table('users').select('*').eq('email', auth['email']).execute()
    
    if not response.data:
        return jsonify({'message': 'Invalid credentials'}), 401

    user = response.data[0]
    
    # Verify password (simplified for beginner example)
    if not check_password_hash(user['password'], auth['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Create JWT token
    token = create_access_token(identity=user['id'])
    
    return jsonify({'token': token})
