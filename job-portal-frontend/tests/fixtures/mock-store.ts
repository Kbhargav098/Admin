export const mockSuperAdminUser = {
  id: 'user_acme_superadmin',
  email: 'orgsuperadmin@demo.com',
  firstName: 'Sarah',
  lastName: 'Connor',
  role: 'ORG_SUPER_ADMIN' as const,
  organizationId: 'org_acme_1001',
  permissions: ['org:manage_all', 'tokens:purchase', 'billing:manage'],
};

export const mockRecruiterUser = {
  id: 'user_acme_recruiter1',
  email: 'recruiter@demo.com',
  firstName: 'David',
  lastName: 'Miller',
  role: 'RECRUITER' as const,
  organizationId: 'org_acme_1001',
  permissions: ['job:create', 'candidate:search'],
};
