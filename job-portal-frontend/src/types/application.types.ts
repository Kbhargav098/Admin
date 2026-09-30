import { Job } from './job.types';

export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export interface Candidate {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  phone?: string;
  location?: string;
  skills?: string;
  experienceYrs: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  resumes?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
}

export interface ApplicationHistory {
  id: string;
  fromStatus?: string;
  toStatus: string;
  reason?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  organizationId: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  job: Job;
  candidate: Candidate;
  history?: ApplicationHistory[];
  interviews?: any[];
  offers?: any[];
}
