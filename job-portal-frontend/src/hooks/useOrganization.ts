import { useQuery } from '@tanstack/react-query';
import { organisationApi } from '../services/api/organisation.api';
import { useAuthStore } from '../store/auth.store';

export function useOrganization() {
  const organizationId = useAuthStore((state) => state.organizationId);

  const { data: org, isLoading, refetch } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      const res: any = await organisationApi.getOrg(organizationId);
      return res.data || res;
    },
    enabled: !!organizationId,
  });

  return {
    organizationId,
    org,
    isLoading,
    refetch,
  };
}
