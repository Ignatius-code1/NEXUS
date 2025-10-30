// Configurable API service - can use mock data or real backend
// Set USE_REAL_BACKEND to true to connect to actual backend

const USE_REAL_BACKEND = false; // Change to true when backend is ready
const BACKEND_URL = 'http://localhost:5000'; // Your backend URL

export interface Attendee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  present?: boolean;
}

export interface Session {
  id: string;
  attendant_id?: string;
  ble_id?: string;
  started_at?: string;
  ended_at?: string;
  title?: string;
}

export interface AttendanceRecord {
  id: string;
  attendee_id: string;
  session_id: string;
  status: string;
  timestamp: string;
}

// Mock data that simulates the Supabase database
const mockAttendees: Attendee[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'attendee', created_at: '2024-01-01' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'attendee', created_at: '2024-01-01' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'attendee', created_at: '2024-01-01' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'attendee', created_at: '2024-01-01' },
];

const mockSessions: Session[] = [
  { id: '1', attendant_id: '1', ble_id: 'BLE_001', started_at: '2024-01-15T09:00:00Z', title: 'Computer Science 101' },
  { id: '2', attendant_id: '1', ble_id: 'BLE_002', started_at: '2024-01-15T11:00:00Z', ended_at: '2024-01-15T12:30:00Z', title: 'Mathematics 201' },
];

let mockAttendance: AttendanceRecord[] = [];

class AttendantApiService {
  // Simulate API delay for mock data
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Real backend API call
  private async apiCall(endpoint: string, options?: RequestInit): Promise<any> {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getAttendees(): Promise<Attendee[]> {
    if (USE_REAL_BACKEND) {
      // Real backend call - adjust endpoint as needed
      const response = await this.apiCall('/api/users?role=attendee');
      return response.map((user: any) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        present: false
      }));
    } else {
      // Mock data
      await this.delay();
      return mockAttendees.map(a => ({ ...a, present: false }));
    }
  }

  async getSessions(): Promise<Session[]> {
    if (USE_REAL_BACKEND) {
      // Real backend call
      const response = await this.apiCall('/api/sessions');
      return response.map((session: any) => ({
        id: session.id.toString(),
        attendant_id: session.attendant_id?.toString(),
        ble_id: session.ble_id,
        started_at: session.started_at,
        ended_at: session.ended_at,
        title: session.title || `Session ${session.id}`
      }));
    } else {
      // Mock data
      await this.delay();
      return [...mockSessions];
    }
  }

  async createSession(sessionData: {
    title: string;
    courseCode?: string;
    startTime: string;
    endTime: string;
  }): Promise<Session> {
    if (USE_REAL_BACKEND) {
      // Real backend call
      const response = await this.apiCall('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({
          attendant_id: 1, // Default attendant ID
          ble_id: `BLE_${Date.now()}`,
          title: sessionData.title
        })
      });
      return {
        id: response.id.toString(),
        attendant_id: response.attendant_id?.toString(),
        ble_id: response.ble_id,
        started_at: response.started_at,
        ended_at: response.ended_at,
        title: sessionData.title
      };
    } else {
      // Mock data
      await this.delay();
      const newSession: Session = {
        id: String(mockSessions.length + 1),
        attendant_id: '1',
        ble_id: `BLE_${Date.now()}`,
        started_at: new Date().toISOString(),
        title: sessionData.title
      };
      mockSessions.push(newSession);
      return newSession;
    }
  }

  async getAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    await this.delay();
    return mockAttendance.filter(a => a.session_id === sessionId);
  }

  async markAttendance(attendeeId: string, sessionId: string, status: string): Promise<AttendanceRecord> {
    if (USE_REAL_BACKEND) {
      // Real backend call
      const response = await this.apiCall('/api/attendance', {
        method: 'POST',
        body: JSON.stringify({
          attendee_id: parseInt(attendeeId),
          session_id: parseInt(sessionId),
          status,
          timestamp: new Date().toISOString()
        })
      });
      return {
        id: response.id.toString(),
        attendee_id: response.attendee_id.toString(),
        session_id: response.session_id.toString(),
        status: response.status,
        timestamp: response.timestamp
      };
    } else {
      // Mock data
      await this.delay();
      const record: AttendanceRecord = {
        id: String(mockAttendance.length + 1),
        attendee_id: attendeeId,
        session_id: sessionId,
        status,
        timestamp: new Date().toISOString()
      };
      mockAttendance.push(record);
      return record;
    }
  }

  async getReports(sessionId: string): Promise<AttendanceRecord[]> {
    await this.delay();
    return mockAttendance.filter(a => a.session_id === sessionId);
  }
}

export const attendantApi = new AttendantApiService();