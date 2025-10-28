# NEXUS Backend

Simple Flask backend with JWT authentication, SQLAlchemy, and Supabase support.

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Initialize database:**
```bash
python run.py init-db
```

4. **Create admin user:**
```bash
python run.py create-admin
```

5. **Run the application:**
```bash
python run.py
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Login Request:
```json
{
  "email": "admin@nexus.com",
  "password": "admin123"
}
```

### Login Response:
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nexus.com",
    "role": "Admin",
    "serial": "ADM-1"
  },
  "token": "jwt-token-here"
}
```

## Project Structure

```
nexus_backend/
├── app/
│   ├── __init__.py          # Flask app initialization
│   ├── config.py            # Configuration settings
│   ├── models/
│   │   └── user_model.py    # User database model
│   ├── routes/
│   │   └── auth_routes.py   # Authentication endpoints
│   └── utils/
│       └── auth.py          # JWT utilities and decorators
├── app.py                   # Main application entry
├── run.py                   # Run script with CLI commands
└── requirements.txt         # Python dependencies
```