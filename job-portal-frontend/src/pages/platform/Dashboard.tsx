import React from 'react';

export const PlatformDashboard: React.FC = () => (
  <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] text-center text-sm">
    <h3 className="font-bold text-base">Platform Super Admin Dashboard Stub</h3>
    <p className="text-gray-500 mt-1">Platform portal features are built by other teams.</p>
  </div>
);

export const Organisations: React.FC = () => <PlatformDashboard />;
export const TokenPlans: React.FC = () => <PlatformDashboard />;
export const PlatformAdmins: React.FC = () => <PlatformDashboard />;
export const PlatformAnalytics: React.FC = () => <PlatformDashboard />;
