import { apiClient } from './api-client';

export const organisationApi = {
  getOrg: (orgId: string) => apiClient.get(`/org/${orgId}`),
  updateOrg: (orgId: string, data: any) => apiClient.patch(`/org/${orgId}`, data),
  getMembers: (orgId: string) => apiClient.get(`/org/${orgId}/members`),
  inviteMember: (orgId: string, data: any) => apiClient.post(`/org/${orgId}/members`, data),
  updateMemberRole: (orgId: string, memberId: string, data: any) => apiClient.patch(`/org/${orgId}/members/${memberId}`, data),
  deleteMember: (orgId: string, memberId: string) => apiClient.delete(`/org/${orgId}/members/${memberId}`),
  getRecruiters: (orgId: string) => apiClient.get(`/org/${orgId}/recruiters`),
  createRecruiter: (orgId: string, data: any) => apiClient.post(`/org/${orgId}/recruiters`, data),
  updateRecruiterRole: (orgId: string, recruiterId: string, data: any) => apiClient.patch(`/org/${orgId}/recruiters/${recruiterId}/role`, data),
  getSettings: (orgId: string) => apiClient.get(`/org/${orgId}/settings`),
  updateSettings: (orgId: string, data: any) => apiClient.patch(`/org/${orgId}/settings`, data),
  getAnalytics: (orgId: string) => apiClient.get(`/org/${orgId}/analytics/dashboard`),
};
