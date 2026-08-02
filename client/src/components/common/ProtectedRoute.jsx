/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * If the user is not logged in, redirects to the login page.
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // While checking auth status, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the protected page
  return children;
}
