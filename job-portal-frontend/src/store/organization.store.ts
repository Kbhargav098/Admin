import { create } from 'zustand';
import { Organization } from '../types/organization.types';

interface OrganizationStore {
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
}

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  currentOrg: null,
  setCurrentOrg: (currentOrg) => set({ currentOrg }),
}));
