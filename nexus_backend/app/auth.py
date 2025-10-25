from flask import Flask, request, jsonify
import jwt
import datetime
from werkzeug.security import check_password_hash
from .models.student_model import db, User

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # In production, use environment variables

@app.route('/login', methods=['POST'])
def login():
    auth = request.get_json()
    
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Username and password required'}), 400

    user = User.query.filter_by(username=auth['username']).first()
    
    if not user or not user.check_password(auth['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token})

if __name__ == '__main__':
    app.run(debug=True)
