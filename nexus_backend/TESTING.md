# 🧪 NEXUS Backend Testing Guide

## 🚀 **How to Run & Test Everything**

### **1. Setup & Run**
```bash
cd nexus_backend

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your values

# Initialize database
python run.py init-db

# Create admin user
python run.py create-admin

# Run the app
python run.py
```

### **2. Test with Postman**

#### **📧 Login Test**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
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
    "role": "Admin",
    "serial": "ADM-1"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### **👤 Register Test**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Attendee"
}
```

#### **🔐 Forgot Password Flow**

**Step 1: Request Reset Code**
```
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "admin@nexus.com"
}
```

**Step 2: Verify Code**
```
POST http://localhost:3000/api/auth/verify-reset-code
Content-Type: application/json

{
  "email": "admin@nexus.com",
  "code": "123456"
}
```

**Step 3: Reset Password**
```
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "email": "admin@nexus.com",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

### **3. Supabase Setup**

1. **Create Supabase Project**
2. **Get Database URL from Settings > Database**
3. **Update .env:**
```
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]
```

4. **Run Migrations:**
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### **4. Email Setup (Gmail)**

1. **Enable 2FA on Gmail**
2. **Generate App Password**
3. **Update .env:**
```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-digit-app-password
```

## ✅ **Task Requirements Fulfilled**

### **Core App Setup** ✅
- `app/__init__.py` - Flask app initialization with database & JWT
- `app/config.py` - Configuration handling (Supabase, JWT secrets)

### **Authentication** ✅
- `app/utils/auth.py` - Complete JWT logic with decorators
- `/login` endpoint - Returns JWT tokens on successful login

### **Password Reset** ✅
- `/forgot-password` - Send reset code to email
- `/verify-reset-code` - Verify 6-digit code
- `/reset-password` - Update password with verified code

## 🔧 **Quick Test Commands**

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.com","password":"admin123"}'

# Test forgot password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.com"}'
```

Your backend is now complete and ready for production! 🎉