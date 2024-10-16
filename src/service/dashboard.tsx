import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './apiHeader';

export const dashboardApi = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('dashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/dashboard');
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue('Dashboard failed');
  }
});
