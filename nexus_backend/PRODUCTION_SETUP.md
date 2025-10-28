# 🚀 NEXUS Backend - Production Setup Guide (Capstone Project)

## 📋 Overview

This guide will help you set up your NEXUS backend for **production use** with:
- ✅ **PostgreSQL (Supabase)** - Professional cloud database
- ✅ **Flask-Migrate** - Proper database migrations
- ✅ **Real data handling** - Ready for your capstone project

---

## 🎯 Step-by-Step Setup

### Step 1: Get Your Supabase PostgreSQL Connection String

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/cydvkcsxohvtnimatdnm
   ```

2. **Navigate to Database Settings:**
   - Click **Settings** (gear icon) on left sidebar
   - Click **Database**

3. **Get Connection String:**
   - Scroll to **"Connection String"** section
   - Click **"URI"** tab
   - Copy the connection string (looks like):
     ```
     postgresql://postgres.cydvkcsxohvtnimatdnm:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

4. **Get Your Database Password:**
   - If you know it: Use it to replace `[YOUR-PASSWORD]`
   - If you forgot it:
     - Go to Settings → Database
     - Scroll to "Database Password"
     - Click "Reset Database Password"
     - Copy the new password

5. **Final Connection String Example:**
   ```
   postgresql://postgres.cydvkcsxohvtnimatdnm:YourActualPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

---

### Step 2: Update Your `.env` File

Open `.env` file in the **root directory** and update the `DATABASE_URL`:

```bash
# Replace [YOUR-PASSWORD] with your actual Supabase database password
DATABASE_URL=postgresql://postgres.cydvkcsxohvtnimatdnm:YourActualPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANT:** Make sure there are NO spaces and the password is correct!

---

### Step 3: Install Dependencies

```bash
cd nexus_backend
pip install -r requirements.txt
```

**This installs:**
- ✅ Flask-Migrate (for migrations)
- ✅ psycopg2-binary (PostgreSQL driver)
- ✅ All other required packages

---

### Step 4: Initialize Flask-Migrate (First Time Only)

```bash
cd nexus_backend

# Initialize migrations folder
flask --app run db init
```

**This creates:**
```
nexus_backend/
└── migrations/
    ├── alembic.ini
    ├── env.py
    ├── script.py.mako
    └── versions/
        └── (migration files will go here)
```

**⚠️ Only run this ONCE!** If `migrations/` folder already exists, skip this step.

---

### Step 5: Create Initial Migration

This creates a migration file based on your models:

```bash
flask --app run db migrate -m "Initial migration with all tables"
```

**What this does:**
- Reads your models (Admin, Attendant, Attendee, Session, Attendance)
- Creates a migration file in `migrations/versions/`
- The file contains SQL to create all tables

**You should see:**
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.autogenerate.compare] Detected added table 'admins'
INFO  [alembic.autogenerate.compare] Detected added table 'attendants'
INFO  [alembic.autogenerate.compare] Detected added table 'attendees'
INFO  [alembic.autogenerate.compare] Detected added table 'sessions'
INFO  [alembic.autogenerate.compare] Detected added table 'attendance'
INFO  [alembic.autogenerate.compare] Detected added table 'password_resets'
  Generating /path/to/migrations/versions/xxxxx_initial_migration.py ...  done
```

---

### Step 6: Apply Migration to Database

This actually creates the tables in your Supabase PostgreSQL database:

```bash
flask --app run db upgrade
```

**What this does:**
- Connects to your Supabase PostgreSQL database
- Runs the migration file
- Creates all tables (admins, attendants, attendees, sessions, attendance, password_resets)

**You should see:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> xxxxx, Initial migration with all tables
```

---

### Step 7: Verify Tables Were Created

**Option A: Check in Supabase Dashboard**
1. Go to Supabase Dashboard
2. Click **Table Editor** (left sidebar)
3. You should see all your tables:
   - admins
   - attendants
   - attendees
   - sessions
   - attendance
   - password_resets

**Option B: Use Python**
```bash
python
>>> from app import create_app, db
>>> app = create_app()
>>> with app.app_context():
...     print(db.engine.table_names())
```

---

### Step 8: Create Initial Users

```bash
# Create admin user
python run.py create-admin
# Output: Admin user created: admin@nexus.com / admin123

# Create test teacher
python run.py create-attendant
# Output: Attendant created: teacher@nexus.com / teacher123

# Create test student
python run.py create-attendee
# Output: Attendee created: student@nexus.com / student123
```

