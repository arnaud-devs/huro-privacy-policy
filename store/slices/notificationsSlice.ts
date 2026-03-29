import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '@/store/config';

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  live?: boolean; // true only for socket-received notifications
}

interface NotificationsState {
  items: AppNotification[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
  isFetching: boolean;
  fetchError: string | null;
  isMarkingRead: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  totalPages: 1,
  isFetching: false,
  fetchError: null,
  isMarkingRead: false,
};

// ─── Thunks ────────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk<
  { items: AppNotification[]; unreadCount: number; total: number; totalPages: number; page: number },
  { page?: number; limit?: number; isRead?: boolean } | undefined,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'notifications/fetchNotifications',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
      if (params.page != null) query.set('page', String(params.page));
      if (params.limit != null) query.set('limit', String(params.limit));
      if (params.isRead != null) query.set('isRead', String(params.isRead));

      const response = await fetch(`${API_BASE_URL}/notifications?${query.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message ?? data.message ?? 'Failed to fetch notifications');

      const { data: items, meta, unreadCount } = data.data;
      return { items, unreadCount, total: meta.total, totalPages: meta.totalPages, page: meta.page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const markNotificationRead = createAsyncThunk<
  string,
  { notificationId: string },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'notifications/markRead',
  async ({ notificationId }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message ?? data.message ?? 'Failed to mark as read');
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk<
  void,
  void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'notifications/markAllRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message ?? data.message ?? 'Failed to mark all as read');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    prependNotification(state, action: PayloadAction<AppNotification>) {
      if (!Array.isArray(state.items)) state.items = [];
      state.items.unshift({ ...action.payload, live: true });
      state.unreadCount += 1;
      state.total += 1;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isFetching = true;
        state.fetchError = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isFetching = false;
        const { items, unreadCount, total, totalPages, page } = action.payload;
        const safeItems = Array.isArray(items) ? items : [];
        if (page === 1) {
          state.items = safeItems;
        } else {
          state.items = [...state.items, ...safeItems];
        }
        state.unreadCount = unreadCount;
        state.total = total;
        state.totalPages = totalPages;
        state.page = page;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isFetching = false;
        state.fetchError = action.payload ?? 'Unknown error';
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.isMarkingRead = true;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.isMarkingRead = false;
        const idx = state.items.findIndex((n) => n.id === action.payload);
        if (idx !== -1 && !state.items[idx].isRead) {
          state.items[idx].isRead = true;
          state.items[idx].readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationRead.rejected, (state) => {
        state.isMarkingRead = false;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.isRead = true;
          n.readAt = n.readAt ?? new Date().toISOString();
        });
        state.unreadCount = 0;
      });
  },
});

export const { prependNotification, setUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
