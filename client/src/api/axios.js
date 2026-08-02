/**
 * Axios Instance — Centralized HTTP Client
 *
 * All API calls go through this instance.
 * It automatically:
 * 1. Adds the base URL
 * 2. Attaches the JWT token to every request
 * 3. Handles token refresh when the access token expires
 * 4. Redirects to login if the refresh token also expires
 */

import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  // In development, Vite proxies /api/* to Express (see vite.config.js)
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Runs BEFORE every API request.
 * Attaches the JWT access token from localStorage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Runs AFTER every API response.
 * If we get a 401 (unauthorized), try to refresh the token.
 */
api.interceptors.response.use(
  // Success — just return the response
  (response) => response,

  // Error — check if it's a 401 (token expired)
  async (error) => {
    const originalRequest = error.config;

    // If we got a 401 and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token — user needs to log in again
          throw new Error('No refresh token');
        }

        // Try to get a new access token
        const response = await axios.post('/api/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
