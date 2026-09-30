import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import {
  Briefcase,
  Calendar,
  CreditCard,
  FileCheck,
  FileText,
  Gift,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  UserCheck,
  Users,
  ChevronDown,
  ChevronRight,
  Layers,
  Zap,
} from 'lucide-react';

export const OrgSidebar: React.FC = () => {
  const { user, organizationId } = useAuthStore();
  const { isSidebarOpen } = useUiStore();

  // Collapsible Dropdown States
  const [isOperationsOpen, setIsOperationsOpen] = useState(true);
  const [isTokensAnalyticsOpen, setIsTokensAnalyticsOpen] = useState(true);

  const base = `/org/${organizationId}`;

  const operationsNav = [
    { label: 'Dashboard', path: `${base}/dashboard`, icon: LayoutDashboard },
    { label: 'Recruiters', path: `${base}/members`, icon: Users, badge: 'Governance', badgeColor: 'bg-blue-100 text-blue-700' },
    { label: 'Jobs Overview', path: `${base}/jobs`, icon: Briefcase },
    { label: 'Candidates', path: `${base}/candidates`, icon: UserCheck },
    { label: 'Applications & ATS', path: `${base}/applications`, icon: FileText },
    { label: 'Interviews', path: `${base}/interviews`, icon: Calendar },
    { label: 'Offers', path: `${base}/offers`, icon: Gift },
  ];

  const tokensAnalyticsNav = [
    { label: 'Token Allocation', path: `${base}/billing`, icon: CreditCard, badge: 'Allocate', badgeColor: 'bg-blue-100 text-blue-700' },
    { label: 'Recruitment Analytics', path: `${base}/analytics`, icon: LineChart },
    { label: 'Audit Logs', path: `${base}/audit`, icon: ShieldCheck },
  ];

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-[calc(100vh-5rem)] select-none shrink-0 sticky top-20">
      <div className="p-4 space-y-4 overflow-y-auto">
        {/* 1. OPERATIONS Dropdown Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsOperationsOpen(!isOperationsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-gray-500 hover:text-gray-900 uppercase tracking-wider rounded-xl hover:bg-gray-100/70 transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>OPERATIONS</span>
            </div>
            {isOperationsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {isOperationsOpen && (
            <div className="space-y-1 mt-1 pl-1">
              {operationsNav.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-[#EBF3FF] text-[#0052CC] font-bold shadow-xs'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* 2. TOKENS & ANALYTICS Dropdown Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsTokensAnalyticsOpen(!isTokensAnalyticsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-gray-500 hover:text-gray-900 uppercase tracking-wider rounded-xl hover:bg-gray-100/70 transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-[#F97316]" />
              <span>TOKENS & ANALYTICS</span>
            </div>
            {isTokensAnalyticsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {isTokensAnalyticsOpen && (
            <div className="space-y-1 mt-1 pl-1">
              {tokensAnalyticsNav.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-[#EBF3FF] text-[#0052CC] font-bold shadow-xs'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer matching Image 5 */}
      <div className="p-3 px-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Organization Admin</span>
        <span className="font-semibold text-gray-400">v3.0 Spec</span>
      </div>
    </aside>
  );
};
