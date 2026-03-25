import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

export type ListingCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'INACTIVE';

export interface Listing {
  id: string;
  title: string;
  description: string;
  condition: ListingCondition;
  askingPrice: number;
  isNegotiable: boolean;
  images: string[];
  status: ListingStatus;
  viewCount: number;
  expiresAt: string;
  createdAt: string;
}

// Draft state shared across the 3-step sell flow
export interface PendingListing {
  title: string;
  description: string;
  categoryId?: string;
  categoryName?: string;
  condition: ListingCondition;
  askingPrice: number;
  isNegotiable: boolean;
  imageUris: string[]; // local URIs — sent as multipart files
}

interface MarketplaceState {
  listings: Listing[];
  isCreating: boolean;
  error: string | null;
  lastCreatedListing: Listing | null;
  pendingListing: Partial<PendingListing>;
}

const initialState: MarketplaceState = {
  listings: [],
  isCreating: false,
  error: null,
  lastCreatedListing: null,
  pendingListing: {},
};

export const createListing = createAsyncThunk<
  Listing,
  PendingListing,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'marketplace/createListing',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const formData = new FormData();
      formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.categoryId) formData.append('categoryId', payload.categoryId);
      formData.append('condition', payload.condition);
      formData.append('askingPrice', String(payload.askingPrice));
      formData.append('isNegotiable', String(payload.isNegotiable));

      payload.imageUris.forEach((uri, index) => {
        const filename = uri.split('/').pop() ?? `image_${index}.jpg`;
        const ext = /\.(\w+)$/.exec(filename)?.[1] ?? 'jpg';
        formData.append('images', { uri, name: filename, type: `image/${ext}` } as any);
      });

      // Do NOT set Content-Type — fetch sets it automatically with the correct boundary
      const response = await fetch(`${API_BASE_URL}/marketplace`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to create listing');
      return data.data as Listing;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    updatePendingListing: (state, action: PayloadAction<Partial<PendingListing>>) => {
      state.pendingListing = { ...state.pendingListing, ...action.payload };
    },
    clearPendingListing: (state) => {
      state.pendingListing = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createListing.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isCreating = false;
        state.lastCreatedListing = action.payload;
        state.listings.unshift(action.payload);
        state.pendingListing = {};
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload ?? 'Failed to create listing';
      });
  },
});

export const { updatePendingListing, clearPendingListing, clearError } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
