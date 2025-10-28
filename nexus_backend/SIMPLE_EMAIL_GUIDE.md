# 📧 NEXUS Email System - Simple Guide

## 🎯 **What email.py Does:**

### **1. Welcome Emails** 📩
When an **Admin creates a new user**, the system automatically:
- Generates a random temporary password
- Sends welcome email with login details
- User gets email with their username and password

### **2. Password Reset** 🔐
When someone forgets their password:
- System sends 6-digit reset code
- User enters code to reset password

## 🚀 **How It Works:**

### **Admin Creates User → Automatic Email**
```python
# Admin creates user via API
POST /api/admin/users
{
  "name": "John Doe",
  "email": "john@example.com", 
  "role": "Attendee"
}

# System automatically:
# 1. Creates user with random password
# 2. Sends welcome email to john@example.com
# 3. Email contains login details
```

### **Welcome Email Example:**
```
Subject: Welcome to NEXUS - Your Account is Ready!

Hello John Doe,

Welcome to NEXUS Attendance System!

Your account has been created by an administrator.

Login Details:
Email: john@example.com
Temporary Password: Abc123Xyz

Please login and change your password immediately.

Login at: http://localhost:3000

Best regards,
NEXUS Team
```

## ⚙️ **Setup (Optional)**

### **If you want emails to work:**
1. **Get Gmail App Password:**
   - Go to Gmail Settings
   - Enable 2-Factor Authentication
   - Generate App Password

2. **Update .env:**
```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-digit-app-password
```

### **If you don't setup email:**
- System still works perfectly
- Users just won't get emails
- Admin can manually share login details

## 🧪 **Test It:**

```bash
# Create user (triggers welcome email)
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "Attendee"
  }'
```

## ✅ **Simple & Clean:**
- ✅ **Short code** - Only 60 lines total
- ✅ **Easy to understand** - Simple functions
- ✅ **Optional** - Works without email setup
- ✅ **Automatic** - No manual steps needed
- ✅ **Secure** - Random passwords generated

**Perfect for new user onboarding!** 🎉