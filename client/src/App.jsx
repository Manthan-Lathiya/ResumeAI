/**
 * App Component — Root Router
 *
 * Defines all the routes (pages) in our application.
 * Uses React Router v6 for client-side navigation.
 *
 * Route structure:
 * - / (landing page or redirect)
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobComparison from './pages/JobComparison';

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

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 — redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
