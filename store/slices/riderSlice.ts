import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

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

export interface RiderOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface RiderOrder {
  id: string;
  status: string;
  pickupSignature: string | null;
  snapshotZoneName: string;
  payableAmount: number;
  orderItems?: RiderOrderItem[];
  items?: RiderOrderItem[];
}

export interface RiderOrderDetail {
  id: string;
  status: string;
  paymentStatus: string;
  payableAmount: number;
  subtotal: number;
  deliveryFee: number;
  snapshotName: string;
  snapshotPhone: string;
  snapshotZoneName: string;
  snapshotZoneType: string;
  customAddress: string | null;
  pickupSignature: string | null;
  createdAt: string;
  orderItems?: RiderOrderItem[];
  items?: RiderOrderItem[];
}

export interface VerificationResult {
  valid: boolean;
  order: {
    id: string;
    status: string;
    customerName: string;
    deliveryLocation: string;
    items: { name: string; qty: number }[];
  };
}

export type DeliveryPhase = 'idle' | 'picking_up' | 'delivering' | 'arrived';

interface RiderState {
  profile: RiderProfile | null;
  batches: RiderBatch[];
  isFetchingBatches: boolean;
  batchesError: string | null;
  batchDetail: BatchDetail | null;
  isLoadingBatchDetail: boolean;
  batchDetailError: string | null;
  orders: RiderOrder[];
  isFetchingOrders: boolean;
  ordersError: string | null;
  orderDetail: RiderOrderDetail | null;
  isLoadingOrderDetail: boolean;
  orderDetailError: string | null;
  isMarkingDelivered: boolean;
  verificationResult: VerificationResult | null;
  isVerifying: boolean;
  verifyError: string | null;
  isUploadingId: boolean;
  uploadError: string | null;
  // New rider flow state
  deliveryPhase: DeliveryPhase;
  claimedOrderIds: string[];
  currentBatchId: string | null;
  deliveredOrderIds: string[];
}

const initialState: RiderState = {
  profile: null,
  batches: [],
  isFetchingBatches: false,
  batchesError: null,
  batchDetail: null,
  isLoadingBatchDetail: false,
  batchDetailError: null,
  orders: [],
  isFetchingOrders: false,
  ordersError: null,
  orderDetail: null,
  isLoadingOrderDetail: false,
  orderDetailError: null,
  isMarkingDelivered: false,
  verificationResult: null,
  isVerifying: false,
  verifyError: null,
  isUploadingId: false,
  uploadError: null,
  // New rider flow state
  deliveryPhase: 'idle',
  claimedOrderIds: [],
  currentBatchId: null,
  deliveredOrderIds: [],
};

// ─── Sample data for development (remove when APIs are ready) ───
export const SAMPLE_BATCHES: RiderBatch[] = [
  {
    id: 'batch-001',
    slotLabel: 'Morning Slot',
    scheduledAt: new Date(Date.now() + 45 * 60000).toISOString(),
    status: 'IN_PROGRESS',
    currentOrders: 6,
    maxOrders: 8,
    deliveryZone: { name: 'Engineering Campus' },
  },
  {
    id: 'batch-002',
    slotLabel: 'Afternoon Slot',
    scheduledAt: new Date(Date.now() + 3 * 3600000).toISOString(),
    status: 'CLOSED',
    currentOrders: 4,
    maxOrders: 6,
    deliveryZone: { name: 'Admin Block' },
  },
];

