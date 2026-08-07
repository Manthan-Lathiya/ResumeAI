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
import History from './pages/History';
import Examples from './pages/Examples';
import Templates from './pages/Templates';
import CoverLetter from './pages/CoverLetter';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import InterviewPrep from './pages/InterviewPrep';
import JDTailor from './pages/JDTailor';

/**
 * Smart redirect component — sends authenticated users to dashboard,
 * unauthenticated users to landing page for 404/fallback.
 */
function SmartRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* All routes are wrapped in Layout */}
      <Route element={<Layout />}>
        {/* Public Landing & Catalog routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/examples" element={<Examples />} />

        {/* Protected routes — require authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/builder" element={
          <ProtectedRoute><ResumeBuilder /></ProtectedRoute>
        } />
        <Route path="/tailor" element={
          <ProtectedRoute><JDTailor /></ProtectedRoute>
        } />
        <Route path="/interview-prep" element={
          <ProtectedRoute><InterviewPrep /></ProtectedRoute>
        } />
        <Route path="/cover-letter" element={
          <ProtectedRoute><CoverLetter /></ProtectedRoute>
        } />
        <Route path="/analyzer" element={
          <ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute><JobComparison /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />

        {/* 404 — fallback redirect */}
        <Route path="*" element={<SmartRedirect />} />
      </Route>
    </Routes>
  );
}
