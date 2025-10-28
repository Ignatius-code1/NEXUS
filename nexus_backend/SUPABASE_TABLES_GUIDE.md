# 🗄️ NEXUS - 6 Supabase Tables Explained

## 📊 **The 6 Tables Your System Creates:**

### **1. `admins` Table**
**Purpose:** Store admin users who manage the system
```sql
id          | integer (primary key)
name        | text
email       | text (unique)
password_hash | text
created_at  | timestamp
last_login  | timestamp
```
**Example:** Admin User, admin@nexus.com

---

### **2. `attendants` Table** 
**Purpose:** Store teachers/staff who create sessions and mark attendance
```sql
id          | integer (primary key)
name        | text
email       | text (unique)
password_hash | text
serial      | text (unique) - T-2001, T-2002, etc.
created_at  | timestamp
last_login  | timestamp
```
**Example:** Dr. Mike Brown, mike@university.edu, T-2001

---

### **3. `attendees` Table**
**Purpose:** Store students who attend sessions
```sql
id          | integer (primary key)
name        | text
email       | text (unique)
password_hash | text
serial      | text (unique) - A-1001, A-1002, etc.
created_at  | timestamp
last_login  | timestamp
```
**Example:** John Doe, john@university.edu, A-1001

---

### **4. `sessions` Table**
**Purpose:** Store class sessions created by attendants
```sql
id          | integer (primary key)
title       | text - "Database Systems"
instructor  | text - "Dr. Mike Brown"
schedule    | text - "Mon & Wed 10:00 AM"
course_code | text - "CS205"
is_active   | boolean
members     | text (JSON) - ["1", "2", "3"] (attendee IDs)
teacher_id  | integer (foreign key to attendants)
created_at  | timestamp
```
**Example:** Database Systems session taught by Dr. Mike Brown

---

### **5. `attendance` Table**
**Purpose:** Track who attended which sessions
```sql
id          | integer (primary key)
user_id     | integer (attendee ID)
session_id  | integer (session ID)
status      | text - "Present", "Absent", "Late"
timestamp   | timestamp - when attendance was marked
```
**Example:** John Doe was Present in Database Systems on 2024-01-15

---

### **6. `password_resets` Table**
**Purpose:** Store password reset codes for forgot password feature
```sql
id          | integer (primary key)
email       | text
code        | text - 6-digit code like "123456"
expires_at  | timestamp - code expires in 15 minutes
used        | boolean - if code was already used
created_at  | timestamp
```
**Example:** john@university.edu requested reset with code 123456

## 🔄 **How Tables Work Together:**

### **Admin Workflow:**
1. **Admin** uploads CSV → Creates records in `attendants` and `attendees` tables
2. **Attendant** logs in → `last_login` updated in `attendants` table
3. **Attendant** creates session → Record added to `sessions` table
4. **Attendant** marks attendance → Records added to `attendance` table
5. **Attendee** logs in → `last_login` updated in `attendees` table

### **Data Flow Example:**
```
Admin uploads CSV
    ↓
attendants table: Dr. Mike Brown (T-2001)
attendees table: John Doe (A-1001)
    ↓
Dr. Mike creates session
    ↓
sessions table: "Database Systems" by Dr. Mike
    ↓
Dr. Mike marks attendance
    ↓
attendance table: John Doe was Present
```

## 📋 **CSV Upload Options:**

### **Option 1: Separate Files**
```bash
POST /api/bulk/upload-attendees   # Only attendees
POST /api/bulk/upload-attendants  # Only attendants
```

### **Option 2: Mixed File**
```bash
POST /api/bulk/upload-mixed       # Both in one file
```

**Mixed CSV Format:**
```csv
name,email,role
John Doe,john@university.edu,Attendee
Dr. Mike Brown,mike@university.edu,Attendant
Jane Smith,jane@university.edu,Attendee
```

## ✅ **Benefits of 6 Tables:**
- ✅ **Clean separation** - Each role has its own space
- ✅ **Easy queries** - Find all attendees or attendants quickly
- ✅ **Scalable** - Can handle thousands of users per table
- ✅ **Secure** - Role-based access control
- ✅ **Trackable** - Login times and attendance history
- ✅ **Flexible** - Support any institution size

**Perfect database structure for any educational institution!** 🎉