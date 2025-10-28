# 🚀 NEXUS Backend - Complete Setup & Run Guide

## 📋 **What This System Does:**

### **🏫 Perfect for ANY Institution:**
- **Universities** - Upload student lists
- **Schools** - Upload class rosters  
- **Companies** - Upload employee lists
- **Training Centers** - Upload participant lists

### **🔄 Automatic Process:**
1. **Admin uploads CSV/Excel** with names and emails
2. **System creates accounts** with random passwords
3. **Sends welcome emails** to ALL users automatically
4. **Users get login details** via email instantly

## 🛠️ **Complete Setup (5 Steps):**

### **Step 1: Install Dependencies**
```bash
cd nexus_backend
pip install -r requirements.txt
```

### **Step 2: Setup Environment (Optional)**
```bash
cp .env.example .env
# Edit .env with your email settings (optional)
```

### **Step 3: Initialize Database**
```bash
python run.py init-db
python run.py create-admin
```

### **Step 4: Start Server**
```bash
python run.py
```
**Server runs on: http://localhost:3000**

### **Step 5: Test Login**
```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.com","password":"admin123"}'
```

## 📊 **Bulk Upload Process:**

### **1. Create CSV/Excel File:**
```csv
name,email,role
John Doe,john@university.edu,Attendee
Jane Smith,jane@university.edu,Attendant
Bob Johnson,bob@university.edu,Attendee
```

### **2. Upload File:**
```bash
# Get admin token first (from login response)
TOKEN="your-jwt-token-here"

# Upload CSV file
curl -X POST http://localhost:3000/api/bulk/upload-users \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@users.csv"
```

### **3. Automatic Results:**
```json
{
  "message": "Bulk upload completed",
  "created_count": 3,
  "created_users": [
    {
      "name": "John Doe",
      "email": "john@university.edu",
      "role": "Attendee",
      "serial": "A-1001",
      "password": "Abc123Xyz",
      "email_sent": true
    }
  ]
}
```

### **4. Users Get Welcome Emails:**
```
Subject: Welcome to NEXUS!

Hello John Doe,
Your account is ready!

Login: john@university.edu
Password: Abc123Xyz

Please login and change your password.
```

## 🎯 **API Endpoints:**

### **Authentication:**
```bash
POST /api/auth/login              # Login
POST /api/auth/forgot-password    # Reset password
```

### **Bulk Operations:**
```bash
POST /api/bulk/upload-users       # Upload CSV/Excel
GET  /api/bulk/download-template  # Get CSV template
```

### **Admin Management:**
```bash
GET  /api/admin/users             # View all users
POST /api/admin/users             # Create single user
GET  /api/admin/analytics         # System stats
```

## 🏫 **Institution Examples:**

### **University Example:**
```csv
name,email,role
Dr. Smith,smith@university.edu,Attendant
Alice Johnson,alice@university.edu,Attendee
Bob Wilson,bob@university.edu,Attendee
```

### **Company Example:**
```csv
name,email,role
Manager John,john@company.com,Attendant
Employee Jane,jane@company.com,Attendee
Employee Mike,mike@company.com,Attendee
```

## ✅ **Features:**
- ✅ **Any Institution** - Works for schools, companies, etc.
- ✅ **Bulk Upload** - CSV/Excel files supported
- ✅ **Automatic Emails** - Welcome emails sent instantly
- ✅ **Random Passwords** - Secure auto-generated passwords
- ✅ **Role Assignment** - Admin/Attendant/Attendee roles
- ✅ **Error Handling** - Shows success/failure for each user
- ✅ **Template Download** - Get CSV template format

## 🧪 **Quick Test:**

1. **Start server:** `python run.py`
2. **Login as admin:** Use admin@nexus.com / admin123
3. **Create test CSV:** name,email,role format
4. **Upload file:** Use /api/bulk/upload-users endpoint
5. **Check results:** Users created + emails sent automatically

**Your system is now ready for ANY institution!** 🎉

## 📞 **Support:**
- Check logs for any errors
- Verify email settings in .env
- Test with small CSV first
- All users get instant access via email