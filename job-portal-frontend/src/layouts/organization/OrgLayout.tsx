import React from 'react';
import { Outlet } from 'react-router-dom';
import { OrgHeader } from './OrgHeader';
import { OrgSidebar } from './OrgSidebar';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useUiStore } from '../../store/ui.store';
import { OrgSettingsModal } from '../../components/organization/OrgSettingsModal';

export const OrgLayout: React.FC = () => {
  useWebSocket();
  const { isSettingsOpen, setSettingsOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
      <OrgHeader />
      <div className="flex flex-1">
        <OrgSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {isSettingsOpen && (
        <OrgSettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
};
