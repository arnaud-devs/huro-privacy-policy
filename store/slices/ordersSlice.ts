import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

export interface PlaceOrderPayload {
  items: { productId: string; quantity: number }[];
  batchId: string;
  deliveryZoneId: string;
  momoName: string;
  momoPhone: string;
  deliveryNote?: string;
  customAddress?: string;
  gateId?: string;
  promotionId?: string;
}

interface OrdersState {
  isPlacing: boolean;
  error: string | null;
  lastOrderId: string | null;
  pendingOrder: PlaceOrderPayload | null;
}

const initialState: OrdersState = {
  isPlacing: false,
  error: null,
  lastOrderId: null,
  pendingOrder: null,
};

export const placeOrder = createAsyncThunk<
  { success: boolean; data: { id: string }; message: string },
  PlaceOrderPayload,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'orders/place',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      console.log('[placeOrder] payload:', JSON.stringify(payload, null, 2));
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('[placeOrder] status:', response.status, 'body:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.message || 'Failed to place order');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => { state.error = null; },
    setPendingOrder: (state, action) => { state.pendingOrder = action.payload; },
    clearPendingOrder: (state) => { state.pendingOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isPlacing = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isPlacing = false;
        state.lastOrderId = action.payload.data?.id ?? null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isPlacing = false;
        state.error = action.payload || 'Failed to place order';
      });
  },
});

export const { clearOrderError, setPendingOrder, clearPendingOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
