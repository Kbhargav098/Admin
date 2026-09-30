import React from 'react';
import { RouteObject } from 'react-router-dom';
import { CandidateLayout } from '../layouts/candidate/CandidateLayout';
import { CandidateHome } from '../pages/candidate/Home';

export const candidateRoutes: RouteObject = {
  path: 'candidate',
  element: <CandidateLayout />,
  children: [{ path: '*', element: <CandidateHome /> }],
};
