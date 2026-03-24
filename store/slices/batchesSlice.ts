import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

export interface BatchRider {
  id: string;
  fullName: string;
}

export interface Batch {
  id: string;
  slotLabel: string;
  scheduledAt: string;
  fillPercent: number;
  slotsRemaining: number;
  deliveryZone: Record<string, any>;
  riders: BatchRider[];
}

interface BatchesState {
  batches: Batch[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BatchesState = {
  batches: [],
  isLoading: false,
  error: null,
};

export const fetchOpenBatches = createAsyncThunk<
  Batch[],
  { deliveryZoneId?: string } | void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'batches/fetchOpen',
  async (params, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = params?.deliveryZoneId
        ? `?deliveryZoneId=${params.deliveryZoneId}`
        : '';

      const response = await fetch(`${API_BASE_URL}/batches/open${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch batches');
      return data.data as Batch[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const batchesSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenBatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOpenBatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.batches = action.payload;
      })
      .addCase(fetchOpenBatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch batches';
      });
  },
});

export default batchesSlice.reducer;
