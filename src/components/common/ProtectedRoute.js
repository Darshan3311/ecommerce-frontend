import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  // While we're initializing (verifying cookie with server), don't redirect.
  // This prevents transient logout/white-screen when the app mounts or when
  // the user navigates back/forward and the auth state hasn't been reconciled.
  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
