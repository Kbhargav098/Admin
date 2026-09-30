import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organisationApi } from '../../services/api/organisation.api';
import { tokensApi } from '../../services/api/tokens.api';
import { useAuthStore } from '../../store/auth.store';
import {
  Activity,
  Briefcase,
  CheckCircle,
  Coins,
  Edit2,
  Eye,
  FileText,
  Filter,
  Info,
  Mail,
  MoreVertical,
  PauseCircle,
  Phone,
  Plus,
  PlayCircle,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  X,
  Zap,
} from 'lucide-react';

interface Recruiter {
  id: string;
  userId: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  department?: string;
  role: string;
  recruiterType: 'HR_RECRUITER';
  status: 'ACTIVE' | 'SUSPENDED';
  tokenBalance: number;
  assignedJobsCount: number;
  assignedJobs: Array<{ id: string; title: string; department: string; status: string }>;
  workloadScore: number; // 0-100%
  joinDate: string;
  activities: Array<{ id: string; action: string; timestamp: string; details: string }>;
}

import { addAuditLog } from './Audit';

export const Members: React.FC = () => {
  const { organizationId, user } = useAuthStore();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'ORG_SUPER_ADMIN';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [profileModalRecruiter, setProfileModalRecruiter] = useState<Recruiter | null>(null);
  const [editModalRecruiter, setEditModalRecruiter] = useState<Recruiter | null>(null);
  const [assignJobsModalRecruiter, setAssignJobsModalRecruiter] = useState<Recruiter | null>(null);
  const [activityModalRecruiter, setActivityModalRecruiter] = useState<Recruiter | null>(null);
  const [allocateModalRecruiter, setAllocateModalRecruiter] = useState<Recruiter | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Talent Acquisition',
    recruiterType: 'HR_RECRUITER' as 'HR_RECRUITER',
    initialTokens: '100',
  });

  const [allocateAmount, setAllocateAmount] = useState('25');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // Available organisation jobs (loaded dynamically from Jobs section)
  const defaultAvailableJobs = [
    { id: 'job-101', title: 'Senior Full Stack Engineer', department: 'Engineering', status: 'PUBLISHED' },
    { id: 'job-102', title: 'Product Design Lead', department: 'Design', status: 'PUBLISHED' },
    { id: 'job-103', title: 'DevOps & Cloud Specialist', department: 'Infrastructure', status: 'CLOSED' },
    { id: 'job-104', title: 'HR Talent Coordinator', department: 'Human Resources', status: 'DRAFT' },
  ];

  const [availableJobsList, setAvailableJobsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_jobs');
      return saved ? JSON.parse(saved) : defaultAvailableJobs;
    } catch (e) {
      return defaultAvailableJobs;
    }
  });

  // Mock initial recruiters list if API data is loading or empty
  const defaultRecruiters: Recruiter[] = [
    {
      id: 'rec-1',
      userId: 'usr-1',
      name: 'Elena Rostova',
      email: 'elena.r@abctech.com',
      password: 'Elena@123',
      phone: '+1 (555) 234-5678',
      department: 'Tech Recruiting',
      role: 'RECRUITER',
      recruiterType: 'HR_RECRUITER',
      status: 'ACTIVE',
      tokenBalance: 250,
      assignedJobsCount: 4,
      assignedJobs: [
        { id: 'job-101', title: 'Senior Full Stack Engineer', department: 'Engineering', status: 'ACTIVE' },
        { id: 'job-103', title: 'DevOps & Cloud Specialist', department: 'Infrastructure', status: 'ACTIVE' },
      ],
      workloadScore: 82,
      joinDate: '2025-11-12',
      activities: [
        { id: 'act-1', action: 'Shortlisted Candidate', timestamp: '10 mins ago', details: 'Shortlisted Bruce Wayne for Senior Engineer' },
        { id: 'act-2', action: 'Scheduled Interview', timestamp: '2 hours ago', details: 'Set up Technical Round for Sarah Connor' },
        { id: 'act-3', action: 'Consumed Credits', timestamp: '1 day ago', details: 'Used 35 credits for AI Candidate Search' },
      ],
    },
    {
      id: 'rec-2',
      userId: 'usr-2',
      name: 'David Chen',
      email: 'david.c@abctech.com',
      password: 'David@123',
      phone: '+1 (555) 876-5432',
      department: 'HR & Operations',
      role: 'RECRUITER',
      recruiterType: 'HR_RECRUITER',
      status: 'ACTIVE',
      tokenBalance: 180,
      assignedJobsCount: 3,
      assignedJobs: [
        { id: 'job-102', title: 'Product Design Lead', department: 'Design', status: 'ACTIVE' },
        { id: 'job-104', title: 'HR Talent Coordinator', department: 'Human Resources', status: 'ACTIVE' },
      ],
      workloadScore: 65,
      joinDate: '2026-01-15',
      activities: [
        { id: 'act-4', action: 'Sent Offer Letter', timestamp: '1 hour ago', details: 'Sent offer to Candidate Diana Prince' },
        { id: 'act-5', action: 'Created Opening', timestamp: '3 days ago', details: 'Posted Product Design Lead opening' },
      ],
    },
    {
      id: 'rec-3',
      userId: 'usr-3',
      name: 'Sophia Martinez',
      email: 'sophia.m@abctech.com',
      password: 'Sophia@123',
      phone: '+1 (555) 345-6789',
      department: 'Engineering Leadership',
      role: 'RECRUITER',
      recruiterType: 'HR_RECRUITER',
      status: 'SUSPENDED',
      tokenBalance: 50,
      assignedJobsCount: 1,
      assignedJobs: [
        { id: 'job-105', title: 'Technical Recruiter', department: 'Talent Acquisition', status: 'ACTIVE' },
      ],
      workloadScore: 30,
      joinDate: '2025-08-20',
      activities: [
        { id: 'act-6', action: 'Account Suspended', timestamp: '5 days ago', details: 'Suspended by Organization Admin' },
      ],
    },
  ];

  const [recruiterList, setRecruiterList] = useState<Recruiter[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_recruiters');
      return saved ? JSON.parse(saved) : defaultRecruiters;
    } catch (e) {
      return defaultRecruiters;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('clyptus_org_recruiters', JSON.stringify(recruiterList));
    } catch (e) {
      console.error(e);
    }
  }, [recruiterList]);

  React.useEffect(() => {
    const handleStorage = () => {
      try {
        const savedJobs = localStorage.getItem('clyptus_org_jobs');
        if (savedJobs) setAvailableJobsList(JSON.parse(savedJobs));
        const savedRecruiters = localStorage.getItem('clyptus_org_recruiters');
        if (savedRecruiters) setRecruiterList(JSON.parse(savedRecruiters));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filtered recruiters
  const filteredRecruiters = recruiterList.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Dynamic live calculation of assigned jobs for any recruiter
  const getRecruiterAssignedJobs = (r: Recruiter) => {
    const matchedFromJobs = availableJobsList.filter(
      (j: any) => j.assignedRecruiterId === r.id || j.assignedRecruiterName === r.name
    );
    const combinedMap = new Map();
    matchedFromJobs.forEach((j: any) =>
      combinedMap.set(j.id, { id: j.id, title: j.title, department: j.department, status: j.status })
    );
    (r.assignedJobs || []).forEach((j: any) => {
      if (!combinedMap.has(j.id)) combinedMap.set(j.id, j);
    });
    return Array.from(combinedMap.values());
  };

  // Actions
  const handleAddRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    const initialTkn = Number(formData.initialTokens) || 100;
    const newRecruiter: Recruiter = {
      id: `rec-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password || 'Recruiter@123',
      phone: formData.phone || '+1 (555) 000-1122',
      department: formData.department,
      role: 'RECRUITER',
      recruiterType: formData.recruiterType,
      status: 'ACTIVE',
      tokenBalance: initialTkn,
      assignedJobsCount: 0,
      assignedJobs: [],
      workloadScore: 10,
      joinDate: new Date().toISOString().split('T')[0],
      activities: [
        { id: `act-${Date.now()}`, action: 'Account Created', timestamp: 'Just now', details: `Added by Organization Admin with assigned credentials & ${initialTkn} initial tokens` },
      ],
    };

    const updatedRecruiters = [newRecruiter, ...recruiterList];
    setRecruiterList(updatedRecruiters);
    localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));

    // Sync directly to clyptus_org_allocations for Billing.tsx (Token Allocation)
    try {
      const savedAllocations = localStorage.getItem('clyptus_org_allocations');
      const allocationsList = savedAllocations ? JSON.parse(savedAllocations) : [];
      const newAllocation = {
        id: newRecruiter.id,
        name: newRecruiter.name,
        email: newRecruiter.email,
        role: 'HR Recruiter',
        allocatedTokens: initialTkn,
        usedTokens: 0,
        lastAllocatedDate: newRecruiter.joinDate,
        status: initialTkn <= 25 ? 'Low Balance' : 'Active',
      };
      const updatedAllocations = [newAllocation, ...allocationsList.filter((a: any) => a.id !== newRecruiter.id && a.email.toLowerCase() !== newRecruiter.email.toLowerCase())];
      localStorage.setItem('clyptus_org_allocations', JSON.stringify(updatedAllocations));
    } catch (err) {
      console.error('Error syncing recruiter allocation:', err);
    }

    addAuditLog('RECRUITER_ACTION', 'Recruiter Added', `Added new recruiter ${formData.name} (${formData.recruiterType}) with login credentials`, { name: formData.name, email: formData.email });
    window.dispatchEvent(new Event('storage'));
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: 'Talent Acquisition',
      recruiterType: 'HR_RECRUITER',
      initialTokens: '100',
    });
  };

  const handleUpdateRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalRecruiter) return;

    const updatedRecruiters = recruiterList.map((r) =>
      r.id === editModalRecruiter.id
        ? {
            ...r,
            name: editModalRecruiter.name,
            email: editModalRecruiter.email,
            password: editModalRecruiter.password || r.password || 'Recruiter@123',
            phone: editModalRecruiter.phone,
            department: editModalRecruiter.department,
            recruiterType: editModalRecruiter.recruiterType,
          }
        : r
    );

    setRecruiterList(updatedRecruiters);
    localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));

    // Update in clyptus_org_allocations as well
    try {
      const savedAllocations = localStorage.getItem('clyptus_org_allocations');
      if (savedAllocations) {
        const allocationsList = JSON.parse(savedAllocations);
        const updatedAllocations = allocationsList.map((a: any) => {
          if (a.id === editModalRecruiter.id || a.email.toLowerCase() === editModalRecruiter.email.toLowerCase()) {
            return {
              ...a,
              name: editModalRecruiter.name,
              email: editModalRecruiter.email,
              role: 'HR Recruiter',
            };
          }
          return a;
        });
        localStorage.setItem('clyptus_org_allocations', JSON.stringify(updatedAllocations));
      }
    } catch (err) {}

    addAuditLog('RECRUITER_ACTION', 'Recruiter Information Updated', `Updated profile and contact information for ${editModalRecruiter.name}`, { id: editModalRecruiter.id, name: editModalRecruiter.name });
    window.dispatchEvent(new Event('storage'));
    setEditModalRecruiter(null);
  };

  const handleToggleSuspend = (id: string) => {
    const updatedRecruiters = recruiterList.map((r) => {
      if (r.id === id) {
        const newStatus: 'ACTIVE' | 'SUSPENDED' = r.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        const newActivity = {
          id: `act-${Date.now()}`,
          action: newStatus === 'SUSPENDED' ? 'Account Suspended' : 'Account Reactivated',
          timestamp: 'Just now',
          details: `Status changed to ${newStatus} by Org Admin`,
        };
        addAuditLog('RECRUITER_ACTION', `Recruiter Account ${newStatus === 'SUSPENDED' ? 'Suspended' : 'Reactivated'}`, `Changed recruiter account status of ${r.name} to ${newStatus}`, { recruiterId: r.id, recruiterName: r.name, newStatus });
        return {
          ...r,
          status: newStatus,
          activities: [newActivity, ...r.activities],
        };
      }
      return r;
    });

    setRecruiterList(updatedRecruiters);
    localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemoveRecruiter = (id: string) => {
    if (window.confirm('Are you sure you want to remove this recruiter from your organization?')) {
      const updatedRecruiters = recruiterList.filter((r) => r.id !== id);
      setRecruiterList(updatedRecruiters);
      localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));

      try {
        const savedAllocations = localStorage.getItem('clyptus_org_allocations');
        if (savedAllocations) {
          const allocationsList = JSON.parse(savedAllocations);
          const updatedAllocations = allocationsList.filter((a: any) => a.id !== id);
          localStorage.setItem('clyptus_org_allocations', JSON.stringify(updatedAllocations));
        }
      } catch (err) {}

      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleSaveAssignedJobs = () => {
    if (!assignJobsModalRecruiter) return;
    const newAssignedJobs = availableJobsList.filter((j) => selectedJobIds.includes(j.id));

    // 1. Update recruiterList in state and localStorage
    const updatedRecruiters = recruiterList.map((r) => {
      if (r.id === assignJobsModalRecruiter.id) {
        const updatedActivity = {
          id: `act-${Date.now()}`,
          action: 'Assigned Jobs Updated',
          timestamp: 'Just now',
          details: `Assigned ${newAssignedJobs.length} openings: ${newAssignedJobs.map((j) => j.title).join(', ')}`,
        };
        return {
          ...r,
          assignedJobs: newAssignedJobs,
          assignedJobsCount: newAssignedJobs.length,
          workloadScore: Math.min(100, newAssignedJobs.length * 25),
          activities: [updatedActivity, ...r.activities],
        };
      }
      return r;
    });

    setRecruiterList(updatedRecruiters);
    localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));

    // 2. Sync job assignment into clyptus_org_jobs for Jobs.tsx
    try {
      const savedJobsStr = localStorage.getItem('clyptus_org_jobs');
      if (savedJobsStr) {
        const jobsArr = JSON.parse(savedJobsStr);
        const updatedJobs = jobsArr.map((j: any) => {
          if (selectedJobIds.includes(j.id)) {
            return {
              ...j,
              assignedRecruiterId: assignJobsModalRecruiter.id,
              assignedRecruiterName: assignJobsModalRecruiter.name,
            };
          } else if (j.assignedRecruiterId === assignJobsModalRecruiter.id || j.assignedRecruiterName === assignJobsModalRecruiter.name) {
            return {
              ...j,
              assignedRecruiterId: undefined,
              assignedRecruiterName: 'Unassigned',
            };
          }
          return j;
        });
        localStorage.setItem('clyptus_org_jobs', JSON.stringify(updatedJobs));
      }
    } catch (e) {
      console.error('Failed to sync recruiter assignment into clyptus_org_jobs:', e);
    }

    addAuditLog('PERMISSION_CHANGE', 'Recruiter Job Assignments Updated', `Assigned ${newAssignedJobs.length} openings to recruiter ${assignJobsModalRecruiter.name}`, { recruiterName: assignJobsModalRecruiter.name, assignedCount: newAssignedJobs.length });
    window.dispatchEvent(new Event('storage'));
    setAssignJobsModalRecruiter(null);
  };


  const handleAllocateTokensSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateModalRecruiter) return;
    const amount = Number(allocateAmount);

    setRecruiterList((prevList) =>
      prevList.map((r) => {
        if (r.id === allocateModalRecruiter.id) {
          return {
            ...r,
            tokenBalance: r.tokenBalance + amount,
          };
        }
        return r;
      })
    );

    // 1. Sync allocations list for Billing.tsx
    try {
      const savedAllocations = localStorage.getItem('clyptus_org_allocations');
      const allocations = savedAllocations ? JSON.parse(savedAllocations) : [];
      const updatedAllocations = allocations.map((a: any) => {
        if (a.id === allocateModalRecruiter.id || a.email === allocateModalRecruiter.email) {
          return { ...a, allocatedTokens: (a.allocatedTokens || 0) + amount };
        }
        return a;
      });
      localStorage.setItem('clyptus_org_allocations', JSON.stringify(updatedAllocations));
    } catch (e) {}

    // 2. Add Audit Log to Audit.tsx
    addAuditLog('TOKEN_ALLOCATION', 'Token Quota Allocated', `Allocated +${amount} hiring tokens to recruiter ${allocateModalRecruiter.name}`, { recipient: allocateModalRecruiter.name, amount });

    // 3. Add to Consumption Audit Logs for Billing.tsx
    try {
      const savedLogs = localStorage.getItem('clyptus_org_consumption_logs');
      const logs = savedLogs ? JSON.parse(savedLogs) : [];
      const newLog = {
        id: `tx-${Date.now()}`,
        recruiterName: allocateModalRecruiter.name,
        action: `Quota Allocation (+${amount} Tokens)`,
        tokensSpent: -amount,
        targetRef: 'Org Admin Distribution',
        timestamp: 'Just now',
      };
      localStorage.setItem('clyptus_org_consumption_logs', JSON.stringify([newLog, ...logs]));
    } catch (e) {}

    window.dispatchEvent(new Event('storage'));
    setAllocateModalRecruiter(null);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">Recruiter Governance Center</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100">
              ORG ADMIN ACCESS
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage recruiter profiles, update access status, assign jobs, monitor workload & view audit activities.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#0052CC] text-white text-xs font-bold rounded-xl hover:bg-[#0043A8] transition shadow-md flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Recruiter</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by recruiter name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1.5 text-gray-500 font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Recruiters List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredRecruiters.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 font-medium">
            No recruiters match your search filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">RECRUITER</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">WORKLOAD & JOBS</th>
                  <th className="p-4">CREDIT BAL.</th>
                  <th className="p-4 pr-6 text-right">ORG ADMIN ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredRecruiters.map((r) => (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition">
                    {/* Name & Email */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900 leading-tight">{r.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{r.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          r.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        <span>{r.status}</span>
                      </span>
                    </td>

                    {/* Workload Progress & Assigned Jobs */}
                    {(() => {
                      const liveJobs = getRecruiterAssignedJobs(r);
                      const count = liveJobs.length;
                      const score = Math.min(100, count * 25);
                      return (
                        <td className="p-4 min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-gray-700">{count} Openings</span>
                            <span className="text-gray-400">{score}% Load</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score > 75
                                  ? 'bg-rose-500'
                                  : score > 40
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </td>
                      );
                    })()}

                    {/* Token Balance */}
                    <td className="p-4">
                      <span className="font-extrabold text-[#0052CC] text-xs">
                        {r.tokenBalance} credits
                      </span>
                    </td>

                    {/* Actions dropdown/buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* View Profile */}
                        <button
                          onClick={() => setProfileModalRecruiter(r)}
                          title="View Profile"
                          className="p-1.5 text-gray-500 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Info */}
                        <button
                          onClick={() => setEditModalRecruiter(r)}
                          title="Update Information"
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Assign Jobs & Workload */}
                        <button
                          onClick={() => {
                            setAssignJobsModalRecruiter(r);
                            const currentAssigned = getRecruiterAssignedJobs(r);
                            setSelectedJobIds(currentAssigned.map((j: any) => j.id));
                          }}
                          title="Assign Jobs & Workload"
                          className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        >
                          <Briefcase className="w-4 h-4" />
                        </button>

                        {/* View Activities */}
                        <button
                          onClick={() => setActivityModalRecruiter(r)}
                          title="View Recruiter Activities"
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Activity className="w-4 h-4" />
                        </button>

                        {/* Suspend / Reactivate */}
                        <button
                          onClick={() => handleToggleSuspend(r.id)}
                          title={r.status === 'ACTIVE' ? 'Suspend Recruiter' : 'Reactivate Recruiter'}
                          className={`p-1.5 rounded-lg transition ${
                            r.status === 'ACTIVE'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {r.status === 'ACTIVE' ? (
                            <PauseCircle className="w-4 h-4" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveRecruiter(r.id)}
                          title="Remove Recruiter"
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. ADD RECRUITER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Add New Recruiter</h3>
                <p className="text-xs text-gray-500">Create recruiter account & allocate privileges</p>
              </div>
            </div>

            <form onSubmit={handleAddRecruiter} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address (Mail ID) *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah.c@company.com"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assign Login Password *</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="e.g. Sarah@1234"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium bg-blue-50/30 text-gray-900 font-mono"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">This password will be assigned to the recruiter for logging into their account.</p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Initial Credit Quota</label>
                <input
                  type="number"
                  value={formData.initialTokens}
                  onChange={(e) => setFormData({ ...formData, initialTokens: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl outline-none font-bold text-[#0052CC]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
                >
                  Add Recruiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW PROFILE MODAL */}
      {profileModalRecruiter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setProfileModalRecruiter(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#0052CC] text-white flex items-center justify-center font-black text-xl shadow-md">
                {profileModalRecruiter.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900">{profileModalRecruiter.name}</h3>
                <p className="text-xs text-gray-500 font-medium">{profileModalRecruiter.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-blue-50 text-[#0052CC] font-bold text-[10px] uppercase">
                  {profileModalRecruiter.recruiterType.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Assigned Login Credentials Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#0052CC] uppercase tracking-wider">Assigned Recruiter Login Credentials</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-[#0052CC] font-extrabold text-[9px] rounded-full uppercase">
                    Recruiter Login Info
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#0052CC] shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Mail ID</p>
                      <p className="font-bold text-gray-900 truncate" title={profileModalRecruiter.email}>
                        {profileModalRecruiter.email}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#0052CC] shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Assigned Password</p>
                      <p className="font-extrabold text-[#0052CC] font-mono text-xs">
                        {profileModalRecruiter.password || 'Recruiter@123'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                  <p className="font-bold text-gray-900 mt-0.5">{profileModalRecruiter.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                  <p className="font-bold text-gray-900 mt-0.5">{profileModalRecruiter.status}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Token Quota</span>
                  <p className="font-bold text-[#0052CC] mt-0.5">{profileModalRecruiter.tokenBalance} credits</p>
                </div>
              </div>

              {(() => {
                const modalJobs = getRecruiterAssignedJobs(profileModalRecruiter);
                return (
                  <div>
                    <h4 className="font-extrabold text-gray-900 mb-2">Assigned Job Openings ({modalJobs.length})</h4>
                    {modalJobs.length === 0 ? (
                      <p className="text-gray-400 text-xs italic">No jobs assigned yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {modalJobs.map((j: any) => (
                          <div key={j.id} className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-gray-900">{j.title}</p>
                              <span className="text-[10px] text-gray-400">{j.department}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              {j.status || 'ACTIVE'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-5 border-t border-gray-100 mt-6">
              <button
                onClick={() => setProfileModalRecruiter(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. UPDATE RECRUITER INFORMATION MODAL */}
      {editModalRecruiter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setEditModalRecruiter(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-gray-900 mb-4">Update Recruiter Information</h3>

            <form onSubmit={handleUpdateRecruiter} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editModalRecruiter.name}
                  onChange={(e) => setEditModalRecruiter({ ...editModalRecruiter, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editModalRecruiter.email}
                  onChange={(e) => setEditModalRecruiter({ ...editModalRecruiter, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Password</label>
                <input
                  type="text"
                  value={editModalRecruiter.password || ''}
                  onChange={(e) => setEditModalRecruiter({ ...editModalRecruiter, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-mono font-bold text-[#0052CC]"
                  placeholder="Enter login password"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editModalRecruiter.phone || ''}
                  onChange={(e) => setEditModalRecruiter({ ...editModalRecruiter, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalRecruiter(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ASSIGN JOBS & VIEW WORKLOAD MODAL */}
      {assignJobsModalRecruiter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setAssignJobsModalRecruiter(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Assign Jobs & Workload</h3>
                <p className="text-xs text-gray-500">Manage active openings for {assignJobsModalRecruiter.name}</p>
              </div>
            </div>

            {/* Current Workload summary */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 mb-4 space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-purple-900">Current Workload Score:</span>
                <span className="text-purple-700">{selectedJobIds.length * 25}%</span>
              </div>
              <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, selectedJobIds.length * 25)}%` }}
                ></div>
              </div>
            </div>

            <h4 className="font-extrabold text-gray-900 mb-2">Select Openings to Assign:</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {availableJobsList.map((job) => {
                const isSelected = selectedJobIds.includes(job.id);
                return (
                  <label
                    key={job.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/50 border-[#0052CC] font-bold text-gray-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJobIds([...selectedJobIds, job.id]);
                          } else {
                            setSelectedJobIds(selectedJobIds.filter((id) => id !== job.id));
                          }
                        }}
                        className="w-4 h-4 text-[#0052CC] rounded focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-extrabold">{job.title}</p>
                        <span className="text-[10px] text-gray-400">{job.department}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end space-x-2 pt-5 border-t border-gray-100 mt-5">
              <button
                type="button"
                onClick={() => setAssignJobsModalRecruiter(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignedJobs}
                className="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
              >
                Update Job Assignments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW RECRUITER ACTIVITIES MODAL */}
      {activityModalRecruiter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setActivityModalRecruiter(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Recruiter Activity Audit Log</h3>
                <p className="text-xs text-gray-500">Live activity trail for {activityModalRecruiter.name}</p>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activityModalRecruiter.activities.map((act) => (
                <div key={act.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-gray-900">{act.action}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{act.details}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-5 border-t border-gray-100 mt-5">
              <button
                onClick={() => setActivityModalRecruiter(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

