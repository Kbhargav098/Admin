import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useOrganizationStore } from '../../store/organization.store';
import { useUiStore } from '../../store/ui.store';
import { useAuth } from '../../hooks/useAuth';
import {
  Building,
  ChevronDown,
  LogOut,
  Menu,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrgHeader: React.FC = () => {
  const { user, organizationId } = useAuthStore();
  const { currentOrg } = useOrganizationStore();
  const { toggleSidebar } = useUiStore();
  const { logout } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const orgName = currentOrg?.name || 'ABC Recruitment Pvt Ltd';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Marcus Vance';
  const userRoleDisplay = user?.role === 'ORG_SUPER_ADMIN' ? 'Organization Super Admin' : 'Organization Admin';
  const [credits, setCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_total_tokens');
      return saved ? JSON.parse(saved) : (currentOrg?.tokenWallet?.balance ?? 1000);
    } catch (e) {
      return 1000;
    }
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('clyptus_org_total_tokens');
        if (saved) setCredits(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          {/* Logo icon matching Image 5 */}
          <div className="w-10 h-10 rounded-xl bg-[#0052CC] text-white flex items-center justify-center font-black text-xl shadow-sm">
            C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-[#0B192C] tracking-tight">
                Clyptus
              </span>
              <span className="px-2.5 py-0.5 bg-[#EAF2FF] text-[#0052CC] font-bold text-[10px] rounded-full tracking-wide uppercase">
                ORGANIZATION ADMIN PORTAL
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              {orgName} • Permission-Based RBAC
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {/* User Profile Badge matching Image 5 */}
        <div className="relative flex items-center space-x-2">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border border-gray-300"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="w-9 h-9 rounded-full bg-[#0052CC] text-white font-bold text-xs flex items-center justify-center hidden" id="avatar-fallback">
              {user?.firstName?.charAt(0) || 'M'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {userName}
              </p>
              <p className="text-[11px] text-[#0052CC] font-medium leading-tight">
                {userRoleDisplay}
              </p>
            </div>
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{userName}</p>
                <p className="text-[11px] text-gray-500">{user?.email || 'marcus.vance@abctech.com'}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

