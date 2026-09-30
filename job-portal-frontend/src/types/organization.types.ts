import { User } from './user.types';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  tokenWallet?: {
    balance: number;
  };
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  recruiterType?: string;
  status: string;
  user: User;
  tokenAllocation?: {
    allocated: number;
    used: number;
    remaining: number;
  };
}
