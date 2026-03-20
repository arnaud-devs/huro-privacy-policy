import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl: string;
  sortOrder: number;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message: string;
}

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  CategoriesResponse,
  void,
  { rejectValue: string }
>(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch categories');
      }

      return data as CategoriesResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

export default categoriesSlice.reducer;
