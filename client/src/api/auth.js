/**
 * Auth API Functions
 *
 * Clean wrapper functions for auth-related API calls.
 * Components call these functions instead of making raw axios calls.
 */

import api from './axios';

// Sign up a new user
export const signup = (data) =>
  api.post('/auth/signup', data);

// Log in an existing user
export const login = (data) =>
  api.post('/auth/login', data);

// Refresh the access token
export const refreshToken = (token) =>
  api.post('/auth/refresh', { refreshToken: token });

// Log out the current user
export const logout = (token) =>
  api.post('/auth/logout', { refreshToken: token });

// Get the current user's profile
export const getMe = () =>
  api.get('/auth/me');
