import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/user.types';

interface RoleRouteProps {
  allowedRoles?: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, organizationId: userOrgId } = useAuthStore();
  const params = useParams();

  const routeOrgId = params.organizationId;

  // Tenant Isolation Check
  if (routeOrgId && userOrgId && routeOrgId !== userOrgId) {
    // If user tries to access another org URL
    if (user?.role !== 'PLATFORM_SUPER_ADMIN' && user?.role !== 'PLATFORM_ADMIN') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // RBAC Role Check
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};
