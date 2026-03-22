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
  isClearing: boolean;
  isAdding: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
  isClearing: false,
  isAdding: false,
  error: null,
};

export const removeCartItem = createAsyncThunk<
  { success: boolean; data: string; message: string },
  string,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'cart/removeItem',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to remove item');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const updateCartItem = createAsyncThunk<
  { success: boolean; data: {}; message: string },
  { productId: string; quantity: number },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'cart/updateItem',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to update item');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const addToCart = createAsyncThunk<
  { success: boolean; data: {}; message: string },
  { productId: string; quantity: number },
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'cart/addItem',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to add item');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const clearCart = createAsyncThunk<
  { success: boolean; message: string },
  void,
  { state: { user: { tokens: { accessToken: string } | null } }; rejectValue: string }
>(
  'cart/clear',
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to clear cart');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

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
      state.subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
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
        const rawItems: any[] = action.payload.data.items ?? [];
        state.items = rawItems.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice ?? item.price ?? 0),
          lineTotal: Number(item.lineTotal ?? 0),
          quantity: Number(item.quantity ?? 0),
          product: {
            name: item.product?.name ?? item.name ?? "Product",
            imageUrls: item.product?.imageUrls ?? (item.imageUrl ? [item.imageUrl] : []),
          },
        }));
        state.subtotal = Number(action.payload.data.subtotal ?? 0);
        state.itemCount = Number(action.payload.data.itemCount ?? 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      .addCase(removeCartItem.pending, (state, action) => {
        const productId = action.meta.arg;
        state.items = state.items.filter((i) => i.productId !== productId);
        state.subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove item';
      })
      .addCase(updateCartItem.fulfilled, () => {
        // quantity already updated optimistically via adjustQuantity
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update item';
      })
      .addCase(addToCart.pending, (state, action) => {
        state.isAdding = true;
        state.error = null;
        state.itemCount += action.meta.arg.quantity;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isAdding = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload || 'Failed to add item';
        state.itemCount -= action.meta.arg.quantity;
      })
      .addCase(clearCart.pending, (state) => {
        state.isClearing = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isClearing = false;
        state.items = [];
        state.subtotal = 0;
        state.itemCount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isClearing = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

export const { adjustQuantity } = cartSlice.actions;
export default cartSlice.reducer;
