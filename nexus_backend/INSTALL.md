# 🚀 NEXUS Backend - Easy Installation Guide

## 📋 **Quick Setup (3 Steps)**

### **Step 1: Install SQLAlchemy-serializer**
```bash
pip install SQLAlchemy-serializer==1.4.1
```

### **Step 2: Run Setup Script**
```bash
cd nexus_backend
python setup.py
```

### **Step 3: Start the Server**
```bash
python run.py
```

## ✅ **Your Backend is Ready!**

- **Server:** http://localhost:3000
- **Admin Login:** admin@nexus.com / admin123
- **API Docs:** See TESTING.md

## 🔧 **Manual Setup (if needed)**

```bash
# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your values

# Initialize database
python run.py init-db

# Create admin user
python run.py create-admin

# Run server
python run.py
```

## 📁 **Clean Codebase Structure**

```
nexus_backend/
├── app/
│   ├── __init__.py          # ✅ Flask app + DB + JWT setup
│   ├── config.py            # ✅ Configuration (Supabase, JWT)
│   ├── models/
│   │   ├── user_model.py    # ✅ Simple User model
│   │   ├── session_model.py # ✅ Simple Session model
│   │   └── password_reset.py # ✅ Password reset model
│   ├── routes/
│   │   ├── auth_routes.py   # ✅ Login + Password reset
│   │   └── admin_routes.py  # ✅ User/Session management
│   └── utils/
│       ├── auth.py          # ✅ JWT logic + decorators
│       └── email.py         # ✅ Email sending
├── run.py                   # ✅ Main app runner
├── setup.py                 # ✅ Easy setup script
└── requirements.txt         # ✅ All dependencies
```

## 🎯 **All Requirements Fulfilled**

- ✅ **Core App Setup** - Flask + DB + JWT initialization
- ✅ **Configuration** - Supabase + JWT secrets handling  
- ✅ **Authentication** - Complete JWT logic + decorators
- ✅ **Login Endpoint** - Returns JWT tokens
- ✅ **Password Reset** - Complete email flow
- ✅ **Admin APIs** - User/Session management
- ✅ **Simple Code** - No complexity, beginner-friendly
- ✅ **No Duplicates** - Clean, organized structure

## 🧪 **Test Everything Works**

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.com","password":"admin123"}'

# Should return JWT token + user data
```

**Your backend is production-ready!** 🎉