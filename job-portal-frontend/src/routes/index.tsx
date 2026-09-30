import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { orgRoutes } from './org.routes';
import { platformRoutes } from './platform.routes';
import { candidateRoutes } from './candidate.routes';
import { PrivateRoute } from './private-route';
import { PublicRoute } from './public-route';
import { Login } from '../pages/auth/Login';
import { NotFoundPage, UnauthorizedPage } from './route-guards';
import { useAuthStore } from '../store/auth.store';

const RootRedirect: React.FC = () => {
  const { token, organizationId } = useAuthStore();
  if (token) {
    const orgId = organizationId || 'org_acme_1001';
    return <Navigate to={`/org/${orgId}/dashboard`} replace />;
  }
  return <Navigate to="/auth/login" replace />;
};

const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    path: 'auth',
    element: <PublicRoute />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '*', element: <Login /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [orgRoutes, platformRoutes, candidateRoutes],
  },
  { path: 'unauthorized', element: <UnauthorizedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
