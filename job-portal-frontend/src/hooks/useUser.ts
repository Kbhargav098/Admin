import { useAuthStore } from '../store/auth.store';

export function useUser() {
  const user = useAuthStore((state) => state.user);
  return {
    user,
    role: user?.role,
    permissions: user?.permissions || [],
    hasPermission: (perm: string) => user?.permissions?.includes(perm) ?? false,
    hasRole: (role: string) => user?.role === role,
  };
}
