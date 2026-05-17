import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';
const TOKEN_KEY = 'gymbook_access_token';

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
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
  register: (body: Record<string, string>) =>
    request<{ user: unknown; access_token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (email: string, password: string) =>
    request<{ user: unknown; access_token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<MeResponse>('/api/me'),
  sessions: () => request<{ sessions: Session[] }>('/api/sessions'),
  packages: () => request<{ packages: CreditPackage[] }>('/api/packages'),
  myBookings: () => request<{ bookings: Booking[] }>('/api/me/bookings'),
  createBooking: (sessionId: number) =>
    request<{ booking: Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
  cancelBooking: (id: number) =>
    request<{ message: string }>(`/api/bookings/${id}`, { method: 'DELETE' }),
  purchasePackage: (id: number) => request<MeResponse>(`/api/packages/${id}/purchase`, { method: 'POST' }),
};

export interface User {
  id: number;
  username: string;
  email: string;
  nome: string;
  cognome: string;
  role: string;
}

export interface Membership {
  credits_balance: number;
  organization_id: number;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
}

export interface MeResponse {
  user: User;
  membership?: Membership;
  organization?: Organization;
}

export interface Session {
  id: number;
  start_at: string;
  end_at: string;
  capacity: number;
  credits_required: number;
  instructor_name?: string;
  booked_count?: number;
  spots_left?: number;
  activity?: { name: string; description?: string };
}

export interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price_cents: number;
}

export interface Booking {
  id: number;
  status: string;
  created_at: string;
  session?: Session;
}
