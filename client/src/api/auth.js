import api from './axios';

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = (token) => api.post('/auth/refresh', { refreshToken: token });
export const logout = (token) => api.post('/auth/logout', { refreshToken: token });
export const getMe = () => api.get('/auth/me');
