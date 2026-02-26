import axios from 'axios';




const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});




let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => { accessToken = token; };
export const clearAccessToken = () => { accessToken = null; };




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




const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const MOCK_USER = {
  id: '1',
  name: 'Nikhil Singh',
  email: 'nikhil@eventflex.com',
  avatar: null,
};

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-jwt-token';






export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  setAccessToken(data.token);
  return data;
};


export const signupUser = async (userData) => {

  const backendData = {
    name: userData.fullName || userData.name || 'New User',
    email: userData.email,
    password: userData.password,
    role: "user",
    longitude: 77.2090,
    latitude: 28.6139
  };

  const { data } = await api.post('/auth/signup', backendData);
  setAccessToken(data.token);
  return data;
};


export const forgotPassword = async (email) => {
  await delay(1500);
  return { message: 'Password reset link sent to your email' };



};


export const resetPassword = async (token, newPassword) => {
  await delay(1500);
  return { message: 'Password has been reset successfully' };



};


export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    clearAccessToken();
  }
};


export const getCurrentUser = async () => {
  const token = getAccessToken();
  if (!token) return null;
  const { data } = await api.get('/auth/me');
  return data.user;
};


export const updateUserLocation = async (coordinates) => {
  const { data } = await api.put('/users/location', coordinates);
  return data;
};

export default api;
