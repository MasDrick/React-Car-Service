import { apiClient } from './axios';
import type { Order, OrderStatus, CreateOrderPayload } from '@/types';

export const ordersApi = {
  getOrders: async () => {
    const response = await apiClient.get<Order[]>('/orders');
    return response;
  },

  createOrder: async (data: CreateOrderPayload) => {
    const response = await apiClient.post<Order>('/orders', data);
    return response;
  },

  updateOrderStatus: async (id: number, status: OrderStatus) => {
    const response = await apiClient.put<Order>(`/orders/${id}`, { status });
    return response;
  },
};
