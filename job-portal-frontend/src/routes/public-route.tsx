import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const PublicRoute: React.FC = () => {
  const { token, organizationId } = useAuthStore();
  if (token) {
    const orgId = organizationId || 'org_acme_1001';
    return <Navigate to={`/org/${orgId}/dashboard`} replace />;
  }
  return <Outlet />;
};
