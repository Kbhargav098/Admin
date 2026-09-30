export interface JobSkill {
  id: string;
  name: string;
}

export interface Job {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  department?: string;
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  tokenCost: number;
  createdAt: string;
  skills?: JobSkill[];
  _count?: {
    applications: number;
  };
}
