// Общие типы домена и UI

// Auth
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'client' | 'admin';
  avatar: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Services
export interface Service {
  id: number;
  name: string;
  price: number;
  img: string;
  duration: number; // в минутах
  description?: string;
}

// Orders
export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  service_id: number;
  service_name: string;
  user_id: number;
  date: string;
  status: OrderStatus;
  created_at: string;
  notes?: string;
  cancellation_reason?: string;
}

export interface CreateOrderPayload {
  service_id: number;
  date: string;
  notes?: string;
}

// Theme
export type Theme = 'dark' | 'light' | 'system';

// Component props
export interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'admin';
}

export interface IUser {
  name: string;
  email: string;
  avatar: string;
}
