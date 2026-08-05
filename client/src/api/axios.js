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

/**
 * Extract a user-friendly error message from any API error response.
 *
 * Handles all known error shapes from our backend:
 * - { error: "message" }                    — single error string
 * - { errors: [{ field, message }] }        — Zod validation array
 * - { errors: { field: ["msg", ...] } }     — Django validation dict
 * - { detail: "message" }                   — DRF default
 * - Network errors / timeouts               — generic message
 *
 * @param {Error} error - Axios error object
 * @param {string} fallback - Fallback message if nothing useful is found
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  // No response at all — network error
  if (!error.response) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'The request took too long. Please try again.';
    }
    return fallback;
  }

  const data = error.response.data;

  // Shape 1: { error: "friendly message" } — our standard format
  if (data?.error && typeof data.error === 'string') {
    return data.error;
  }

  // Shape 2: { errors: [{ field, message }] } — Zod validation array
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const messages = data.errors
      .map(e => e.message || e)
      .filter(Boolean);
    return messages.length > 0 ? messages.join('. ') : fallback;
  }

  // Shape 3: { errors: { field: ["msg"] } } — Django validation dict
  if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const messages = Object.entries(data.errors)
      .flatMap(([field, msgs]) => {
        const msgList = Array.isArray(msgs) ? msgs : [msgs];
        // Make field name readable
        const friendlyField = field
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, s => s.toUpperCase())
          .trim();
        return msgList.map(m => `${friendlyField}: ${m}`);
      });
    return messages.length > 0 ? messages.join('. ') : fallback;
  }

  // Shape 4: { detail: "message" } — DRF default format
  if (data?.detail && typeof data.detail === 'string') {
    return data.detail;
  }

  // Shape 5: { message: "..." } — generic
  if (data?.message && typeof data.message === 'string') {
    return data.message;
  }

  return fallback;
}
