import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the types based on the API documented in the screenshot
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  profileComplete: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  data: string;
  message: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    tokens: Tokens;
  };
  message: string;
}

interface UserState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

// Create an async thunk for registration.
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: string }
>(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      return data as RegisterResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Create an async thunk for login
export const loginUser = createAsyncThunk<
  RegisterResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      return data as RegisterResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Create an async thunk for logout
export const logoutUser = createAsyncThunk<
  LogoutResponse,
  LogoutRequest,
  { rejectValue: string }
>(
  'user/logout',
  async (logoutData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Logout failed');
      }

      return data as LogoutResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Create an async thunk to fetch the logged-in user's profile
export const fetchUserProfile = createAsyncThunk<
  UserProfileResponse,
  void,
  { state: { user: UserState }, rejectValue: string }
>(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.user.tokens?.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(`${API_BASE_URL.replace('/v1', '')}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch user profile');
      }

      return data as UserProfileResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle registerUser async thunk
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.tokens = action.payload.data.tokens;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to register';
      })
      // Handle loginUser async thunk
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.tokens = action.payload.data.tokens;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to login';
      })
      // Handle logoutUser async thunk
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to logout';
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })
      // Handle fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user profile';
      });
  },
});

export const { setUser, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
