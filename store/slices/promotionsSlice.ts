import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/store/config';

export type PromotionType = 'DISCOUNT' | 'BOGO' | 'BUNDLE' | 'FREE_ITEM';
export type PromotionScope = 'CART_WIDE' | 'CATEGORY' | 'PRODUCT';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface PromotionProduct {
  productId: string;
  requiredQuantity: number;
  isFreeItem: boolean;
  product: {
    id: string;
    name: string;
    imageUrls: string[];
  };
}

export interface PromotionCategoryGate {
  categoryId: string;
  requiredQuantity: number;
  category: { id: string; name: string };
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  type: PromotionType;
  scope: PromotionScope;
  discountType: DiscountType;
  discountValue: number;
  minCartValue: number;
  minQuantity: number;
  freeQuantity: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  category?: { id: string; name: string };
  categoryGates: PromotionCategoryGate[];
  products: PromotionProduct[];
  createdAt: string;
  updatedAt: string;
}

interface PromotionsState {
  activePromotions: Promotion[];
  isFetching: boolean;
  error: string | null;
}

const initialState: PromotionsState = {
  activePromotions: [],
  isFetching: false,
  error: null,
};

export const fetchActivePromotions = createAsyncThunk<
  Promotion[],
  void,
  { rejectValue: string }
>(
  'promotions/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      // Public endpoint — no auth required
      const response = await fetch(`${API_BASE_URL}/promotions/active`);
      const data = await response.json();
      console.log('[promotions] status:', response.status);
      console.log('[promotions] response:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch promotions');
      return (data.data ?? []) as Promotion[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePromotions.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.isFetching = false;
        state.activePromotions = action.payload;
      })
      .addCase(fetchActivePromotions.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload ?? 'Failed to fetch promotions';
      });
  },
});

export default promotionsSlice.reducer;
