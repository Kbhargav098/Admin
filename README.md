# Clyptus Admin & Enterprise Job Portal Platform

A full-stack recruitment platform and applicant tracking system (ATS) engineered for modern enterprise hiring teams, recruiters, and platform administrators.

---

## 📁 Repository Structure

```text
Admin/
├── job-portal-frontend/      # React 18 + TypeScript + Vite + Tailwind CSS Frontend UI
│   ├── src/
│   │   ├── components/       # Modals, Organization components
│   │   ├── features/         # CandidateSearch, Filters, Data Drawers
│   │   ├── pages/            # Dashboard, Jobs, Members, Billing, Analytics, Audit
│   │   ├── routes/           # Role-based route guards and navigation
│   │   ├── services/         # API Client and WebSocket services
│   │   └── store/            # State management (Zustand)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── job-portal-backend/       # NestJS + Prisma ORM + TypeScript Backend API
│   ├── prisma/               # Database schema and SQLite / Postgres migrations
│   ├── scripts/              # Seed scripts (roles, permissions, admin users)
│   ├── src/
│   │   ├── api/              # Controllers, routes, and DTOs
│   │   ├── common/           # Interceptors, filters, exceptions
│   │   ├── modules/          # Auth, Jobs, Candidates, Recruiters, Tokens, Billing
│   │   ├── security/         # RBAC guards, CSRF, rate-limiting
│   │   └── workers/          # Background queues and event listeners
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Key Modules & Capabilities

### 1. Job Management & Creation (`job-portal-frontend/src/pages/organization/Jobs.tsx`)
- **Multi-Skill Selection**: Pre-populated 10 in-demand skill tags (React, Node.js, TypeScript, Python, AWS, Docker, Kubernetes, GraphQL, SQL, Tailwind CSS) for instant job profiling.
- **Dynamic Recruiter Assignment**: Instantly assign one or multiple recruiters directly during job creation or overview updates.
- **Automated Profile Sync**: Assigning a job to a recruiter immediately reflects in their dedicated Recruiter Profile and active jobs list.

### 2. Recruiter Profile & Team Management (`job-portal-frontend/src/pages/organization/Members.tsx`)
- **Cleaned Recruiter View**: Streamlined recruiter cards and detail views focused strictly on recruiting metrics (active candidates, assigned jobs, placement rate, performance history).
- **Role Assignment**: Granular role-based controls without legacy clutter.

### 3. Advanced Candidate Search (`job-portal-frontend/src/features/search/CandidateSearch.tsx`)
- **Interactive Multi-facet Filtering**: Real-time filtering by skills, location, experience levels, and availability.
- **Actionable Controls**: Functional candidate profile drawers, resume viewer triggers, shortlist actions, and interview scheduling buttons.

### 4. Enterprise Analytics & Billing (`job-portal-frontend/src/pages/organization/`)
- **Performance Analytics**: Time-to-hire, pipeline conversion rates, interview drop-offs, and recruiter activity.
- **Subscription & Billing**: Plan tiers, invoice history, token quota tracking, and payment method settings.

### 5. Robust NestJS Backend (`job-portal-backend/`)
- **Prisma ORM**: Relational schema modeling users, organizations, jobs, applications, and audit trails.
- **Security**: JWT authentication, CSRF tokens, rate limiting, and RBAC permission checks on every endpoint.
- **Database**: SQLite for development, ready for PostgreSQL in production.

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Running the Backend
```bash
cd job-portal-backend

# Install dependencies
npm install

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Seed database with initial roles & test accounts
npm run seed

# Start NestJS backend in development mode
npm run start:dev
```
The backend API starts on `http://localhost:3000` (or `PORT` defined in `.env`).

### 2. Running the Frontend
```bash
cd job-portal-frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend UI will be accessible at `http://localhost:5173`.

---

## 🛡️ License & Authors
Developed for the **Clyptus Platform** recruitment ecosystem.
All rights reserved.
