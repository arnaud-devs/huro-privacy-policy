import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '@/store/config';

export interface ConversationParticipant {
  id: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface ConversationListing {
  id: string;
  title?: string;
  images?: string[];
}

export interface LastMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId?: string;
}

export interface ApiConversation {
  id: string;
  otherParticipant?: ConversationParticipant;
  listing?: ConversationListing;
  lastMessage?: LastMessage;
  unreadCount?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface ApiMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead?: boolean;
  sender?: { id: string; fullName?: string; avatarUrl?: string };
}

interface MessagingState {
  conversations: ApiConversation[];
  isFetching: boolean;
  fetchError: string | null;
  total: number;
  isStarting: boolean;
  startError: string | null;
  activeConversationId: string | null;
  messages: ApiMessage[];
  isFetchingMessages: boolean;
  messagesError: string | null;
  nextCursor: string | null;
}

const initialState: MessagingState = {
  conversations: [],
  isFetching: false,
  fetchError: null,
  total: 0,
  isStarting: false,
  startError: null,
  activeConversationId: null,
  messages: [],
  isFetchingMessages: false,
  messagesError: null,
  nextCursor: null,
};

export const fetchConversations = createAsyncThunk<
  { conversations: ApiConversation[]; total: number },
  { page?: number; limit?: number } | undefined,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'messaging/fetchConversations',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));

      const response = await fetch(`${API_BASE_URL}/messaging/conversations?${query.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();

      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch conversations');

      const raw = data.data;
      const conversations: ApiConversation[] = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.conversations)
        ? raw.conversations
        : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw)
        ? raw
        : [];
      const total: number = raw?.meta?.total ?? conversations.length;

      return { conversations, total };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchMessages = createAsyncThunk<
  { messages: ApiMessage[]; nextCursor: string | null },
  { conversationId: string; cursor?: string; limit?: number },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'messaging/fetchMessages',
  async ({ conversationId, cursor, limit }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
      if (cursor) query.append('cursor', cursor);
      if (limit) query.append('limit', String(limit));

      const response = await fetch(
        `${API_BASE_URL}/messaging/conversations/${conversationId}?${query.toString()}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message ?? data.message ?? 'Failed to fetch messages');

      const raw = data.data;
      const messages: ApiMessage[] = Array.isArray(raw?.messages)
        ? raw.messages
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];
      const nextCursor: string | null = raw?.nextCursor ?? raw?.cursor ?? null;

      return { messages, nextCursor };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const startConversation = createAsyncThunk<
  ApiConversation,
  { listingId: string; message: string },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'messaging/startConversation',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/messaging/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId: payload.listingId, message: payload.message }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message ?? data.message ?? 'Failed to start conversation');
      return (data.data?.conversation ?? data.data) as ApiConversation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    clearStartError: (state) => { state.startError = null; },
    clearMessages: (state) => {
      state.messages = [];
      state.nextCursor = null;
      state.messagesError = null;
    },
    appendMessage: (state, action: PayloadAction<ApiMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isFetching = true;
        state.fetchError = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isFetching = false;
        state.conversations = action.payload.conversations;
        state.total = action.payload.total;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isFetching = false;
        state.fetchError = action.payload ?? 'Failed to fetch conversations';
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isFetchingMessages = true;
        state.messagesError = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isFetchingMessages = false;
        state.messages = action.payload.messages;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isFetchingMessages = false;
        state.messagesError = action.payload ?? 'Failed to fetch messages';
      })
      .addCase(startConversation.pending, (state) => {
        state.isStarting = true;
        state.startError = null;
        state.activeConversationId = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isStarting = false;
        state.activeConversationId = action.payload.id;
        const exists = state.conversations.some((c) => c.id === action.payload.id);
        if (!exists) state.conversations.unshift(action.payload);
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isStarting = false;
        state.startError = action.payload ?? 'Failed to start conversation';
      });
  },
});

export const { clearStartError, clearMessages, appendMessage } = messagingSlice.actions;
export default messagingSlice.reducer;
