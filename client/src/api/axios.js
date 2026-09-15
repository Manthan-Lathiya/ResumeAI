import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401, attempt token refresh. On failure, clear session and redirect to login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * Extracts a user-friendly error message from an Axios error response.
 * Handles all backend error shapes:
 *   { error: "..." }                 — standard
 *   { errors: [{ message }] }        — Zod validation array
 *   { errors: { field: ["msg"] } }   — Django validation dict
 *   { detail: "..." }                — DRF default
 *   { message: "..." }               — generic
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.';
    return fallback;
  }

  const data = error.response.data;

  if (data?.error && typeof data.error === 'string') return data.error;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const messages = data.errors.map((e) => e.message || e).filter(Boolean);
    return messages.length > 0 ? messages.join('. ') : fallback;
  }

  if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const messages = Object.entries(data.errors).flatMap(([field, msgs]) => {
      const msgList = Array.isArray(msgs) ? msgs : [msgs];
      const friendlyField = field
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      return msgList.map((m) => `${friendlyField}: ${m}`);
    });
    return messages.length > 0 ? messages.join('. ') : fallback;
  }

  if (data?.detail && typeof data.detail === 'string') return data.detail;
  if (data?.message && typeof data.message === 'string') return data.message;

  return fallback;
}
