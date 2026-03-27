import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

export type ListingCondition = 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'FOR_PARTS';
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
  category?: { name: string };
  seller?: {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    createdAt?: string;
  };
}

export interface UpdateListingPayload {
  listingId: string;
  title?: string;
  description?: string;
  categoryId?: string;
  condition?: ListingCondition;
  askingPrice?: number;
  isNegotiable?: boolean;
  imageUris?: string[];
}

export interface FetchListingsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  condition?: ListingCondition;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
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
  isFetching: boolean;
  fetchError: string | null;
  totalListings: number;
  myListings: Listing[];
  isFetchingMyListings: boolean;
  myListingsError: string | null;
  isUpdating: boolean;
  updateError: string | null;
  selectedListing: Listing | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  isCreating: boolean;
  error: string | null;
  lastCreatedListing: Listing | null;
  pendingListing: Partial<PendingListing>;
}

const initialState: MarketplaceState = {
  listings: [],
  isFetching: false,
  fetchError: null,
  totalListings: 0,
  myListings: [],
  isFetchingMyListings: false,
  myListingsError: null,
  isUpdating: false,
  updateError: null,
  selectedListing: null,
  isFetchingDetail: false,
  detailError: null,
  isCreating: false,
  error: null,
  lastCreatedListing: null,
  pendingListing: {},
};

export const fetchListings = createAsyncThunk<
  { listings: Listing[]; total: number },
  FetchListingsParams | undefined,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'marketplace/fetchListings',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      const query = new URLSearchParams();
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      if (params.categoryId) query.append('categoryId', params.categoryId);
      if (params.condition) query.append('condition', params.condition);
      if (params.minPrice != null) query.append('minPrice', String(params.minPrice));
      if (params.maxPrice != null) query.append('maxPrice', String(params.maxPrice));
      if (params.search) query.append('search', params.search);

      const headers: Record<string, string> = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch(`${API_BASE_URL}/marketplace?${query.toString()}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch listings');
      }

      const raw = data.data;
      const listingsArr: Listing[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      const total: number = raw?.meta?.total ?? listingsArr.length;

      return { listings: listingsArr, total };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateListing = createAsyncThunk<
  Listing,
  UpdateListingPayload,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'marketplace/updateListing',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const formData = new FormData();
      if (payload.title) formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.categoryId) formData.append('categoryId', payload.categoryId);
      if (payload.condition) formData.append('condition', payload.condition);
      if (payload.askingPrice != null) formData.append('askingPrice', String(payload.askingPrice));
      if (payload.isNegotiable != null) formData.append('isNegotiable', String(payload.isNegotiable));

      payload.imageUris?.forEach((uri, index) => {
        const filename = uri.split('/').pop() ?? `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';
        formData.append('images', { uri, name: filename, type } as any);
      });

      const response = await fetch(`${API_BASE_URL}/marketplace/${payload.listingId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to update listing');
      return (data.data?.listing ?? data.data) as Listing;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchMyListings = createAsyncThunk<
  { items: Listing[]; total: number },
  { page?: number; limit?: number } | undefined,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'marketplace/fetchMyListings',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const query = new URLSearchParams();
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));

      const response = await fetch(`${API_BASE_URL}/marketplace/my?${query.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();

      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch your listings');

      const raw = data.data;
      const items: Listing[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.items) ? raw.items : [];
      return { items, total: raw?.meta?.total ?? items.length };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchListingById = createAsyncThunk<
  Listing,
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'marketplace/fetchListingById',
  async (listingId, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      const headers: Record<string, string> = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch(`${API_BASE_URL}/marketplace/${listingId}`, { headers });
      const data = await response.json();

      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch listing');
      return (data.data?.listing ?? data.data ?? data.listing) as Listing;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

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
      // NOTE: The backend API endpoint currently validates strict types (number/boolean) but receives strings via FormData.
      // This causes validation errors like "Expected number, received string".
      // This is a backend configuration issue (needs implicit type coercion enabling).
      // Since we cannot change multipart/form-data behavior to send native numbers, we are sending strings.
      formData.append('askingPrice', String(payload.askingPrice));
      formData.append('isNegotiable', String(payload.isNegotiable));

      payload.imageUris.forEach((uri, index) => {
        const filename = uri.split('/').pop() ?? `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';
        
        formData.append('images', {
          uri,
          name: filename,
          type,
        } as any);
      });

      // Do NOT set Content-Type — fetch sets it automatically with the correct boundary
      const response = await fetch(`${API_BASE_URL}/marketplace`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      console.log("createListing response status:", response.status);
      console.log("createListing response data:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        return rejectWithValue(
          (data.message && typeof data.message === 'string' ? data.message : '') + 
          (data.error ? ' ' + JSON.stringify(data.error) : '') || 
          'Failed to create listing'
        );
      }
      return (data.data?.listing ?? data.data) as Listing;
    } catch (error: any) {
      console.error("createListing thunk error:", error);
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
      .addCase(fetchListings.pending, (state) => {
        state.isFetching = true;
        state.fetchError = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listings = action.payload.listings ?? [];
        state.totalListings = action.payload.total;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isFetching = false;
        state.fetchError = action.payload ?? 'Failed to fetch listings';
      })
      .addCase(updateListing.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.myListings = state.myListings.map((l) =>
          l.id === action.payload.id ? action.payload : l
        );
        if (state.selectedListing?.id === action.payload.id) {
          state.selectedListing = action.payload;
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? 'Failed to update listing';
      })
      .addCase(fetchMyListings.pending, (state) => {
        state.isFetchingMyListings = true;
        state.myListingsError = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.isFetchingMyListings = false;
        state.myListings = action.payload.items ?? [];
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.isFetchingMyListings = false;
        state.myListingsError = action.payload ?? 'Failed to fetch your listings';
      })
      .addCase(fetchListingById.pending, (state) => {
        state.isFetchingDetail = true;
        state.detailError = null;
        state.selectedListing = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.isFetchingDetail = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.detailError = action.payload ?? 'Failed to fetch listing';
      })
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
