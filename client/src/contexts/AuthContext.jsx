/**
 * Auth Context — Global Authentication State
 *
 * React Context provides a way to share data across ALL components
 * without passing props manually at every level.
 *
 * This context provides:
 * - user: The current logged-in user object (or null)
 * - loading: Whether we're still checking if the user is logged in
 * - login(): Log in a user
 * - signup(): Sign up a new user
 * - logout(): Log out the current user
 *
 * Any component can access these via: const { user, login } = useAuth();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '../api/auth';
import { getErrorMessage } from '../api/axios';

// Create the context (like a global variable container)
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 *
 * Wraps the entire app and provides auth state to all children.
 * On mount, checks if the user has a valid token in localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // true while checking stored token
  const navigate = useNavigate();

  // On app load, check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if there's a stored token and if it's still valid.
   */
  async function checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Try to get the user profile with the stored token
      const response = await authApi.getMe();
      setUser(response.data);
    } catch (error) {
      // Token is invalid or expired — clear it
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sign up a new user.
   */
  async function handleSignup(name, email, password) {
    try {
      const response = await authApi.signup({ name, email, password });
      const { user: userData, accessToken, refreshToken } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Update state
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

  /**
   * Log in an existing user.
   */
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

  /**
   * Log out the current user.
   */
  async function handleLogout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      // Ignore logout errors — we'll clear local state anyway
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out');
      navigate('/login');
    }
  }

  // The value object that all child components can access
  const value = {
    user,
    loading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context.
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
