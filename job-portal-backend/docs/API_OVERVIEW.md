# Multi-Tenant Job Portal API Overview

Base Path: `/api/v1`
Swagger Docs: `/api/docs`

## Core Modules & Endpoints
- **Auth**: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`, `/api/v1/auth/me`
- **Organizations**: `/api/v1/org/:organizationId`, `/api/v1/org/:organizationId/settings`
- **Members & Recruiters**: `/api/v1/org/:organizationId/members`, `/api/v1/org/:organizationId/recruiters`
- **Jobs**: `/api/v1/org/:organizationId/jobs`, `/api/v1/org/:organizationId/jobs/cost-preview`, `/api/v1/org/:organizationId/jobs/:id/close`
- **Applications & ATS**: `/api/v1/org/:organizationId/applications`, `/api/v1/org/:organizationId/applications/:id/status`
- **Interviews**: `/api/v1/org/:organizationId/interviews`
- **Offers**: `/api/v1/org/:organizationId/offers`
- **Candidates**: `/api/v1/org/:organizationId/candidates/search`, `/api/v1/org/:organizationId/candidates/:id`
- **Tokens & Billing**: `/api/v1/org/:organizationId/tokens/balance`, `/api/v1/org/:organizationId/tokens/allocate`, `/api/v1/org/:organizationId/billing/plans`, `/api/v1/org/:organizationId/billing/checkout`
- **Analytics**: `/api/v1/org/:organizationId/analytics/dashboard`
