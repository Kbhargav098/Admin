import React from 'react';
import { RouteObject } from 'react-router-dom';
import { OrgLayout } from '../layouts/organization/OrgLayout';
import { Dashboard } from '../pages/organization/Dashboard';
import { Jobs } from '../pages/organization/Jobs';
import { Applications } from '../pages/organization/Applications';
import { Members } from '../pages/organization/Members';
import { Billing } from '../pages/organization/Billing';
import { Interviews } from '../pages/organization/Interviews';
import { Offers } from '../pages/organization/Offers';
import { Analytics } from '../pages/organization/Analytics';
import { Audit } from '../pages/organization/Audit';
import { CandidateSearch } from '../features/search/CandidateSearch';
import { RoleRoute } from './role-route';

export const orgRoutes: RouteObject = {
  path: 'org/:organizationId',
  element: <RoleRoute />,
  children: [
    {
      element: <OrgLayout />,
      children: [
        { path: '', element: <Dashboard /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'jobs', element: <Jobs /> },
        { path: 'applications', element: <Applications /> },
        { path: 'interviews', element: <Interviews /> },
        { path: 'offers', element: <Offers /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'audit', element: <Audit /> },
        { path: 'search', element: <CandidateSearch /> },
        { path: 'candidates', element: <CandidateSearch /> },
        { path: 'members', element: <Members /> },
        { path: 'billing', element: <Billing /> },
      ],
    },
  ],
};
