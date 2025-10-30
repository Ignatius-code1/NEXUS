# 🎓 NEXUS Backend - Student Attendance Management System

Flask REST API with JWT authentication, PostgreSQL/Supabase, and role-based access control.

## ✨ Features

- 🔐 JWT Authentication
- 👥 Role-based Access (Admin, Attendant, Attendee)
- 📊 Attendance Tracking
- 🗄️ PostgreSQL/Supabase Database
- 📧 Email Notifications
- 📁 Bulk User Upload (CSV)
- 🔄 Database Migrations

---

## 🚀 Quick Start

### 1. **Install Dependencies:**

```bash
pip install -r requirements.txt
```

### 2. **Set Up Environment:**

Create `.env` file in the root directory (see `.env` in parent folder)

### 3. **Initialize Database:**

```bash
flask db upgrade
```

### 4. **Create Admin User:**

```bash
flask create-admin
```

**Default credentials:** `admin@nexus.com` / `admin123`

### 5. **Run Server:**

```bash
python app.py
```

**Server runs on:** `http://127.0.0.1:5000`

---

## 📖 Full Commands Reference

See **[COMMANDS.md](COMMANDS.md)** for complete list of commands!

## 📡 API Endpoints

### 🔐 Authentication

- `POST /login` - Universal login
- `POST /register` - User registration
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

### 👤 Admin Routes

- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/<role>/<id>` - Update user
- `DELETE /users/<role>/<id>` - Delete user
- `GET /analytics` - System analytics
- `POST /bulk-upload` - Upload CSV

### 👨‍🏫 Attendant Routes

- `POST /sessions` - Create session
- `GET /sessions` - Get sessions
- `POST /sessions/<id>/attendance` - Mark attendance

### 👨‍🎓 Attendee Routes

- `GET /attendance` - My attendance
- `GET /profile` - My profile

---

## 📂 Project Structure

```
nexus_backend/
├── app/
│   ├── __init__.py              # Flask app initialization
│   ├── config.py                # Configuration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── admin_model.py       # Admin model
│   │   ├── attendant_model.py   # Attendant (teacher) model
│   │   ├── attendee_model.py    # Attendee (student) model
│   │   ├── session_model.py     # Session model
│   │   ├── attendance.py        # Attendance model
│   │   └── password_reset.py    # Password reset model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py       # Authentication
│   │   ├── admin_routes.py      # Admin endpoints
│   │   ├── attendant_routes.py  # Attendant endpoints
│   │   ├── attendee_routes.py   # Attendee endpoints
│   │   └── bulk_upload.py       # CSV upload
│   └── utils/
│       ├── __init__.py
│       ├── auth.py              # JWT utilities
│       └── email.py             # Email utilities
├── migrations/                  # Database migrations
├── instance/                    # SQLite database (if used)
├── app.py                       # Main entry point
├── requirements.txt             # Dependencies
├── COMMANDS.md                  # Command reference
└── README.md                    # This file
```

---

## 🗄️ Database

**Tables:**

- `admins` - Admin users
- `attendants` - Teachers/Instructors
- `attendees` - Students
- `sessions` - Attendance sessions
- `attendance` - Attendance records
- `password_resets` - Password reset tokens

**Supported Databases:**

- ✅ PostgreSQL (Production - Supabase)
- ✅ SQLite (Development)

---

## 🔑 User Roles

| Role          | Description          | Permissions                      |
| ------------- | -------------------- | -------------------------------- |
| **Admin**     | System administrator | Full access                      |
| **Attendant** | Teacher/Instructor   | Create sessions, mark attendance |
| **Attendee**  | Student              | View own attendance              |

---

## 📧 Contact

For questions or issues, contact your team lead.

**Happy Coding! 🚀**
