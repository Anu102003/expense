import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './apiHeader';

interface GetAllExpensesParams {
  page?: number;
}

interface SearchExpensesParams {
  search?: string;
  page?: number;
}
export const getAllExpenseApi = createAsyncThunk<
  any,
  GetAllExpensesParams,
  { rejectValue: string }
>('transaction/getAllExpenses', async ({ page }, { rejectWithValue }) => {
  try {
    const response = await api.get('/transaction/getAllExpenses', {
      params: { page },
    });
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue('Get all Expense failed');
  }
});

export const searchExpenseApi = createAsyncThunk<
  any,
  SearchExpensesParams,
  { rejectValue: string }
>('transaction/search', async ({ search, page }, { rejectWithValue }) => {
  try {
    const response = await api.get('/transaction/search', {
      params: { search, page },
    });
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue('Search failed');
  }
});

export const getCategory = createAsyncThunk<any, void, { rejectValue: string }>(
  'transaction/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transaction/getCategories');
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue('Category Fetching failed');
    }
  }
);

export const getPaymentMode = createAsyncThunk<any, void, { rejectValue: string }>(
  'transaction/getPaymentModes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transaction/getPaymentModes');
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue('Payment Mode Fetching failed');
    }
  }
);

