/**
 * App Component — Root Router
 *
 * Defines all the routes (pages) in our application.
 * Uses React Router v6 for client-side navigation.
 *
 * Route structure:
 * - / (smart redirect — login or dashboard based on auth state)
 * - /login
 * - /signup
 * - /dashboard (protected)
 * - /builder (protected)
 * - /analyzer (protected)
 * - /compare (protected)
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobComparison from './pages/JobComparison';

/**
 * Smart redirect component — sends authenticated users to dashboard,
 * unauthenticated users to login page.
 */
function SmartRedirect() {
  const { isAuthenticated, loading } = useAuth();

  // While checking auth status, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* All routes are wrapped in Layout (which includes the Navbar) */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes — require authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/builder" element={
          <ProtectedRoute><ResumeBuilder /></ProtectedRoute>
        } />
        <Route path="/analyzer" element={
          <ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute><JobComparison /></ProtectedRoute>
        } />

        {/* Default redirect — login or dashboard based on auth state */}
        <Route path="/" element={<SmartRedirect />} />

        {/* 404 — redirect based on auth state */}
        <Route path="*" element={<SmartRedirect />} />
      </Route>
    </Routes>
  );
}
