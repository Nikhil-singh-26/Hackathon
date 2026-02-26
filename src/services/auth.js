import axios from 'axios';

// ============================================================
// API Configuration
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Required for HttpOnly cookie approach
});

// ============================================================
// In-memory token storage (never localStorage for security)
// ============================================================
let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => { accessToken = token; };
export const clearAccessToken = () => { accessToken = null; };

// ============================================================
// Request Interceptor — attach JWT to every outgoing request
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// Response Interceptor — handle 401 and attempt silent refresh
// ============================================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept 401 errors from login or signup endpoints
    if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/signup')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ============================================================
// Mock helpers (remove when backend is ready)
// ============================================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const MOCK_USER = {
  id: '1',
  name: 'Nikhil Singh',
  email: 'nikhil@eventflex.com',
  avatar: null,
};

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-jwt-token';

// ============================================================
// Auth API Methods
// ============================================================

/**
 * Login with email and password
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  setAccessToken(data.token);
  return data;
};

/**
 * Register a new account
 */
export const signupUser = async (userData) => {
  const { data } = await api.post('/auth/signup', userData);
  setAccessToken(data.token);
  return data;
};

/**
 * Request password reset email
 */
export const forgotPassword = async (email) => {
  await delay(1500);
  return { message: 'Password reset link sent to your email' };
  // --- REAL ---
  // const { data } = await api.post('/auth/forgot-password', { email });
  // return data;
};

/**
 * Reset password using token
 */
export const resetPassword = async (token, newPassword) => {
  await delay(1500);
  return { message: 'Password has been reset successfully' };
  // --- REAL ---
  // const { data } = await api.post('/auth/reset-password', { token, password: newPassword });
  // return data;
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    clearAccessToken();
  }
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async () => {
  const token = getAccessToken();
  if (!token) return null;
  const { data } = await api.get('/auth/me');
  return data.user;
};

export default api;
