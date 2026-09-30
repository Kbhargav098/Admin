import React from 'react';

export const CandidateHome: React.FC = () => (
  <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] text-center text-sm">
    <h3 className="font-bold text-base">Candidate Portal Stub</h3>
    <p className="text-gray-500 mt-1">Candidate portal features are built by other teams.</p>
  </div>
);

export const CandidateJobSearch: React.FC = () => <CandidateHome />;
export const CandidateJobDetails: React.FC = () => <CandidateHome />;
export const CandidateProfile: React.FC = () => <CandidateHome />;
export const CandidateApplications: React.FC = () => <CandidateHome />;
