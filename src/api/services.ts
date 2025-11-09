import { apiClient } from './axios';
import type { Service } from '@/store/slices/servicesSlice';

export const servicesApi = {
  getServices: async () => {
    const response = await apiClient.get<Service[]>('/services');
    return response;
  },

  createService: async (data: Omit<Service, 'id'>) => {
    const response = await apiClient.post<Service>('/services', data);
    return response;
  },

  updateService: async (id: number, data: Partial<Service>) => {
    const response = await apiClient.put<Service>(`/services/${id}`, data);
    return response;
  },

  deleteService: async (id: number) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response;
  },
};
