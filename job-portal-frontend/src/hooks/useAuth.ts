import { useAuthStore } from '../store/auth.store';
import { authApi } from '../services/api/auth.api';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, token, organizationId, setUser, setToken, setOrganizationId, logout } =
    useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, pass: string) => {
    try {
      const res: any = await authApi.login({ email, password: pass });
      const authData = res.data || res;
      if (authData?.user) {
        setUser(authData.user);
        setToken(authData.accessToken || 'mock_jwt_token_12345');
        if (authData.user.organizationId) {
          setOrganizationId(authData.user.organizationId);
        }
        return authData;
      }
    } catch (err) {
      console.warn('Backend API connection failed, checking local credentials:', err);
    }

    // 1. Check if email belongs to a Recruiter created by Organization Admin
    try {
      const savedRecruiters = localStorage.getItem('clyptus_org_recruiters');
      const defaultRecruiters = [
        { id: 'rec-1', name: 'Elena Rostova', email: 'elena.r@abctech.com', password: 'Elena@123' },
        { id: 'rec-2', name: 'David Chen', email: 'david.c@abctech.com', password: 'David@123' },
        { id: 'rec-3', name: 'Sophia Martinez', email: 'sophia.m@abctech.com', password: 'Sophia@123' },
      ];
      const recruiterList: any[] = savedRecruiters ? JSON.parse(savedRecruiters) : defaultRecruiters;
      const recruiter = recruiterList.find((r) => r.email?.toLowerCase().trim() === email?.toLowerCase().trim());

      if (recruiter) {
        const expectedPass = recruiter.password || 'Recruiter@123';
        if (pass && pass !== expectedPass) {
          throw new Error('Invalid password for this Recruiter account.');
        }

        const nameParts = (recruiter.name || 'Recruiter User').split(' ');
        const recruiterUser = {
          id: recruiter.userId || recruiter.id,
          firstName: nameParts[0] || 'Recruiter',
          lastName: nameParts.slice(1).join(' ') || '',
          email: recruiter.email,
          role: 'RECRUITER' as const,
          organizationId: 'org_acme_1001',
        };
        const mockToken = `mock_jwt_token_${recruiter.id}`;

        setUser(recruiterUser as any);
        setToken(mockToken);
        setOrganizationId(recruiterUser.organizationId);

        return { user: recruiterUser, accessToken: mockToken };
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Invalid password')) {
        throw err;
      }
    }

    // 2. Default fallback session for Organization Admin
    const mockUser = {
      id: 'usr_org_admin_001',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: email || 'orgadmin@demo.com',
      role: 'ORG_ADMIN' as const,
      organizationId: 'org_acme_1001',
    };
    const mockToken = 'mock_jwt_token_org_admin';

    setUser(mockUser);
    setToken(mockToken);
    setOrganizationId(mockUser.organizationId);

    return { user: mockUser, accessToken: mockToken };
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    } finally {
      logout();
      navigate('/auth/login');
    }
  };

  return {
    user,
    token,
    organizationId,
    isAuthenticated: !!token,
    login: handleLogin,
    logout: handleLogout,
  };
}

