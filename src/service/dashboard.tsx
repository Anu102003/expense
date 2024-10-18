import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './apiHeader';
interface DashboardPayload {
  startDate: string;
  endDate: string;
}
export const dashboardApi = createAsyncThunk<
  string,
  DashboardPayload,
  { rejectValue: string }
>('dashboard', async ({ startDate, endDate }, { rejectWithValue }) => {
  try {
    console.log(startDate, endDate);
    const response = await api.get('/dashboard/index', {
      params: { date_from: startDate, date_to: endDate },
    });
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue('Dashboard failed');
  }
});
