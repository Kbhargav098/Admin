import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PlatformLayout } from '../layouts/platform/PlatformLayout';
import { PlatformDashboard } from '../pages/platform/Dashboard';

export const platformRoutes: RouteObject = {
  path: 'platform',
  element: <PlatformLayout />,
  children: [{ path: '*', element: <PlatformDashboard /> }],
};
