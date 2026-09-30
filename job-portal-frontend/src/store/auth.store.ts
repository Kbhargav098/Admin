import { create } from 'zustand';
import { User } from '../types/user.types';

interface AuthStore {
  user: User | null;
  token: string | null;
  organizationId: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setOrganizationId: (orgId: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  organizationId: localStorage.getItem('organizationId') || null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  setOrganizationId: (organizationId) => {
    if (organizationId) {
      localStorage.setItem('organizationId', organizationId);
    } else {
      localStorage.removeItem('organizationId');
    }
    set({ organizationId });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('organizationId');
    set({ user: null, token: null, organizationId: null });
  },
}));
