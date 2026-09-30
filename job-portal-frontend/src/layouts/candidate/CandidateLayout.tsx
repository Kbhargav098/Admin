import React from 'react';

export const CandidateHeader: React.FC = () => (
  <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
    <h1 className="font-bold text-lg">Candidate Portal (Stub)</h1>
  </header>
);

export const CandidateSidebar: React.FC = () => (
  <aside className="w-64 bg-white border-r p-4 text-xs">
    <p className="text-gray-400">Candidate Portal is out of scope (Built by others)</p>
  </aside>
);

export const CandidateLayout: React.FC = () => (
  <div className="min-h-screen bg-[#F5F5F5]">
    <CandidateHeader />
    <div className="flex min-h-[calc(100vh-4rem)]">
      <CandidateSidebar />
      <main className="p-6 flex-1">
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <h2 className="text-lg font-bold">Candidate Portal Stub</h2>
          <p className="text-sm text-gray-500 mt-2">
            This module is built by another team. Structure kept intact.
          </p>
        </div>
      </main>
    </div>
  </div>
);
