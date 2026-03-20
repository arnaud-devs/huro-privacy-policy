import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

export interface CartItemProduct {
  name: string;
  imageUrls: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: CartItemProduct;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

interface CartResponse {
  success: boolean;
  data: CartData;
  message: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<
  CartResponse,
  void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'cart/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) {
        return rejectWithValue('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch cart');
      }

      return data as CartResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    adjustQuantity: (
      state,
      action: PayloadAction<{ productId: string; delta: number }>
    ) => {
      const { productId, delta } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        item.quantity = newQty;
        item.lineTotal = item.unitPrice * newQty;
      }
      state.subtotal = state.items.reduce((sum, i) => sum + i.lineTotal, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.items;
        state.subtotal = action.payload.data.subtotal;
        state.itemCount = action.payload.data.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
      });
  },
});

export const { adjustQuantity } = cartSlice.actions;
export default cartSlice.reducer;
