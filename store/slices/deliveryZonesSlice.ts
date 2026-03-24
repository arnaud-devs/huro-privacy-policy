import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

export type DeliveryZoneType = 'CAMPUS' | 'EXTERNAL';

export interface DeliveryZone {
  id: string;
  name: string;
  type: DeliveryZoneType;
  deliveryFee: number;
  pickupLabel: string;
}

interface DeliveryZonesState {
  zones: DeliveryZone[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DeliveryZonesState = {
  zones: [],
  isLoading: false,
  error: null,
};

export const fetchDeliveryZones = createAsyncThunk<
  DeliveryZone[],
  { type?: DeliveryZoneType } | void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'deliveryZones/fetch',
  async (params, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = params?.type ? `?type=${params.type}` : '';

      const response = await fetch(`${API_BASE_URL}/delivery-zones${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch delivery zones');
      return data.data as DeliveryZone[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const deliveryZonesSlice = createSlice({
  name: 'deliveryZones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryZones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryZones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.zones = (action.payload as any[]).map((z) => ({
          ...z,
          deliveryFee: Number(z.deliveryFee ?? 0),
        }));
      })
      .addCase(fetchDeliveryZones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch delivery zones';
      });
  },
});

export default deliveryZonesSlice.reducer;
