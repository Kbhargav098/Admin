import React from 'react';
import { useAuthStore } from '../store/auth.store';

export const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] shadow-sm text-center max-w-md w-full space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <span className="font-bold text-lg">403</span>
      </div>
      <h2 className="text-xl font-bold text-[#111111]">Access Denied</h2>
      <p className="text-xs text-gray-500">
        You do not have permission to access this resource or organisation portal.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 bg-[#F97316] text-white text-xs font-semibold rounded-xl hover:bg-[#EA580C] transition"
      >
        Return to Safety
      </a>
    </div>
  </div>
);

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] shadow-sm text-center max-w-md w-full space-y-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mx-auto">
        <span className="font-bold text-lg">404</span>
      </div>
      <h2 className="text-xl font-bold text-[#111111]">Page Not Found</h2>
      <p className="text-xs text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 bg-[#F97316] text-white text-xs font-semibold rounded-xl hover:bg-[#EA580C] transition"
      >
        Return to Dashboard
      </a>
    </div>
  </div>
);
