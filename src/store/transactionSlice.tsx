import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllExpenseApi, searchExpenseApi } from '../service/transaction'; // Import async actions

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  // Add other fields as needed
}

interface TransactionState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  expenses: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder
    //   .addCase(getAllExpenseApi.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getAllExpenseApi.fulfilled, (state, action: PayloadAction<Expense[]>) => {
    //     state.loading = false;
    //     state.expenses = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(getAllExpenseApi.rejected, (state, action: PayloadAction<string | undefined>) => {
    //     state.loading = false;
    //     state.error = action.payload ?? 'Failed to fetch expenses';
    //   })
    //   .addCase(searchExpenseApi.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(searchExpenseApi.fulfilled, (state, action: PayloadAction<Expense[]>) => {
    //     state.loading = false;
    //     state.expenses = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(searchExpenseApi.rejected, (state, action: PayloadAction<string | undefined>) => {
    //     state.loading = false;
    //     state.error = action.payload ?? 'Search failed';
    //   });
  },
});

export default transactionSlice.reducer;
