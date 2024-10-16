import { createAsyncThunk } from '@reduxjs/toolkit';
import { authapi, removeTokens, setTokens } from '../service/apiHeader';
import { LoginResponse } from '../libs/types';

interface LoginErrorResponse {
  response?: {
    data: {
      status: number;
      message: string;
    };
  };
}
interface RegisterErrorResponse {
  response?: {
    data: {
      data: {
        [key: string]: string[];
      };
    };
  };
}
export const loginApi = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await authapi.post<LoginResponse>('/login', {
      email,
      password,
    });
    const { data } = response.data;
    setTokens(data.access_token, data.refresh_token);
    return response.data;
  } catch (error) {
    if ((error as LoginErrorResponse)?.response?.data.message) {
      return rejectWithValue(
        (error as LoginErrorResponse).response!.data.message
      );
    } else {
      return rejectWithValue('Login failed');
    }
  }
});

export const registerApi = createAsyncThunk<
  LoginResponse,
  { email: string; password: string; first_name: string; last_name: string },
  { rejectValue: Record<string, string[]> }
>(
  'auth/register',
  async ({ email, password, first_name, last_name }, { rejectWithValue }) => {
    try {
      const response = await authapi.post<LoginResponse>('/register', {
        email,
        password,
        first_name,
        last_name,
      });
      const { data } = response.data;
      setTokens(data.access_token, data.refresh_token);
      return response.data;
    } catch (error) {
      if ((error as RegisterErrorResponse)?.response?.data?.data) {
        return rejectWithValue(
          (error as RegisterErrorResponse).response!.data!.data
        );
      } else {
        return rejectWithValue({});
      }
    }
  }
);

export const logoutApi = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await authapi.post<{ status: number; message: string }>(
      '/logout'
    );
    removeTokens();
    return response.data.message;
  } catch (error) {
    return rejectWithValue('Logout failed');
  }
});
