import { apiClient } from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

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
