// Mock data service that simulates backend calls
// This works without requiring backend modifications

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
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAttendees(): Promise<Attendee[]> {
    await this.delay();
    return mockAttendees.map(a => ({ ...a, present: false }));
  }

  async getSessions(): Promise<Session[]> {
    await this.delay();
    return [...mockSessions];
  }

  async createSession(sessionData: {
    title: string;
    courseCode?: string;
    startTime: string;
    endTime: string;
  }): Promise<Session> {
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

  async getAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    await this.delay();
    return mockAttendance.filter(a => a.session_id === sessionId);
  }

  async markAttendance(attendeeId: string, sessionId: string, status: string): Promise<AttendanceRecord> {
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

  async getReports(sessionId: string): Promise<AttendanceRecord[]> {
    await this.delay();
    return mockAttendance.filter(a => a.session_id === sessionId);
  }
}

export const attendantApi = new AttendantApiService();