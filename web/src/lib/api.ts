const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
const TOKEN_KEY = 'gymbook_staff_token';

export async function getToken(): Promise<string | null> {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? 'Request failed');
  }
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: User; access_token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ user: User }>('/api/me'),
  staffOrganization: () => request<Organization>('/api/staff/organization'),
  staffBookings: (status?: string) =>
    request<{ bookings: Booking[] }>(`/api/staff/bookings${status ? `?status=${status}` : ''}`),
  staffMembers: () => request<{ members: User[] }>('/api/staff/members'),
  staffActivities: () => request<{ activities: Activity[] }>('/api/staff/activities'),
  staffCreateSession: (body: CreateSessionBody) =>
    request<{ session: Session }>('/api/staff/sessions', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  sessions: () => request<{ sessions: Session[] }>('/api/sessions'),
};

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  username: string;
  role: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
}

export interface Activity {
  id: number;
  name: string;
  organization_id: number;
}

export interface Session {
  id: number;
  activity_id: number;
  start_at: string;
  end_at: string;
  capacity: number;
  credits_required: number;
  instructor_name?: string;
  activity?: Activity;
}

export interface Booking {
  id: number;
  status: string;
  created_at: string;
  user?: User;
  session?: Session;
}

export interface CreateSessionBody {
  activity_id: number;
  start_at: string;
  end_at: string;
  capacity: number;
  credits_required: number;
  instructor_name: string;
}
