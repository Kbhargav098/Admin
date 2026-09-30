export type UserRole =
  | 'ORG_SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'RECRUITER'
  | 'PLATFORM_SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'CANDIDATE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  permissions?: string[];
}
