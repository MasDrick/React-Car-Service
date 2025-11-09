import { apiClient } from './axios';
import type { User } from '@/store/slices/authSlice';

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

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response;
  },
};
