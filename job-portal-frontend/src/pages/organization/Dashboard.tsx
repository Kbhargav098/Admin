import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { Users, Briefcase, FileText, Coins, Clock, Activity, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Dynamic state loaded from localStorage for real-time live updates
  const [stats, setStats] = useState({
    recruiters: 3,
    activeJobs: 3,
    applications: 5,
    availableCredits: 1000,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const loadDashboardData = () => {
    try {
      // 1. Recruiters Count
      const savedRecruiters = localStorage.getItem('clyptus_org_recruiters');
      const recruitersArr = savedRecruiters ? JSON.parse(savedRecruiters) : [];
      const recruitersCount = recruitersArr.length > 0 ? recruitersArr.length : 3;

      // 2. Active Jobs Count
      const savedJobs = localStorage.getItem('clyptus_org_jobs');
      const jobsArr = savedJobs ? JSON.parse(savedJobs) : [];
      const activeJobsCount = jobsArr.length > 0 ? jobsArr.filter((j: any) => j.status === 'PUBLISHED').length : 3;

      // 3. Applications Count
      const savedApps = localStorage.getItem('clyptus_org_applications');
      const appsArr = savedApps ? JSON.parse(savedApps) : [];
      const applicationsCount = appsArr.length > 0 ? appsArr.length : 5;

      // 4. Available Tokens / Credits
      const savedTokens = localStorage.getItem('clyptus_org_total_tokens');
      const creditsVal = savedTokens ? JSON.parse(savedTokens) : 1000;

      setStats({
        recruiters: recruitersCount,
        activeJobs: activeJobsCount,
        applications: applicationsCount,
        availableCredits: creditsVal,
      });

      // 5. Recent Admin & Recruiter Audit Logs
      const savedLogs = localStorage.getItem('clyptus_org_audit_logs');
      if (savedLogs) {
        const logsArr = JSON.parse(savedLogs);
        setRecentActivities(logsArr.slice(0, 6)); // Top 6 newest actions
      } else {
        setRecentActivities([
          {
            title: 'Recruiter Token Allocated',
            description: 'Allocated +100 tokens to Elena Rostova from Organization Wallet Pool',
            actorName: 'Marcus Vance',
            actorRole: 'Org Admin',
            timestamp: 'Just now',
          },
          {
            title: 'Candidate ATS Stage Advanced',
            description: 'Moved candidate Sarah Connor from Shortlisted to Technical Interview stage',
            actorName: 'Elena Rostova',
            actorRole: 'Tech Recruiter',
            timestamp: '10 mins ago',
          },
          {
            title: 'Job Requisition Published',
            description: 'Published Senior Full Stack Engineer opening in Engineering department',
            actorName: 'Elena Rostova',
            actorRole: 'Tech Recruiter',
            timestamp: '1 hour ago',
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load dashboard metrics:', e);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleStorage = () => loadDashboardData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Dark Navy Hero Banner matching Image 5 */}
      <div className="bg-[#0B1E36] rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-3 py-1 bg-[#163660] text-[#60A5FA] font-bold text-[11px] rounded-md uppercase tracking-wider mb-3 border border-[#1E40AF]">
            ORGANIZATION ADMIN PORTAL
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Admin Operations Center
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Permission-based RBAC dashboard to manage recruiters, approve jobs, review applications, allocate tokens, and view live operational reports.
          </p>
        </div>
      </div>

      {/* 4 Dynamic Stat Cards Grid matching Image 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: RECRUITERS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
            RECRUITERS
          </p>
          <p className="text-3xl font-extrabold text-gray-900">
            {stats.recruiters}
          </p>
          <p className="text-xs text-gray-400 font-medium">Active Recruiter Accounts</p>
        </div>

        {/* Card 2: ACTIVE JOBS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
            ACTIVE JOBS
          </p>
          <p className="text-3xl font-extrabold text-gray-900">
            {stats.activeJobs}
          </p>
          <p className="text-xs text-gray-400 font-medium">Published Openings</p>
        </div>

        {/* Card 3: APPLICATIONS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
            APPLICATIONS
          </p>
          <p className="text-3xl font-extrabold text-gray-900">
            {stats.applications}
          </p>
          <p className="text-xs text-gray-400 font-medium">Candidates Applied</p>
        </div>

        {/* Card 4: AVAILABLE CREDITS (Orange Highlight) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
            AVAILABLE CREDITS
          </p>
          <p className="text-3xl font-extrabold text-[#F97316]">
            {stats.availableCredits.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 font-medium">Org Credit Balance</p>
        </div>
      </div>

      {/* Dynamic Recent Recruiter & Admin Activities matching Image 5 */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-base text-gray-900 tracking-tight">
            Recent Admin & Recruiter Operations
          </h3>
          <span className="text-xs text-[#0052CC] font-bold">Live System Log</span>
        </div>

        <div className="space-y-3">
          {recentActivities.map((act: any, idx: number) => (
            <div
              key={act.id || idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-blue-50/40 transition text-xs"
            >
              <div>
                <p className="font-extrabold text-gray-900 leading-tight">
                  {act.title || act.action}
                </p>
                <p className="text-gray-600 font-medium mt-0.5">
                  {act.description || act.details}
                </p>
                <span className="text-[10px] text-gray-400 font-semibold block mt-1">
                  By {act.actorName || act.name} ({act.actorRole || act.roleTag || 'Org Admin'})
                </span>
              </div>
              <div className="mt-2 sm:mt-0 text-[11px] font-bold text-gray-400 flex items-center space-x-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
