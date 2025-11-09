import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isModalOpen: boolean;
  modalType: 'createService' | 'editService' | 'createOrder' | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}

const initialState: UiState = {
  isModalOpen: false,
  modalType: null,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<UiState['modalType']>) => {
      state.isModalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: state => {
      state.isModalOpen = false;
      state.modalType = null;
    },
    showNotification: (state, action: PayloadAction<UiState['notification']>) => {
      state.notification = action.payload;
    },
    hideNotification: state => {
      state.notification = null;
    },
  },
});

export const { openModal, closeModal, showNotification, hideNotification } = uiSlice.actions;
export default uiSlice.reducer;
