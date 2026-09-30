import { apiClient } from './api-client';

export const applicationsApi = {
  listApplications: (orgId: string, params?: any) => apiClient.get(`/org/${orgId}/applications`, { params }),
  getApplication: (orgId: string, id: string) => apiClient.get(`/org/${orgId}/applications/${id}`),
  updateStatus: (orgId: string, id: string, status: string, reason?: string) =>
    apiClient.patch(`/org/${orgId}/applications/${id}/status`, { status, reason }),
  updateNotes: (orgId: string, id: string, notes: string) =>
    apiClient.patch(`/org/${orgId}/applications/${id}/notes`, { notes }),
  searchCandidates: (orgId: string, params?: any) => apiClient.get(`/org/${orgId}/candidates/search`, { params }),
  getCandidate: (orgId: string, id: string) => apiClient.get(`/org/${orgId}/candidates/${id}`),
  listInterviews: (orgId: string) => apiClient.get(`/org/${orgId}/interviews`),
  scheduleInterview: (orgId: string, data: any) => apiClient.post(`/org/${orgId}/interviews`, data),
  listOffers: (orgId: string) => apiClient.get(`/org/${orgId}/offers`),
  createOffer: (orgId: string, data: any) => apiClient.post(`/org/${orgId}/offers`, data),
};
