import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

export interface Gate {
  id: string;
  name: string;
  isActive: boolean;
}

interface GatesState {
  gates: Gate[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GatesState = {
  gates: [],
  isLoading: false,
  error: null,
};

export const fetchGates = createAsyncThunk<
  Gate[],
  string,
  { rejectValue: string }
>(
  'gates/fetch',
  async (zoneId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campuses/${zoneId}/gates`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch gates');
      return data.data as Gate[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const gatesSlice = createSlice({
  name: 'gates',
  initialState,
  reducers: {
    clearGates: (state) => {
      state.gates = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gates = action.payload.filter((g) => g.isActive);
      })
      .addCase(fetchGates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch gates';
      });
  },
});

export const { clearGates } = gatesSlice.actions;
export default gatesSlice.reducer;
