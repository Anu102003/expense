import Cookies from 'js-cookie';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL
const BASE_URL = 'http://localhost:8000/api';

export const authapi = axios.create({
  baseURL: BASE_URL,
});
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Function to set tokens in cookies
export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('accessToken', accessToken, {
    secure: true,
    sameSite: 'Strict',
  });
  Cookies.set('refreshToken', refreshToken, {
    secure: true,
    sameSite: 'Strict',
    // httpOnly: true,
  });
};

export const getAccessToken = () => Cookies.get('accessToken');

export const removeTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

// Function to refresh the access token using a refresh token
export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );
    const { access_token, refresh_token } = response.data.data;
    setTokens(access_token, refresh_token);
    return access_token;
  } catch (error) {
    removeTokens();
    throw error;
  }
};

// Request interceptor to add tokens to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)[
        'Authorization'
      ] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        removeTokens();
        return Promise.reject(refreshError);
      }
    }
    return (error: AxiosError) => Promise.reject(error);
  }
);
