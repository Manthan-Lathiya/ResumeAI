import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '../api/auth';
import { getErrorMessage } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await authApi.getMe();
      setUser(response.data);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(name, email, password) {
    try {
      const response = await authApi.signup({ name, email, password });
      const { user: userData, accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, 'Signup failed. Please try again.');
      toast.error(message);
      return { success: false, error: message };
    }
  }

  async function handleLogin(email, password) {
    try {
      const response = await authApi.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      toast.success('Welcome back!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed. Please check your credentials.');
      toast.error(message);
      return { success: false, error: message };
    }
  }

  async function handleLogout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore logout errors — clear local state regardless
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out');
      navigate('/');
    }
  }

  const value = {
    user,
    loading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
