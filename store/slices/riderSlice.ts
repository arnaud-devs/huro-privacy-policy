import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

export interface RiderProfile {
  id: string;
  idDocumentUrl: string | null;
  status: string;
  onlineStatus: string;
  updatedAt: string;
}

export type RiderBatchStatus = 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface BatchOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface BatchOrder {
  id: string;
  status: string;
  pickupSignature: string | null;
  orderItems: BatchOrderItem[];
}

export interface BatchDetail {
  id: string;
  slotLabel: string;
  scheduledAt: string;
  status: string;
  currentOrders: number;
  maxOrders: number;
  deliveryZone: { name: string };
  orders: BatchOrder[];
  riders: { id: string; fullName: string }[];
}

export interface RiderBatch {
  id: string;
  slotLabel: string;
  scheduledAt: string;
  status: RiderBatchStatus;
  currentOrders: number;
  maxOrders: number;
  deliveryZone: { name: string };
}

interface RiderState {
  profile: RiderProfile | null;
  batches: RiderBatch[];
  isFetchingBatches: boolean;
  batchesError: string | null;
  batchDetail: BatchDetail | null;
  isLoadingBatchDetail: boolean;
  batchDetailError: string | null;
  isUploadingId: boolean;
  uploadError: string | null;
}

const initialState: RiderState = {
  profile: null,
  batches: [],
  isFetchingBatches: false,
  batchesError: null,
  batchDetail: null,
  isLoadingBatchDetail: false,
  batchDetailError: null,
  isUploadingId: false,
  uploadError: null,
};

export const fetchBatchDetail = createAsyncThunk<
  BatchDetail,
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/fetchBatchDetail',
  async (batchId, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/batches/${batchId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log('[fetchBatchDetail] status:', response.status, 'body:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch batch');
      const raw = data.data?.batch ?? data.data?.data ?? data.data;
      return raw as BatchDetail;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchRiderBatches = createAsyncThunk<
  RiderBatch[],
  { status?: RiderBatchStatus; page?: number; limit?: number } | void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/fetchBatches',
  async (params, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const url = `${API_BASE_URL}/riders/me/batches${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log('[fetchRiderBatches] status:', response.status, 'body:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch batches');
      return (data.data?.data ?? data.data?.items ?? []) as RiderBatch[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const uploadIdDocument = createAsyncThunk<
  RiderProfile,
  { imageUri: string },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/uploadIdDocument',
  async ({ imageUri }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const formData = new FormData();
      formData.append('idDocument', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'id-document.jpg',
      } as any);

      const response = await fetch(`${API_BASE_URL}/riders/me/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to upload ID document');
      return data.data as RiderProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    clearUploadError: (state) => { state.uploadError = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchDetail.pending, (state) => {
        state.isLoadingBatchDetail = true;
        state.batchDetailError = null;
        state.batchDetail = null;
      })
      .addCase(fetchBatchDetail.fulfilled, (state, action) => {
        state.isLoadingBatchDetail = false;
        state.batchDetail = action.payload;
      })
      .addCase(fetchBatchDetail.rejected, (state, action) => {
        state.isLoadingBatchDetail = false;
        state.batchDetailError = action.payload || 'Failed to fetch batch';
      })
      .addCase(fetchRiderBatches.pending, (state) => {
        state.isFetchingBatches = true;
        state.batchesError = null;
      })
      .addCase(fetchRiderBatches.fulfilled, (state, action) => {
        state.isFetchingBatches = false;
        state.batches = action.payload;
      })
      .addCase(fetchRiderBatches.rejected, (state, action) => {
        state.isFetchingBatches = false;
        state.batchesError = action.payload || 'Failed to fetch batches';
      })
      .addCase(uploadIdDocument.pending, (state) => {
        state.isUploadingId = true;
        state.uploadError = null;
      })
      .addCase(uploadIdDocument.fulfilled, (state, action) => {
        state.isUploadingId = false;
        state.profile = action.payload;
      })
      .addCase(uploadIdDocument.rejected, (state, action) => {
        state.isUploadingId = false;
        state.uploadError = action.payload || 'Failed to upload ID document';
      });
  },
});

export const { clearUploadError } = riderSlice.actions;
export default riderSlice.reducer;
