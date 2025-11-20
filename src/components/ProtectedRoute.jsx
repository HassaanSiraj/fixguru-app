import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, requireProvider = false, requireSeeker = false }) {
  const { isAuthenticated, loading, isAdmin, isProvider, isSeeker } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireProvider && !isProvider) {
    return <Navigate to="/" replace />;
  }

  if (requireSeeker && !isSeeker) {
    return <Navigate to="/" replace />;
  }

  return children;
}

