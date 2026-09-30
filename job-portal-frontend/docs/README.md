# Job Portal Frontend (Organisation Portal)

React + TypeScript (strict) + Vite frontend for Multi-Organisation Job Portal.

## Setup & Running
1. `npm install`
2. `npm run dev` (Runs on http://localhost:5173)
3. `npm run build` (Compiles TypeScript and bundles production build)
4. `npm test` (Runs Vitest test suite)

## Demo Credentials
- **Org Super Admin (Acme)**: `orgsuperadmin@demo.com` / `Demo@1234`
- **Org Admin (Acme)**: `orgadmin@demo.com` / `Demo@1234`
- **Recruiter (Acme)**: `recruiter@demo.com` / `Demo@1234`
- **Globex Admin**: `globexadmin@demo.com` / `Demo@1234`

## Role Permission Matrix
- **ORG_SUPER_ADMIN**: Full org access, token purchase, billing management, org admins & members management.
- **ORG_ADMIN**: Recruiters management, recruiter token allocation, jobs management, ATS pipeline, no billing access.
- **RECRUITER**: Post & manage own jobs, candidate search & resume view (token-gated), schedule interviews, send offers.
