export enum PermissionCode {
  // Org Super Admin permissions
  ORG_MANAGE_ALL = 'org:manage_all',
  TOKENS_PURCHASE = 'tokens:purchase',
  BILLING_MANAGE = 'billing:manage',
  ORG_ADMIN_MANAGE = 'org_admin:manage',

  // Org Admin permissions
  RECRUITER_MANAGE = 'recruiter:manage',
  TOKENS_ALLOCATE = 'tokens:allocate',
  JOB_MANAGE_ALL = 'job:manage_all',
  MEMBER_MANAGE = 'member:manage',

  // Recruiter permissions
  JOB_CREATE = 'job:create',
  JOB_UPDATE = 'job:update',
  CANDIDATE_SEARCH = 'candidate:search',
  CANDIDATE_VIEW = 'candidate:view',
  APPLICATION_MANAGE = 'application:manage',
  INTERVIEW_SCHEDULE = 'interview:schedule',
  OFFER_SEND = 'offer:send',
}