---

### Step 9: Run the Server

```bash
python run.py
```

**You should see:**
```
 * Running on http://0.0.0.0:3000
 * Debug mode: on
```

---

### Step 10: Test with Postman

**1. Login as Admin:**
```
POST http://localhost:3000/api/auth/login
Body: {
  "email": "admin@nexus.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nexus.com",
    "role": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**2. Verify Data in Supabase:**
- Go to Supabase Dashboard → Table Editor
- Click on `admins` table
- You should see your admin user!

---

## 🔄 Flask-Migrate Workflow (For Future Changes)

### When You Modify Your Models:

**Example:** Adding a new column to `Attendee` model

1. **Edit the model:**
   ```python
   # app/models/attendee_model.py
   class Attendee(db.Model):
       # ... existing fields ...
       phone_number = db.Column(db.String(20), nullable=True)  # NEW FIELD
   ```

2. **Create migration:**
   ```bash
   flask --app run db migrate -m "Add phone number to attendees"
   ```

3. **Review the migration file:**
   - Check `migrations/versions/xxxxx_add_phone_number.py`
   - Make sure it looks correct

4. **Apply migration:**
   ```bash
   flask --app run db upgrade
   ```

5. **Done!** The column is added to your database without losing data!

---

## 📊 Common Flask-Migrate Commands

```bash
# Initialize migrations (first time only)
flask --app run db init

# Create a new migration after model changes
flask --app run db migrate -m "Description of changes"

# Apply migrations to database
flask --app run db upgrade

# Undo last migration
flask --app run db downgrade

# Show migration history
flask --app run db history

# Show current migration version
flask --app run db current
```

---

## 🆘 Troubleshooting

### Problem: "No module named 'psycopg2'"
```bash
pip install psycopg2-binary
```

### Problem: "Could not connect to database"
- Check your `DATABASE_URL` in `.env`
- Make sure password is correct (no `[` or `]` brackets)
- Test connection string in Supabase Dashboard

### Problem: "migrations folder already exists"
- Skip `flask db init`
- Go directly to `flask db migrate`

### Problem: "Target database is not up to date"
```bash
flask --app run db upgrade
```

### Problem: "Can't locate revision identified by 'xxxxx'"
```bash
# Delete migrations folder and start fresh
rm -rf migrations/
flask --app run db init
flask --app run db migrate -m "Initial migration"
flask --app run db upgrade
```

---

## ✅ Production Checklist

- [ ] Got Supabase PostgreSQL connection string
- [ ] Updated `.env` with correct `DATABASE_URL`
- [ ] Installed dependencies (`pip install -r requirements.txt`)
- [ ] Initialized Flask-Migrate (`flask --app run db init`)
- [ ] Created initial migration (`flask --app run db migrate`)
- [ ] Applied migration (`flask --app run db upgrade`)
- [ ] Verified tables in Supabase Dashboard
- [ ] Created admin user (`python run.py create-admin`)
- [ ] Tested login in Postman
- [ ] Data is stored in Supabase PostgreSQL ✅

---

## 🎓 Why This Setup is Better for Your Capstone

### SQLite (Old Way):
- ❌ File-based (nexus.db)
- ❌ Can't handle many users
- ❌ Hard to share with team
- ❌ No automatic backups
- ❌ Not professional

### PostgreSQL + Flask-Migrate (New Way):
- ✅ Cloud-based (accessible anywhere)
- ✅ Handles thousands of users
- ✅ Team can access same database
- ✅ Automatic backups by Supabase
- ✅ Professional and scalable
- ✅ Can modify tables without losing data
- ✅ Version control for database changes
- ✅ Industry standard

---

## 📝 Summary

**You're now using:**
```
Flask App
   ↓
SQLAlchemy (ORM)
   ↓
Flask-Migrate (Database Migrations)
   ↓
PostgreSQL (Supabase Cloud Database)
```

**This is a PRODUCTION-READY setup!** 🚀

Perfect for your capstone project with real data!

---

## 🎉 Next Steps

1. ✅ Complete the setup above
2. ✅ Test all endpoints in Postman
3. ✅ Start adding your real capstone data
4. ✅ Build your React Native frontend
5. ✅ Deploy and present your project!

**Good luck with your capstone! You've got this! 🎓**

