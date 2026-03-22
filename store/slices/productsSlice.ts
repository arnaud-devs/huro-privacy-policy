import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

export interface ProductSeller {
  id: string;
  sellerName: string;
  sellerPhone: string | null;
  pickupLocationName: string;
  pickupLocationUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  imageUrls: string[];
  description: string;
  stockQuantity: number;
  categoryId: string;
  totalOrders: number;
  createdAt: string;
  seller: ProductSeller;
  hasPickupLocation: boolean;
  promotionPrice?: number;
  originalPrice?: number;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  sellerId?: string;
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  message: string;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  FetchProductsParams | undefined,
  { rejectValue: string }
>(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page !== undefined) query.append('page', String(params.page));
      if (params.limit !== undefined) query.append('limit', String(params.limit));
      if (params.categoryId) query.append('categoryId', params.categoryId);
      if (params.sellerId) query.append('sellerId', params.sellerId);
      if (params.search) query.append('search', params.search);
      if (params.inStock !== undefined) query.append('inStock', String(params.inStock));
      if (params.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
      if (params.sortBy) query.append('sortBy', params.sortBy);

      const url = `${API_BASE_URL}/products${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch products');
      }

      // Normalize: handle flat array or paginated object shapes
      const raw = data.data;
      const products: Product[] = Array.isArray(raw)
        ? raw
        : raw?.items ?? raw?.products ?? raw?.data ?? [];

      return { success: data.success, data: products, message: data.message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
