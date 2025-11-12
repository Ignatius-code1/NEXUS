# 📡 NEXUS Bluetooth Attendance System - README

## 🎯 What Is This?

NEXUS is a **student attendance management system** that uses "Bluetooth sessions" to mark attendance. Despite the name, the current implementation uses **HTTP API calls** rather than actual Bluetooth scanning (simplified for development).

---

## ⚡ Quick Start

### **How It Works (3 Steps):**

1. **Teacher creates a session** → Session stored in database as "active"
2. **Student scans for sessions** → Gets list via API call
3. **Student joins session** → Attendance automatically marked as "Present"

---

## 👥 User Roles

### **Attendant (Teacher):**
- Create attendance sessions
- View real-time attendance counts
- End sessions when class is over
- View teaching schedule and reports

### **Attendee (Student):**
- Scan for active sessions
- Join sessions to mark attendance
- View personal schedule
- Auto-enrolled in courses when joining

---

## 🔑 Key Features

✅ **One Session at a Time** - Students can't join multiple active sessions  
✅ **Auto-Enrollment** - Students automatically enrolled when joining  
✅ **Real-Time Counts** - See attendance statistics instantly  
✅ **Session Management** - Start/end sessions with one click  
✅ **Smart Scheduling** - View all sessions grouped by course  

---

## 📱 User Interface

### **Teacher Dashboard:**
```
┌─────────────────────────────────┐
│  My Classes                     │
│  ┌───────────────────────────┐  │
│  │ Math 101                  │  │
│  │ Start Session ▶           │  │
│  └───────────────────────────┘  │
│                                 │
│  My Sessions                    │
│  ┌───────────────────────────┐  │
│  │ Morning Lecture           │  │
│  │ Math 101 • Active 🟢      │  │
│  │ 👥 15 joined, ✅ 12 present│  │
│  │ [End Session]             │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### **Student Dashboard:**
```
┌─────────────────────────────────┐
│  My Classes                     │
│  ┌───────────────────────────┐  │
│  │ Math 101                  │  │
│  │ [Scan for Sessions] 📡    │  │
│  └───────────────────────────┘  │
│                                 │
│  Active Sessions Found          │
│  ┌───────────────────────────┐  │
│  │ Morning Lecture           │  │
│  │ Math 101 • Dr. Smith      │  │
│  │ Monday 9:00 AM            │  │
│  │ [Join Session] ✅         │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🔄 Complete Flow

```
TEACHER                          STUDENT
   │                                │
   │ 1. Create Session              │
   ├──────────────┐                 │
   │              ▼                 │
   │         [Database]             │
   │         is_active=True         │
   │                                │
   │                                │ 2. Scan Sessions
   │                                ├──────────────┐
   │                                │              ▼
   │                                │         [API Call]
   │                                │         GET /scan
   │                                │              │
   │                                │ ◄────────────┘
   │                                │ [List of sessions]
   │                                │
   │                                │ 3. Join Session
   │                                ├──────────────┐
   │                                │              ▼
   │                                │         [API Call]
   │                                │         POST /join
   │                                │              │
   │                                │              ▼
   │                                │      [Attendance Record]
   │                                │      status="Present"
   │                                │              │
   │                                │ ◄────────────┘
   │                                │ "Marked! ✅"
   │                                │
   │ 4. View Attendance             │
   ├──────────────┐                 │
   │              ▼                 │
   │    "👥 15 joined,              │
   │     ✅ 12 present"             │
   │                                │
   │ 5. End Session                 │
   ├──────────────┐                 │
   │              ▼                 │
   │         [Database]             │
   │         is_active=False        │
   │                                │
```

---

## 🗂️ Project Structure

```
NEXUS/
├── front-end/                    # React Native (Expo)
│   └── src/
│       ├── screens/
│       │   ├── Attendant/
│       │   │   ├── AttendantDashboard.tsx
│       │   │   ├── StartSessionModal.tsx
│       │   │   └── AttendantScheduleScreen.tsx
│       │   └── Attendee/
│       │       ├── AttendeeDashboard.tsx
│       │       ├── ScanSessionsModal.tsx
│       │       └── ScheduleScreen.tsx
│       └── navigation/
│           └── AppNavigator.tsx
│
└── nexus_backend/                # Flask API
    └── app/
        ├── routes/
        │   ├── attendant_routes.py    # Teacher endpoints
        │   ├── attendee_routes.py     # Student endpoints
        │   └── attendance_routes.py   # BLE validation (legacy)
        ├── services/
        │   ├── bluetoothservive.py    # BLE logic
        │   └── device_service.py      # Session management
        ├── models/
        │   ├── session_model.py       # Session database
        │   ├── attendance.py          # Attendance records
        │   └── device_model.py        # BLE devices (legacy)
        └── utils/
            └── fingerprint.py         # BLE validation
```

