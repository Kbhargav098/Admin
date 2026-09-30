import { apiClient } from './api-client';

export const tokensApi = {
  getBalance: (orgId: string) => apiClient.get(`/org/${orgId}/tokens/balance`),
  getAllocations: (orgId: string) => apiClient.get(`/org/${orgId}/tokens/allocations`),
  getTransactions: (orgId: string) => apiClient.get(`/org/${orgId}/tokens/transactions`),
  allocate: (orgId: string, recruiterId: string, amount: number) =>
    apiClient.post(`/org/${orgId}/tokens/allocate`, { recruiterId, amount }),
  getPlans: (orgId: string) => apiClient.get(`/org/${orgId}/billing/plans`),
  checkout: (orgId: string, planName: string) => apiClient.post(`/org/${orgId}/billing/checkout`, { planName }),
  getPurchases: (orgId: string) => apiClient.get(`/org/${orgId}/billing/purchases`),
};