export const SAMPLE_BATCH_DETAIL: BatchDetail = {
  id: 'batch-001',
  slotLabel: 'Morning Slot',
  scheduledAt: new Date(Date.now() + 45 * 60000).toISOString(),
  status: 'IN_PROGRESS',
  currentOrders: 6,
  maxOrders: 8,
  deliveryZone: { name: 'Engineering Campus' },
  riders: [
    { id: 'rider-1', fullName: 'You' },
    { id: 'rider-2', fullName: 'Amina K.' },
  ],
  orders: [
    {
      id: 'order-101',
      status: 'CONFIRMED',
      pickupSignature: null,
      orderItems: [
        { id: 'item-1', productName: 'Chicken Shawarma', quantity: 2, unitPrice: 3500 },
        { id: 'item-2', productName: 'Fanta Orange', quantity: 1, unitPrice: 500 },
      ],
    },
    {
      id: 'order-102',
      status: 'CONFIRMED',
      pickupSignature: null,
      orderItems: [
        { id: 'item-3', productName: 'Beef Burger Combo', quantity: 1, unitPrice: 4500 },
        { id: 'item-4', productName: 'Mineral Water', quantity: 2, unitPrice: 300 },
      ],
    },
    {
      id: 'order-103',
      status: 'CONFIRMED',
      pickupSignature: null,
      orderItems: [
        { id: 'item-5', productName: 'Veggie Wrap', quantity: 1, unitPrice: 2800 },
      ],
    },
    {
      id: 'order-104',
      status: 'CONFIRMED',
      pickupSignature: 'rider-2',
      orderItems: [
        { id: 'item-6', productName: 'Pizza Margherita', quantity: 1, unitPrice: 5000 },
        { id: 'item-7', productName: 'Coca Cola', quantity: 2, unitPrice: 500 },
      ],
    },
    {
      id: 'order-105',
      status: 'CONFIRMED',
      pickupSignature: 'rider-2',
      orderItems: [
        { id: 'item-8', productName: 'Jollof Rice', quantity: 1, unitPrice: 3000 },
        { id: 'item-9', productName: 'Grilled Chicken', quantity: 1, unitPrice: 2500 },
      ],
    },
    {
      id: 'order-106',
      status: 'CONFIRMED',
      pickupSignature: null,
      orderItems: [
        { id: 'item-10', productName: 'Suya Plate', quantity: 1, unitPrice: 4000 },
      ],
    },
  ],
};

export const SAMPLE_ORDER_DETAILS: Record<string, RiderOrderDetail> = {
  'order-101': {
    id: 'order-101',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    payableAmount: 7500,
    subtotal: 7000,
    deliveryFee: 500,
    snapshotName: 'Ibrahim Musa',
    snapshotPhone: '+234 801 234 5678',
    snapshotZoneName: 'Engineering Campus',
    snapshotZoneType: 'CAMPUS',
    customAddress: 'Block B, Room 204',
    pickupSignature: null,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    orderItems: [
      { id: 'item-1', productName: 'Chicken Shawarma', quantity: 2, unitPrice: 3500, lineTotal: 7000 },
      { id: 'item-2', productName: 'Fanta Orange', quantity: 1, unitPrice: 500, lineTotal: 500 },
    ],
  },
  'order-102': {
    id: 'order-102',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    payableAmount: 5100,
    subtotal: 4600,
    deliveryFee: 500,
    snapshotName: 'Fatima Ahmed',
    snapshotPhone: '+234 802 345 6789',
    snapshotZoneName: 'Engineering Campus',
    snapshotZoneType: 'CAMPUS',
    customAddress: 'Lab 3, Ground Floor',
    pickupSignature: null,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    orderItems: [
      { id: 'item-3', productName: 'Beef Burger Combo', quantity: 1, unitPrice: 4500, lineTotal: 4500 },
      { id: 'item-4', productName: 'Mineral Water', quantity: 2, unitPrice: 300, lineTotal: 600 },
    ],
  },
  'order-103': {
    id: 'order-103',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    payableAmount: 3300,
    subtotal: 2800,
    deliveryFee: 500,
    snapshotName: 'John Okafor',
    snapshotPhone: '+234 803 456 7890',
    snapshotZoneName: 'Engineering Campus',
    snapshotZoneType: 'CAMPUS',
    customAddress: null,
    pickupSignature: null,
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    orderItems: [
      { id: 'item-5', productName: 'Veggie Wrap', quantity: 1, unitPrice: 2800, lineTotal: 2800 },
    ],
  },
  'order-106': {
    id: 'order-106',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    payableAmount: 4500,
    subtotal: 4000,
    deliveryFee: 500,
    snapshotName: 'Grace Adebayo',
    snapshotPhone: '+234 804 567 8901',
    snapshotZoneName: 'Engineering Campus',
    snapshotZoneType: 'CAMPUS',
    customAddress: 'Hostel C, Room 112',
    pickupSignature: null,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    orderItems: [
      { id: 'item-10', productName: 'Suya Plate', quantity: 1, unitPrice: 4000, lineTotal: 4000 },
    ],
  },
};

