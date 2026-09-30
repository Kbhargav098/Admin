import { User } from './user.types';

export interface AuthState {
  user: User | null;
  token: string | null;
  organizationId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
