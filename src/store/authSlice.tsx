import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse, User } from '../libs/types';
import { loginApi, logoutApi, registerApi } from '../service/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
     .addCase(loginApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginApi.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.error = null;
      })
      .addCase(loginApi.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
        state.isAuthenticated = false;
      })
      .addCase(registerApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerApi.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.error = null;
      })
      .addCase(registerApi.rejected, (state, action: PayloadAction<object | undefined>) => {
        state.loading = false;
        state.error = JSON.stringify(action.payload) || 'Registration failed';
        state.isAuthenticated = false;
      })
      .addCase(logoutApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutApi.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutApi.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? 'Logout failed';
      });

  },
});

export default authSlice.reducer;
