import { apiClient } from './axios';
import type { Order, OrderStatus } from '@/store/slices/ordersSlice';

export const ordersApi = {
  getOrders: async () => {
    const response = await apiClient.get<Order[]>('/orders');
    return response;
  },

  createOrder: async (data: { service_id: number; date: string }) => {
    const response = await apiClient.post<Order>('/orders', data);
    return response;
  },

  updateOrderStatus: async (id: number, status: OrderStatus) => {
    const response = await apiClient.put<Order>(`/orders/${id}`, { status });
    return response;
  },
};
