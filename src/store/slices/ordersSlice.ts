import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockOrders, mockServices, delay } from '@/api/mockData';

export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'completed';

export interface Order {
  id: number;
  service_id: number;
  service_name: string;
  user_id: number;
  date: string;
  status: OrderStatus;
  created_at: string;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

// Async thunks с моковыми данными
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  await delay(500);
  return [...mockOrders];
});

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: { service_id: number; date: string }) => {
    await delay(300);
    const service = mockServices.find(s => s.id === orderData.service_id);
    if (!service) {
      throw new Error('Услуга не найдена');
    }
    const newOrder: Order = {
      id: Math.max(...mockOrders.map(o => o.id), 0) + 1,
      service_id: orderData.service_id,
      service_name: service.name,
      user_id: 1, // Временно, потом из auth
      date: orderData.date,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    return newOrder;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: number; status: OrderStatus }) => {
    await delay(300);
    const index = mockOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      mockOrders[index] = { ...mockOrders[index], status };
      return mockOrders[index];
    }
    throw new Error('Заказ не найден');
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });

    // Create order
    builder
      .addCase(createOrder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления статуса заказа';
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