export const fetchRiderOrders = createAsyncThunk<
  RiderOrder[],
  { picked?: boolean; status?: string; page?: number; limit?: number } | void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/fetchOrders',
  async (params, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
      if (params?.picked !== undefined) query.append('picked', String(params.picked));
      if (params?.status) query.append('status', params.status);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const url = `${API_BASE_URL}/orders${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log('[fetchRiderOrders] status:', response.status, 'body:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch orders');
      const raw = data.data;
      return (Array.isArray(raw) ? raw : raw?.data ?? raw?.items ?? []) as RiderOrder[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const markOrderDelivered = createAsyncThunk<
  string,
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/markOrderDelivered',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/orders/rider/${orderId}/deliver`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to mark as delivered');
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchRiderOrderDetail = createAsyncThunk<
  RiderOrderDetail,
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/fetchOrderDetail',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch order');
      const raw = data.data?.order ?? data.data;
      return raw as RiderOrderDetail;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

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

export const verifyPickupSignature = createAsyncThunk<
  VerificationResult,
  { orderId: string; signature: string },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'rider/verifyPickupSignature',
  async ({ orderId, signature }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/orders/rider/${orderId}/verify-pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ signature }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Verification failed');
      return data.data as VerificationResult;
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
    claimOrders: (state, action: { payload: string[] }) => {
      const newIds = action.payload.filter(id => !state.claimedOrderIds.includes(id));
      state.claimedOrderIds = [...state.claimedOrderIds, ...newIds];
    },
    unclaimOrder: (state, action: { payload: string }) => {
      state.claimedOrderIds = state.claimedOrderIds.filter(id => id !== action.payload);
    },
    setCurrentBatch: (state, action: { payload: string }) => {
      state.currentBatchId = action.payload;
    },
    setDeliveryPhase: (state, action: { payload: DeliveryPhase }) => {
      state.deliveryPhase = action.payload;
    },
    markOrderDeliveredLocal: (state, action: { payload: string }) => {
      state.deliveredOrderIds = [...state.deliveredOrderIds, action.payload];
      state.claimedOrderIds = state.claimedOrderIds.filter(id => id !== action.payload);
    },
    resetDeliverySession: (state) => {
      state.deliveryPhase = 'idle';
      state.claimedOrderIds = [];
      state.currentBatchId = null;
      state.deliveredOrderIds = [];
    },
    // Load sample data for development
    loadSampleBatches: (state) => {
      state.batches = SAMPLE_BATCHES;
      state.isFetchingBatches = false;
    },
    loadSampleBatchDetail: (state, action: { payload: string }) => {
      if (action.payload === SAMPLE_BATCH_DETAIL.id) {
        state.batchDetail = SAMPLE_BATCH_DETAIL;
      }
      state.isLoadingBatchDetail = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiderOrderDetail.pending, (state) => {
        state.isLoadingOrderDetail = true;
        state.orderDetailError = null;
        state.orderDetail = null;
      })
      .addCase(fetchRiderOrderDetail.fulfilled, (state, action) => {
        state.isLoadingOrderDetail = false;
        state.orderDetail = action.payload;
      })
      .addCase(fetchRiderOrderDetail.rejected, (state, action) => {
        state.isLoadingOrderDetail = false;
        state.orderDetailError = action.payload || 'Failed to fetch order';
      })
      .addCase(fetchRiderOrders.pending, (state) => {
        state.isFetchingOrders = true;
        state.ordersError = null;
      })
      .addCase(fetchRiderOrders.fulfilled, (state, action) => {
        state.isFetchingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchRiderOrders.rejected, (state, action) => {
        state.isFetchingOrders = false;
        state.ordersError = action.payload || 'Failed to fetch orders';
      })
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
      .addCase(markOrderDelivered.pending, (state) => {
        state.isMarkingDelivered = true;
      })
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        state.isMarkingDelivered = false;
        if (state.orderDetail?.id === action.payload) {
          state.orderDetail.status = 'DELIVERED';
        }
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })
      .addCase(markOrderDelivered.rejected, (state) => {
        state.isMarkingDelivered = false;
      })
      .addCase(verifyPickupSignature.pending, (state) => {
        state.isVerifying = true;
        state.verifyError = null;
      })
      .addCase(verifyPickupSignature.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.verificationResult = action.payload;
      })
      .addCase(verifyPickupSignature.rejected, (state, action) => {
        state.isVerifying = false;
        state.verifyError = action.payload || 'Verification failed';
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

export const {
  clearUploadError,
  claimOrders,
  unclaimOrder,
  setCurrentBatch,
  setDeliveryPhase,
  markOrderDeliveredLocal,
  resetDeliverySession,
  loadSampleBatches,
  loadSampleBatchDetail,
} = riderSlice.actions;
export default riderSlice.reducer;
