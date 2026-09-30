import { create } from 'zustand';

interface UiStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  isSettingsOpen: false,
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
}));
