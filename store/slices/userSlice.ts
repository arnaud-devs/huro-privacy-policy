import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Register returns only userId — tokens come after OTP verification
export interface RegisterResponse {
  success: boolean;
  data: { userId: string };
  message: string;
}

// Login and verifyEmail both return user + tokens
export interface AuthResponse {
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
  isVerifyingEmail: boolean;
  isResendingOtp: boolean;
  pendingUserId: string | null;
  error: string | null;
  verifyEmailError: string | null;
}

const initialState: UserState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isVerifyingEmail: false,
  isResendingOtp: false,
  pendingUserId: null,
  error: null,
  verifyEmailError: null,
};

const API_BASE_URL = 'https://huzago-backend.onrender.com/api/v1';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Registration failed');
      return data as RegisterResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const verifyEmail = createAsyncThunk<
  AuthResponse,
  { userId: string; otp: string },
  { rejectValue: string }
>(
  'user/verifyEmail',
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Verification failed');
      return data as AuthResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const resendOtp = createAsyncThunk<
  { message: string },
  { userId: string },
  { rejectValue: string }
>(
  'user/resendOtp',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to resend OTP');
      return { message: data.message ?? 'OTP sent' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Login failed');
      return data as AuthResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logoutData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Logout failed');
      return data as LogoutResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const updateProfile = createAsyncThunk<
  UserProfileResponse,
  { fullName: string; phone?: string; avatarUri?: string },
  { state: { user: UserState }; rejectValue: string }
>(
  'user/updateProfile',
  async ({ fullName, phone, avatarUri }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const form = new FormData();
      form.append('fullName', fullName);
      if (phone) form.append('phone', phone);

      if (avatarUri) {
        const filename = avatarUri.split('/').pop() ?? 'avatar.jpg';
        const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        form.append('avatar', { uri: avatarUri, name: filename, type: mime } as any);
      }

      console.log('[updateProfile] fullName:', fullName, 'avatar:', avatarUri ?? 'none');

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      const data = await response.json();
      console.log('[updateProfile] status:', response.status, 'body:', JSON.stringify(data, null, 2));
      if (!response.ok) return rejectWithValue(data.error?.message || data.message || 'Failed to update profile');
      return data as UserProfileResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const updatePhone = createAsyncThunk<
  { success: boolean; message: string },
  { phone: string },
  { state: { user: UserState }; rejectValue: string }
>(
  'user/updatePhone',
  async ({ phone }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/users/me/phone`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error?.message || data.message || 'Failed to update phone');

      // Update the local user state with the new phone
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchUserProfile = createAsyncThunk<
  UserProfileResponse,
  void,
  { state: { user: UserState }, rejectValue: string }
>(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().user.tokens?.accessToken;
      if (!accessToken) return rejectWithValue('No access token found');

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch user profile');
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
      state.verifyEmailError = null;
    },
    setPendingUserId: (state, action: PayloadAction<string>) => {
      state.pendingUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUser — only stores pendingUserId, no login yet
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingUserId = action.payload.data?.userId ?? null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to register';
      })

      // verifyEmail — logs user in on success
      .addCase(verifyEmail.pending, (state) => {
        state.isVerifyingEmail = true;
        state.verifyEmailError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isVerifyingEmail = false;
        state.user = action.payload.data.user;
        state.tokens = action.payload.data.tokens;
        state.isAuthenticated = true;
        state.pendingUserId = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isVerifyingEmail = false;
        state.verifyEmailError = action.payload || 'Verification failed';
      })

      // resendOtp
      .addCase(resendOtp.pending, (state) => {
        state.isResendingOtp = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isResendingOtp = false;
      })
      .addCase(resendOtp.rejected, (state) => {
        state.isResendingOtp = false;
      })

      // loginUser
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

      // logoutUser
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

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const raw = action.payload as any;
        state.user = raw.data?.user ?? raw.data ?? state.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      })

      // updatePhone
      .addCase(updatePhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePhone.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update phone in local user state if present in response
        const raw = action.payload as any;
        const newPhone = raw.data?.user?.phone ?? raw.data?.phone;
        if (newPhone && state.user) {
          state.user = { ...state.user, phone: newPhone };
        }
      })
      .addCase(updatePhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update phone';
      })

      // fetchUserProfile
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

export const { setUser, logout, clearError, setPendingUserId } = userSlice.actions;
export default userSlice.reducer;
