import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'IN_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product?: { name: string; imageUrls?: string[] };
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  paymentStatus: string;
  payableAmount: number;
  subtotal: number;
  deliveryFee: number;
  snapshotName: string;
  snapshotPhone: string;
  snapshotZoneName: string;
  snapshotZoneType: string;
  customAddress?: string;
  pickupSignature: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface Order {
  id: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
  batch?: { id: string; slotLabel: string; scheduledAt: string };
  deliveryZone?: { id: string; name: string };
  gate?: { id: string; name: string };
  momoName?: string;
  momoPhone?: string;
}

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
  isFetching: boolean;
  isLoadingDetail: boolean;
  isCancelling: boolean;
  orders: Order[];
  orderDetail: OrderDetail | null;
  error: string | null;
  detailError: string | null;
  cancelError: string | null;
  lastOrderId: string | null;
  pendingOrder: PlaceOrderPayload | null;
}

const initialState: OrdersState = {
  isPlacing: false,
  isFetching: false,
  isLoadingDetail: false,
  isCancelling: false,
  orders: [],
  orderDetail: null,
  error: null,
  detailError: null,
  cancelError: null,
  lastOrderId: null,
  pendingOrder: null,
};

export const fetchOrderById = createAsyncThunk<
  OrderDetail,
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'orders/fetchById',
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
      console.log('[fetchOrderById] status:', response.status, 'body:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch order');
      const raw = data.data?.order ?? data.data;
      return {
        ...raw,
        items: raw.orderItems ?? raw.items ?? [],
        subtotal: Number(raw.subtotal ?? 0),
        deliveryFee: Number(raw.deliveryFee ?? 0),
        payableAmount: Number(raw.payableAmount ?? 0),
      } as OrderDetail;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchOrders = createAsyncThunk<
  Order[],
  { status?: OrderStatus; page?: number; limit?: number } | void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'orders/fetchAll',
  async (params, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
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
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch orders');

      const raw = data.data;
      const orders: Order[] = Array.isArray(raw)
        ? raw
        : raw?.data ?? raw?.items ?? [];

      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

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

export const cancelOrder = createAsyncThunk<
  { id: string; status: OrderStatus; cancelledAt: string },
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'orders/cancel',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message || data.message || 'Failed to cancel order');
      return data.data;
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
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoadingDetail = true;
        state.detailError = null;
        state.orderDetail = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.orderDetail = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.detailError = action.payload || 'Failed to fetch order';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload || 'Failed to fetch orders';
      })
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
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isCancelling = true;
        state.cancelError = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isCancelling = false;
        if (state.orderDetail) {
          state.orderDetail.status = action.payload.status;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isCancelling = false;
        state.cancelError = action.payload || 'Failed to cancel order';
      });
  },
});

export const { clearOrderError, setPendingOrder, clearPendingOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
