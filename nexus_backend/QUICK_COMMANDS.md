# ⚡ NEXUS - Quick Command Reference

## 🚀 First Time Setup (PostgreSQL + Flask-Migrate)

```bash
# 1. Update .env with your Supabase connection string
# DATABASE_URL=postgresql://postgres.xxx:YOUR-PASSWORD@host:6543/postgres

# 2. Install dependencies
cd nexus_backend
pip install -r requirements.txt

# 3. Initialize migrations (ONLY ONCE)
flask --app run db init

# 4. Create initial migration
flask --app run db migrate -m "Initial migration"

# 5. Apply migration to database
flask --app run db upgrade

# 6. Create test users
python run.py create-admin
python run.py create-attendant
python run.py create-attendee

# 7. Run the server
python run.py
```

---

## 🔄 Daily Development Workflow

```bash
# Start the server
cd nexus_backend
python run.py

# Server runs on: http://localhost:3000
```

---

## 📝 When You Change Models

```bash
# 1. Edit your model file (e.g., app/models/attendee_model.py)

# 2. Create migration
flask --app run db migrate -m "Description of change"

# 3. Apply migration
flask --app run db upgrade

# 4. Restart server
python run.py
```

---

## 👥 Create Users

```bash
# Create admin
python run.py create-admin
# Creates: admin@nexus.com / admin123

# Create teacher
python run.py create-attendant
# Creates: teacher@nexus.com / teacher123

# Create student
python run.py create-attendee
# Creates: student@nexus.com / student123
```

---

## 🗄️ Database Commands

```bash
# Create migration after model changes
flask --app run db migrate -m "Your message"

# Apply migrations
flask --app run db upgrade

# Undo last migration
flask --app run db downgrade

# Show migration history
flask --app run db history

# Show current version
flask --app run db current
```

---

## 🧪 Testing Endpoints (Postman)

### Login
```
POST http://localhost:3000/api/auth/login
Body: {"email": "admin@nexus.com", "password": "admin123"}
```

### Create Attendant (Admin only)
```
POST http://localhost:3000/api/admin/create-attendant
Headers: Authorization: Bearer YOUR_TOKEN
Body: {"name": "John Doe", "email": "john@school.com", "password": "pass123"}
```

### Mark Attendance
```
POST http://localhost:3000/api/attendance/mark-ble
Headers: Authorization: Bearer YOUR_TOKEN
Body: {"device_id": "BLE-001", "attendee_id": 1, "session_id": 1}
```

---

## 🆘 Troubleshooting

```bash
# Can't connect to database
# → Check DATABASE_URL in .env
# → Verify password is correct

# Module not found
pip install -r requirements.txt

# Port already in use
lsof -ti:3000 | xargs kill -9

# Reset migrations (CAREFUL - loses data!)
rm -rf migrations/
flask --app run db init
flask --app run db migrate -m "Initial migration"
flask --app run db upgrade
```

---

## 📍 Important Files

```
.env                          # Database connection & secrets
nexus_backend/run.py          # Main entry point
nexus_backend/app/__init__.py # App factory
nexus_backend/app/models/     # Database models
nexus_backend/migrations/     # Migration files
```

---

## ✅ Quick Checklist

- [ ] `.env` has correct `DATABASE_URL`
- [ ] Dependencies installed
- [ ] Migrations initialized
- [ ] Tables created in Supabase
- [ ] Admin user created
- [ ] Server running on port 3000
- [ ] Can login and get JWT token

---

**For detailed setup, see: `PRODUCTION_SETUP.md`**

