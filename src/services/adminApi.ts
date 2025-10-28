const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Attendee' | 'Attendant' | 'Admin';
  serial: string;
  createdAt?: string;
}

export interface Session {
  id: string;
  title: string;
  instructor: string;
  schedule: string;
  courseCode: string;
  isActive: boolean;
  members: string[];
  createdAt?: string;
}

export interface Analytics {
  totalUsers: number;
  activeUnits: number;
  avgAttendance: number;
  activeSessions: number;
  userDistribution: {
    attendees: number;
    attendants: number;
    admins: number;
  };
  recentActivity: string[];
}

class AdminApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Management
  async getUsers(): Promise<User[]> {
    return this.request('/admin/users');
  }

  async createUser(user: Omit<User, 'id' | 'serial' | 'createdAt'>): Promise<User> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Session Management
  async getSessions(): Promise<Session[]> {
    return this.request('/admin/sessions');
  }

  async createSession(session: Omit<Session, 'id' | 'createdAt'>): Promise<Session> {
    return this.request('/admin/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async updateSession(id: string, session: Partial<Session>): Promise<Session> {
    return this.request(`/admin/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(session),
    });
  }

  async deleteSession(id: string): Promise<void> {
    return this.request(`/admin/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    return this.request('/admin/analytics');
  }
}

export const adminApi = new AdminApiService();