---

## 📡 API Endpoints

### **Teacher Endpoints:**
```http
POST   /api/attendant/sessions          # Create session
GET    /api/attendant/sessions          # Get my sessions
POST   /api/attendant/sessions/:id/end  # End session
GET    /api/attendant/schedule          # Get teaching schedule
```

### **Student Endpoints:**
```http
GET    /api/attendee/sessions/scan      # Scan for active sessions
POST   /api/attendee/sessions/:id/join  # Join session
GET    /api/attendee/schedule           # Get my schedule
```

---

## 🗄️ Database Schema

### **Sessions Table:**
```sql
id              INTEGER PRIMARY KEY
title           VARCHAR(200)        -- "Morning Lecture"
course_code     VARCHAR(50)         -- "Math 101"
attendant_id    INTEGER             -- Teacher's ID
attendant_name  VARCHAR(100)        -- "Dr. Smith"
schedule        VARCHAR(200)        -- "Monday 9:00 AM"
is_active       BOOLEAN             -- True/False
members         TEXT                -- JSON array
created_at      TIMESTAMP
```

### **Attendance Table:**
```sql
id              INTEGER PRIMARY KEY
attendee_id     INTEGER             -- Student's ID
session_id      INTEGER             -- Session ID
status          VARCHAR(20)         -- "Present"
timestamp       TIMESTAMP           -- When marked
```

---

## 🔐 Business Rules

### **Session Creation:**
- Must have title, course code, and schedule
- Attendant must be authenticated
- Session marked as `is_active = True`

### **Joining Session:**
- Session must be active (`is_active = True`)
- Student cannot be in another active session
- Student auto-enrolled in course if not already
- Attendance record created with `status = "Present"`

### **Ending Session:**
- Only session creator can end it
- Sets `is_active = False`
- Students can no longer join

---

## 🎨 Tech Stack

**Frontend:**
- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage

**Backend:**
- Flask (Python)
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication
- Flask-CORS

**Communication:**
- REST API (JSON)
- Bearer Token Auth

---

## 🚀 Running the System

### **Backend:**
```bash
cd nexus_backend
python run.py
# Server runs on http://172.30.39.233:3000
```

### **Frontend:**
```bash
cd front-end
npm start
# or
expo start
```

### **Environment Variables:**
```bash
# Frontend (.env.local)
EXPO_PUBLIC_API_URL=http://172.30.39.233:3000/api

# Backend
DATABASE_URL=postgresql://user:pass@localhost/nexus
JWT_SECRET_KEY=your-secret-key
```

---

## 🔍 Why "Bluetooth" if it's HTTP?

The system has **two implementations**:

1. **Current (Active):** HTTP-based session system
   - Simplified for development
   - No actual Bluetooth hardware needed
   - "Bluetooth" is just the session name

2. **Legacy (Available):** Real BLE proximity validation
   - Uses RSSI (signal strength) to verify proximity
   - Requires Bluetooth hardware
   - Code exists but not integrated with frontend

**Future:** Can upgrade to real BLE scanning using the legacy system.

---

## 📊 Key Metrics

**Attendance Tracking:**
- `attendanceCount` - Total students who joined
- `presentCount` - Students marked as present
- Real-time updates from database queries

**Session Status:**
- `is_active = True` - Session is live, students can join
- `is_active = False` - Session ended, no more joins

---

## 🐛 Common Issues

**Sessions not showing?**
- Check `is_active = True` in database
- Verify API endpoint URL
- Check authentication token

**Can't join session?**
- Already in another active session?
- Session still active?
- Check console for error messages

**Attendance count wrong?**
- Refresh the dashboard
- Check database attendance records
- Verify session_id matches

---

## 📚 Additional Documentation

For more detailed information, see:
- Full system explanation (if needed)
- API documentation in route files
- Database models in model files
- Component documentation in screen files

---

## 🎯 Summary

**NEXUS** is a simple, effective attendance system that:
- ✅ Uses session-based attendance marking
- ✅ Prevents multiple simultaneous sessions
- ✅ Auto-enrolls students in courses
- ✅ Provides real-time attendance statistics
- ✅ Works via HTTP API (no Bluetooth hardware needed)
- ✅ Can be upgraded to real BLE in the future

**Perfect for:** Classrooms, lectures, labs, workshops, and any attendance tracking needs!


