import { create } from 'zustand';
import { User } from '../types/user.types';

interface UserStore {
  profile: User | null;
  setProfile: (profile: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
