import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const PrivateRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};
