# Nexus Attendance App

A React Native attendance tracking app with attendant features.

## Quick Start

### Start React Native App
```bash
npx expo start
```

### Test Attendant Features

#### Access via Email Link (Required)
Navigate to the Attendant page with the required parameter:
```javascript
navigation.navigate("Attendant", { fromEmail: "true" })
```

#### Deep Link (Production)
```
nexusapp://attendant?fromEmail=true
```

## Features

- **Email-only Access**: Attendant pages require `fromEmail=true` parameter
- **Attendee Management**: View and search attendees by name, email, or ID
- **Session Management**: Create and manage attendance sessions
- **Attendance Tracking**: Mark students present/absent with real-time updates
- **Reports**: View attendance statistics and export data
- **Search Functionality**: Search attendees by name, email, or ID
- **Error Handling**: User-friendly error messages and loading states

## Data Management

Currently uses mock data that simulates the backend database structure:
- **Users**: Attendees with name, email, role
- **Sessions**: Attendance sessions with BLE IDs and timestamps
- **Attendance**: Records linking attendees to sessions

## Architecture

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation with deep linking
- **State Management**: React hooks
- **Data Service**: Mock API service (ready for backend integration)
- **Styling**: Custom theme system with colors, shadows, typography

## Integration Ready

The app is structured to easily connect to the existing Flask/Supabase backend:
- Service layer abstracts data access
- TypeScript interfaces match database schema
- Error handling and loading states implemented
- Search and filtering functionality working