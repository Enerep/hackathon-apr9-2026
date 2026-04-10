import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.verificationStatus === 'none') {
    return <Navigate to="/verify-id" replace />;
  }

  if (user.verificationStatus === 'pending' || user.verificationStatus === 'denied') {
    return <Navigate to="/verification-status" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
