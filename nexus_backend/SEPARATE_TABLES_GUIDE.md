# 🗄️ NEXUS - Separate Database Tables Guide

## ✅ **Perfect! Now You Have:**

### **🏗️ Separate Database Tables:**
- ✅ **`admins`** table - Admin users only
- ✅ **`attendants`** table - Teachers/Staff only  
- ✅ **`attendees`** table - Students only
- ✅ **Login tracking** - When each user last logged in

### **📊 Database Structure:**

#### **Admins Table:**
```sql
id, name, email, password_hash, created_at, last_login
```

#### **Attendants Table:**
```sql
id, name, email, password_hash, serial, created_at, last_login
```

#### **Attendees Table:**
```sql
id, name, email, password_hash, serial, created_at, last_login
```

## 🚀 **How It Works:**

### **1. Admin Interface (First):**
```bash
# Admin logs in first
POST /api/auth/login
{"email": "admin@nexus.com", "password": "admin123"}

# Admin uploads attendees CSV
POST /api/bulk/upload-attendees
File: sample_attendees.csv

# Admin uploads attendants CSV  
POST /api/bulk/upload-attendants
File: sample_attendants.csv
```

### **2. Automatic Process:**
- ✅ **Creates separate records** in attendees/attendants tables
- ✅ **Generates unique serials** (A-1001, T-2001, etc.)
- ✅ **Sends welcome emails** to all users
- ✅ **Tracks login times** when users login

### **3. Login Tracking:**
```bash
# When attendee logs in
POST /api/auth/login
{"email": "john@university.edu", "password": "Abc123Xyz"}

# System automatically:
# 1. Updates last_login timestamp
# 2. Admin can see when John logged in
```

## 📋 **API Endpoints:**

### **Admin Operations:**
```bash
POST /api/bulk/upload-attendees    # Upload attendees CSV
POST /api/bulk/upload-attendants   # Upload attendants CSV
GET  /api/bulk/login-activity      # See who logged in when
```

### **Universal Login:**
```bash
POST /api/auth/login               # Works for all user types
```

## 🧪 **Test It:**

### **Step 1: Setup**
```bash
python run.py init-db
python run.py create-admin
python run.py
```

### **Step 2: Login as Admin**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.com","password":"admin123"}'
```

### **Step 3: Upload Attendees**
```bash
curl -X POST http://localhost:3000/api/bulk/upload-attendees \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@sample_attendees.csv"
```

### **Step 4: Upload Attendants**
```bash
curl -X POST http://localhost:3000/api/bulk/upload-attendants \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@sample_attendants.csv"
```

### **Step 5: Check Login Activity**
```bash
curl -X GET http://localhost:3000/api/bulk/login-activity \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## ✅ **Perfect Features:**
- ✅ **Admin first** - Admin interface is the starting point
- ✅ **Separate tables** - Clean database structure
- ✅ **CSV uploads** - Bulk create attendees and attendants
- ✅ **Login tracking** - See when users logged in
- ✅ **Automatic emails** - Welcome emails sent to all
- ✅ **Simple code** - Easy to understand
- ✅ **Supabase ready** - Will create separate tables in Supabase

## 🎯 **Supabase Tables:**
When you connect to Supabase, you'll see:
- `admins` table
- `attendants` table  
- `attendees` table
- `sessions` table
- `attendance` table
- `password_resets` table

**Perfect for institutional management!** 🎉