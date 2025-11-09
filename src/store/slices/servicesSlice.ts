import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockServices, delay } from '@/api/mockData';

export interface Service {
  id: number;
  name: string;
  price: number;
  img: string;
  duration: number; // в минутах
  description?: string;
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  isLoading: false,
  error: null,
};

// Async thunks с моковыми данными
export const fetchServices = createAsyncThunk('services/fetchServices', async () => {
  await delay(500); // Имитация задержки сети
  return [...mockServices];
});

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData: Omit<Service, 'id'>) => {
    await delay(300);
    const newService: Service = {
      ...serviceData,
      id: Math.max(...mockServices.map(s => s.id), 0) + 1,
    };
    mockServices.push(newService);
    return newService;
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, data }: { id: number; data: Partial<Service> }) => {
    await delay(300);
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) {
      mockServices[index] = { ...mockServices[index], ...data };
      return mockServices[index];
    }
    throw new Error('Услуга не найдена');
  }
);

export const deleteService = createAsyncThunk('services/deleteService', async (id: number) => {
  await delay(300);
  const index = mockServices.findIndex(s => s.id === id);
  if (index !== -1) {
    mockServices.splice(index, 1);
    return id;
  }
  throw new Error('Услуга не найдена');
});

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch services
    builder
      .addCase(fetchServices.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки услуг';
      });

    // Create service
    builder
      .addCase(createService.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания услуги';
      });

    // Update service
    builder
      .addCase(updateService.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления услуги';
      });

    // Delete service
    builder
      .addCase(deleteService.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = state.services.filter(s => s.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка удаления услуги';
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
