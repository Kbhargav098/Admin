import { apiClient } from './api-client';

export const jobsApi = {
  getCostPreview: () => apiClient.get('/org/any/jobs/cost-preview'),
  listJobs: (orgId: string, params?: any) => apiClient.get(`/org/${orgId}/jobs`, { params }),
  getJob: (orgId: string, jobId: string) => apiClient.get(`/org/${orgId}/jobs/${jobId}`),
  createJob: (orgId: string, data: any) => apiClient.post(`/org/${orgId}/jobs`, data),
  updateJob: (orgId: string, jobId: string, data: any) => apiClient.patch(`/org/${orgId}/jobs/${jobId}`, data),
  closeJob: (orgId: string, jobId: string) => apiClient.post(`/org/${orgId}/jobs/${jobId}/close`),
  deleteJob: (orgId: string, jobId: string) => apiClient.delete(`/org/${orgId}/jobs/${jobId}`),
};
