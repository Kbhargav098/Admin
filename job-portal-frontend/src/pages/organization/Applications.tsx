import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart2,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  FileText,
  Filter,
  Kanban,
  List,
  Mail,
  MapPin,
  MessageSquare,
  MoveRight,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Tag,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';

interface ApplicationItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  headline: string;
  jobId: string;
  jobTitle: string;
  department: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  assignedRecruiterId: string;
  assignedRecruiterName: string;
  appliedDate: string;
  lastUpdated: string;
  progressScore: number; // 0-100%
  notes: Array<{ id: string; author: string; role: string; date: string; text: string }>;
  history: Array<{ id: string; fromStage: string; toStage: string; changedBy: string; timestamp: string; reason: string }>;
  recruiterActions: Array<{ id: string; action: string; recruiter: string; timestamp: string }>;
}

const STAGES: Array<'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected'> = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

import { addAuditLog } from './Audit';

export const Applications: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [recruiterFilter, setRecruiterFilter] = useState<string>('ALL');

  // Modals state
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [assignRecruiterApp, setAssignRecruiterApp] = useState<ApplicationItem | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Available recruiters list
  const recruitersList = [
    { id: 'rec-1', name: 'Elena Rostova', role: 'Tech Recruiter', activeCandidates: 4 },
    { id: 'rec-2', name: 'David Chen', role: 'HR Recruiter', activeCandidates: 3 },
    { id: 'rec-3', name: 'Sophia Martinez', role: 'Hiring Manager', activeCandidates: 1 },
  ];

  // Default Applications Dataset (Matching all organization job openings)
  const defaultApplications: ApplicationItem[] = [
    // Job 101: Senior Full Stack Engineer (5 Candidates)
    {
      id: 'app-101',
      candidateName: 'Bruce Wayne',
      candidateEmail: 'bruce.wayne@gothamtech.com',
      headline: 'Lead Full Stack Architect & Systems Engineer',
      jobId: 'job-101',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      status: 'Shortlisted',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-18',
      lastUpdated: '10 mins ago',
      progressScore: 45,
      notes: [
        { id: 'note-1', author: 'Elena Rostova', role: 'Tech Recruiter', date: '2026-02-19', text: 'Strong expertise in React, TypeScript & distributed engines. Recommended for Technical Interview.' },
      ],
      history: [
        { id: 'h-1', fromStage: 'Applied', toStage: 'Shortlisted', changedBy: 'Elena Rostova', timestamp: '2026-02-19 10:15 AM', reason: 'Passed initial resume screening' },
      ],
      recruiterActions: [
        { id: 'ra-1', action: 'Moved candidate to Shortlisted', recruiter: 'Elena Rostova', timestamp: 'Yesterday' },
      ],
    },
    {
      id: 'app-105',
      candidateName: 'Hal Jordan',
      candidateEmail: 'hal.jordan@coastcity.com',
      headline: 'Senior React & Node.js Developer',
      jobId: 'job-101',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      status: 'Applied',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-25',
      lastUpdated: '3 hours ago',
      progressScore: 15,
      notes: [],
      history: [],
      recruiterActions: [],
    },
    {
      id: 'app-106',
      candidateName: 'Peter Parker',
      candidateEmail: 'peter.p@dailybugle.io',
      headline: 'Full Stack TypeScript & GraphQL Engineer',
      jobId: 'job-101',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      status: 'Interview',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-20',
      lastUpdated: '1 day ago',
      progressScore: 65,
      notes: [
        { id: 'note-5', author: 'Elena Rostova', role: 'Tech Recruiter', date: '2026-02-22', text: 'Excellent problem solving skills. Passed live coding interview.' },
      ],
      history: [
        { id: 'h-6', fromStage: 'Shortlisted', toStage: 'Interview', changedBy: 'Elena Rostova', timestamp: '2026-02-22 03:00 PM', reason: 'Passed technical screening' },
      ],
      recruiterActions: [
        { id: 'ra-6', action: 'Scheduled System Design Round', recruiter: 'Elena Rostova', timestamp: '1 day ago' },
      ],
    },
    {
      id: 'app-107',
      candidateName: 'Tony Stark',
      candidateEmail: 'tony@starkind.com',
      headline: 'Principal Full Stack Systems Architect',
      jobId: 'job-101',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      status: 'Hired',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-01-15',
      lastUpdated: '1 week ago',
      progressScore: 100,
      notes: [],
      history: [],
      recruiterActions: [],
    },
    {
      id: 'app-108',
      candidateName: 'Natasha Romanoff',
      candidateEmail: 'natasha.r@avengers.org',
      headline: 'Senior Frontend & State Management Specialist',
      jobId: 'job-101',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      status: 'Offer',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-12',
      lastUpdated: '2 days ago',
      progressScore: 90,
      notes: [],
      history: [],
      recruiterActions: [],
    },

    // Job 102: Product Design Lead (3 Candidates)
    {
      id: 'app-103',
      candidateName: 'Diana Prince',
      candidateEmail: 'diana.prince@themyscira.design',
      headline: 'Staff UX/UI Designer & Design System Architect',
      jobId: 'job-102',
      jobTitle: 'Product Design Lead',
      department: 'Design',
      status: 'Offer',
      assignedRecruiterId: 'rec-2',
      assignedRecruiterName: 'David Chen',
      appliedDate: '2026-02-15',
      lastUpdated: '1 day ago',
      progressScore: 90,
      notes: [
        { id: 'note-3', author: 'David Chen', role: 'HR Recruiter', date: '2026-02-24', text: 'Offer letter extended. Candidate reviewing package.' },
      ],
      history: [
        { id: 'h-4', fromStage: 'Interview', toStage: 'Offer', changedBy: 'David Chen', timestamp: '2026-02-24 04:00 PM', reason: 'Passed final culture & portfolio round' },
      ],
      recruiterActions: [
        { id: 'ra-4', action: 'Extended Formal Offer Letter', recruiter: 'David Chen', timestamp: '1 day ago' },
      ],
    },
    {
      id: 'app-109',
      candidateName: 'Barbara Gordon',
      candidateEmail: 'barbara.g@oracle.design',
      headline: 'Lead UI/UX Systems Designer',
      jobId: 'job-102',
      jobTitle: 'Product Design Lead',
      department: 'Design',
      status: 'Shortlisted',
      assignedRecruiterId: 'rec-2',
      assignedRecruiterName: 'David Chen',
      appliedDate: '2026-02-21',
      lastUpdated: '4 hours ago',
      progressScore: 40,
      notes: [],
      history: [],
      recruiterActions: [],
    },
    {
      id: 'app-110',
      candidateName: 'Selina Kyle',
      candidateEmail: 'selina.k@gothamart.com',
      headline: 'Product Designer & User Researcher',
      jobId: 'job-102',
      jobTitle: 'Product Design Lead',
      department: 'Design',
      status: 'Applied',
      assignedRecruiterId: 'rec-2',
      assignedRecruiterName: 'David Chen',
      appliedDate: '2026-02-24',
      lastUpdated: 'Yesterday',
      progressScore: 10,
      notes: [],
      history: [],
      recruiterActions: [],
    },

    // Job 103: DevOps & Cloud Specialist (4 Candidates)
    {
      id: 'app-102',
      candidateName: 'Sarah Connor',
      candidateEmail: 'sarah.connor@cyberdyne.io',
      headline: 'Principal DevOps Engineer & Cloud Specialist',
      jobId: 'job-103',
      jobTitle: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      status: 'Interview',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-22',
      lastUpdated: '2 hours ago',
      progressScore: 65,
      notes: [
        { id: 'note-2', author: 'Marcus Vance', role: 'Org Admin', date: '2026-02-23', text: 'Approved for Technical Interview with Engineering Lead.' },
      ],
      history: [
        { id: 'h-2', fromStage: 'Applied', toStage: 'Shortlisted', changedBy: 'Elena Rostova', timestamp: '2026-02-22 02:30 PM', reason: 'Strong Kubernetes & AWS profile' },
      ],
      recruiterActions: [
        { id: 'ra-3', action: 'Scheduled Technical Round', recruiter: 'Elena Rostova', timestamp: '2 hours ago' },
      ],
    },
    {
      id: 'app-111',
      candidateName: 'Neo Anderson',
      candidateEmail: 'neo@matrix.io',
      headline: 'Staff Site Reliability & Cloud Infrastructure Lead',
      jobId: 'job-103',
      jobTitle: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      status: 'Hired',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2025-12-10',
      lastUpdated: '3 weeks ago',
      progressScore: 100,
      notes: [],
      history: [],
      recruiterActions: [],
    },
    {
      id: 'app-112',
      candidateName: 'Ellen Ripley',
      candidateEmail: 'ripley@weyland.com',
      headline: 'Kubernetes & CI/CD Security Specialist',
      jobId: 'job-103',
      jobTitle: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      status: 'Shortlisted',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-19',
      lastUpdated: '2 days ago',
      progressScore: 50,
      notes: [],
      history: [],
      recruiterActions: [],
    },
    {
      id: 'app-113',
      candidateName: 'John Wick',
      candidateEmail: 'john.wick@continental.com',
      headline: 'DevOps Security & Infrastructure Engineer',
      jobId: 'job-103',
      jobTitle: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      status: 'Applied',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      appliedDate: '2026-02-26',
      lastUpdated: '5 hours ago',
      progressScore: 15,
      notes: [],
      history: [],
      recruiterActions: [],
    },

    // Job 104: HR Talent Coordinator (2 Candidates)
    {
      id: 'app-104',
      candidateName: 'Clark Kent',
      candidateEmail: 'clark.k@metropolis.org',
      headline: 'Lead Talent Acquisition Coordinator',
      jobId: 'job-104',
      jobTitle: 'HR Talent Coordinator',
      department: 'Human Resources',
      status: 'Hired',
      assignedRecruiterId: 'rec-2',
      assignedRecruiterName: 'David Chen',
      appliedDate: '2026-01-10',
      lastUpdated: '5 days ago',
      progressScore: 100,
      notes: [
        { id: 'note-4', author: 'David Chen', role: 'HR Recruiter', date: '2026-02-01', text: 'Offer accepted. Joined on Feb 15.' },
      ],
      history: [
        { id: 'h-5', fromStage: 'Offer', toStage: 'Hired', changedBy: 'David Chen', timestamp: '2026-02-01 11:00 AM', reason: 'Offer accepted' },
      ],
      recruiterActions: [
        { id: 'ra-5', action: 'Marked as Hired & Onboarded', recruiter: 'David Chen', timestamp: '5 days ago' },
      ],
    },
    {
      id: 'app-114',
      candidateName: 'Lois Lane',
      candidateEmail: 'lois.l@dailyplanet.com',
      headline: 'Senior HR & Talent Operations Coordinator',
      jobId: 'job-104',
      jobTitle: 'HR Talent Coordinator',
      department: 'Human Resources',
      status: 'Shortlisted',
      assignedRecruiterId: 'rec-2',
      assignedRecruiterName: 'David Chen',
      appliedDate: '2026-02-23',
      lastUpdated: '1 day ago',
      progressScore: 45,
      notes: [],
      history: [],
      recruiterActions: [],
    },
  ];

  const [applicationsList, setApplicationsList] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_applications');
      return saved ? JSON.parse(saved) : defaultApplications;
    } catch (e) {
      return defaultApplications;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('clyptus_org_applications', JSON.stringify(applicationsList));
    } catch (e) {
      console.error(e);
    }
  }, [applicationsList]);
  const [selectedRecruiterToAssign, setSelectedRecruiterToAssign] = useState('rec-1');

  // Filtered Applications
  const filteredApps = applicationsList.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;
    const matchesRecruiter = recruiterFilter === 'ALL' || app.assignedRecruiterId === recruiterFilter;

    return matchesSearch && matchesStage && matchesRecruiter;
  });

  // Funnel calculations
  const totalAppsCount = applicationsList.length;
  const shortlistedCount = applicationsList.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Offer' || a.status === 'Hired').length;
  const interviewCount = applicationsList.filter((a) => a.status === 'Interview' || a.status === 'Offer' || a.status === 'Hired').length;
  const hiredCount = applicationsList.filter((a) => a.status === 'Hired').length;

  // Actions
  const handleMoveStage = (appId: string, newStage: 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected') => {
    const targetApp = applicationsList.find((a) => a.id === appId);
    setApplicationsList(
      applicationsList.map((app) => {
        if (app.id === appId) {
          const newHistoryItem = {
            id: `h-${Date.now()}`,
            fromStage: app.status,
            toStage: newStage,
            changedBy: 'Marcus Vance (Org Admin)',
            timestamp: new Date().toLocaleString(),
            reason: `Stage transition performed by Org Admin`,
          };
          const newRecruiterAction = {
            id: `ra-${Date.now()}`,
            action: `Moved stage from ${app.status} to ${newStage}`,
            recruiter: 'Marcus Vance (Org Admin)',
            timestamp: 'Just now',
          };
          return {
            ...app,
            status: newStage,
            lastUpdated: 'Just now',
            history: [newHistoryItem, ...app.history],
            recruiterActions: [newRecruiterAction, ...app.recruiterActions],
          };
        }
        return app;
      })
    );
    if (targetApp) {
      addAuditLog('ATS_TRANSITION', 'Candidate ATS Stage Advanced', `Moved candidate ${targetApp.candidateName} from "${targetApp.status}" to "${newStage}"`, { candidate: targetApp.candidateName, fromStage: targetApp.status, toStage: newStage });
    }
  };

  const handleSaveAssignRecruiter = () => {
    if (!assignRecruiterApp) return;
    const recruiter = recruitersList.find((r) => r.id === selectedRecruiterToAssign);

    setApplicationsList(
      applicationsList.map((app) => {
        if (app.id === assignRecruiterApp.id) {
          const actionLog = {
            id: `ra-${Date.now()}`,
            action: `Reassigned application owner to ${recruiter?.name}`,
            recruiter: 'Marcus Vance (Org Admin)',
            timestamp: 'Just now',
          };
          return {
            ...app,
            assignedRecruiterId: recruiter?.id || app.assignedRecruiterId,
            assignedRecruiterName: recruiter?.name || app.assignedRecruiterName,
            recruiterActions: [actionLog, ...app.recruiterActions],
          };
        }
        return app;
      })
    );
    addAuditLog('APPLICATION_CHANGE', 'Application Owner Reassigned', `Reassigned candidate ${assignRecruiterApp.candidateName} application to recruiter ${recruiter?.name}`, { candidate: assignRecruiterApp.candidateName, newRecruiter: recruiter?.name });
    setAssignRecruiterApp(null);
  };

  const handleAddNote = () => {
    if (!selectedApp || !newNoteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Marcus Vance',
      role: 'Org Admin',
      date: new Date().toISOString().split('T')[0],
      text: newNoteText,
    };

    const updatedApp = {
      ...selectedApp,
      notes: [newNote, ...selectedApp.notes],
    };

    setApplicationsList(
      applicationsList.map((app) => (app.id === selectedApp.id ? updatedApp : app))
    );
    addAuditLog('APPLICATION_CHANGE', 'Candidate Evaluation Note Added', `Added evaluation note for candidate ${selectedApp.candidateName}`, { candidate: selectedApp.candidateName, noteSnippet: newNoteText.substring(0, 50) });
    setSelectedApp(updatedApp);
    setNewNoteText('');
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Governance Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">ATS Pipeline & Application Governance</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100">
              ORG ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Monitor recruitment funnels, move candidates between permitted stages, reassign owners, review notes & track stage transitions.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-2 bg-gray-100/70 p-1 rounded-xl text-xs shrink-0">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
              viewMode === 'kanban'
                ? 'bg-white text-[#0052CC] shadow-xs'
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>ATS Kanban Pipeline</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
              viewMode === 'table'
                ? 'bg-white text-[#0052CC] shadow-xs'
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Applications List</span>
          </button>
        </div>
      </div>

      {/* Recruitment Funnel Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Applications</span>
          <p className="text-2xl font-extrabold text-[#0B192C]">{totalAppsCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">Across all requisitions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shortlisted Rate</span>
          <p className="text-2xl font-extrabold text-[#0052CC]">
            {Math.round((shortlistedCount / (totalAppsCount || 1)) * 100)}%
          </p>
          <span className="text-[10px] text-gray-400 font-medium">{shortlistedCount} candidates</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interviewing</span>
          <p className="text-2xl font-extrabold text-purple-700">{interviewCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">In technical rounds</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hired Candidates</span>
          <p className="text-2xl font-extrabold text-emerald-600">{hiredCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">Offers accepted</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, email or job title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1 text-gray-500 font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Stage:</span>
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700"
          >
            <option value="ALL">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex items-center space-x-1 text-gray-500 font-semibold shrink-0 ml-2">
            <span>Owner Recruiter:</span>
          </div>
          <select
            value={recruiterFilter}
            onChange={(e) => setRecruiterFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700"
          >
            <option value="ALL">All Recruiters</option>
            {recruitersList.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageApps = filteredApps.filter((app) => app.status === stage);
            return (
              <div key={stage} className="bg-white rounded-2xl border border-gray-200 p-3.5 flex flex-col min-w-[210px] shrink-0">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="font-extrabold text-xs text-gray-900">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] text-[10px] font-bold">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageApps.length === 0 ? (
                    <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center text-[10px] text-gray-400 font-medium">
                      No candidate in {stage}
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="bg-gray-50/80 hover:bg-blue-50/40 p-3.5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer transition space-y-2 group"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-extrabold text-xs text-gray-900 group-hover:text-[#0052CC] transition leading-tight">
                            {app.candidateName}
                          </p>
                        </div>
                        <p className="text-[11px] text-[#0052CC] font-bold truncate">
                          {app.jobTitle}
                        </p>

                        <div className="flex items-center space-x-1 text-[10px] text-gray-500 font-medium">
                          <UserCheck className="w-3 h-3 text-gray-400" />
                          <span>Owner: {app.assignedRecruiterName}</span>
                        </div>

                        {/* Stage transition select inside Kanban Card */}
                        <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={app.status}
                            onChange={(e: any) => handleMoveStage(app.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-gray-200 text-[10px] font-bold bg-white outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => {
                              setAssignRecruiterApp(app);
                              setSelectedRecruiterToAssign(app.assignedRecruiterId);
                            }}
                            title="Reassign Recruiter"
                            className="p-1 text-gray-400 hover:text-purple-600 rounded"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {filteredApps.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400 font-medium">
              No candidate applications match your search filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">CANDIDATE</th>
                    <th className="p-4">APPLIED REQUISITION</th>
                    <th className="p-4">PIPELINE STAGE</th>
                    <th className="p-4">OWNER RECRUITER</th>
                    <th className="p-4">APPLIED DATE</th>
                    <th className="p-4 pr-6 text-right">ORG ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/30 transition">
                      <td className="p-4 pl-6">
                        <p className="font-extrabold text-gray-900 leading-tight">{app.candidateName}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{app.candidateEmail}</p>
                      </td>
                      <td className="p-4 text-gray-800 font-bold">{app.jobTitle}</td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e: any) => handleMoveStage(app.id, e.target.value)}
                          className="px-2.5 py-1 rounded-xl border border-gray-200 text-[11px] font-bold bg-white outline-none text-[#0052CC]"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-700">{app.assignedRecruiterName}</span>
                      </td>
                      <td className="p-4 text-gray-400">{app.appliedDate}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setSelectedApp(app)}
                            title="Review Candidate Progress & Notes"
                            className="p-1.5 text-gray-500 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setAssignRecruiterApp(app);
                              setSelectedRecruiterToAssign(app.assignedRecruiterId);
                            }}
                            title="Reassign Recruiter"
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          >
                            <UserPlus className="w-4 h-4" />
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
      )}

      {/* 1. REVIEW CANDIDATE PROGRESS & ATS DRAWER MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full p-6 shadow-2xl border-l border-gray-200 overflow-y-auto text-xs">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-black text-lg text-gray-900">{selectedApp.candidateName}</h3>
                <p className="text-xs text-[#0052CC] font-bold">{selectedApp.jobTitle} ({selectedApp.department})</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Stage Transition Control */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Change ATS Pipeline Stage</span>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedApp.status}
                    onChange={(e: any) => {
                      handleMoveStage(selectedApp.id, e.target.value);
                      setSelectedApp({ ...selectedApp, status: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-white text-[#0052CC] outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress & Owner Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Recruiter Owner</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedApp.assignedRecruiterName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Pipeline Progress</span>
                  <p className="font-bold text-[#0052CC] mt-0.5">{selectedApp.progressScore}% Completed</p>
                </div>
              </div>

              {/* Candidate Notes Tab */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-2 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-[#0052CC]" />
                  <span>Interviewer & Recruiter Notes ({selectedApp.notes.length})</span>
                </h4>

                <div className="space-y-2 mb-3">
                  {selectedApp.notes.length === 0 ? (
                    <p className="text-gray-400 italic">No candidate notes added yet.</p>
                  ) : (
                    selectedApp.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-blue-50/40 rounded-2xl border border-blue-100 text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-900">{note.author} <span className="text-gray-400 font-normal">({note.role})</span></span>
                          <span className="text-[10px] text-gray-400">{note.date}</span>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an evaluation note or feedback..."
                    className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl outline-none font-medium"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] transition shadow-xs"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Track Stage Transitions & History */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-2 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#0052CC]" />
                  <span>Stage Transitions Audit History</span>
                </h4>
                <div className="space-y-2">
                  {selectedApp.history.length === 0 ? (
                    <p className="text-gray-400 italic">No transition history recorded yet.</p>
                  ) : (
                    selectedApp.history.map((h) => (
                      <div key={h.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
                        <div className="flex justify-between items-center font-bold text-gray-900">
                          <span>{h.fromStage} ➔ {h.toStage}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{h.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">Changed by {h.changedBy} • {h.reason}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recruiter Actions Log */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-2 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span>Monitored Recruiter Actions</span>
                </h4>
                <div className="space-y-2">
                  {selectedApp.recruiterActions.map((ra) => (
                    <div key={ra.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{ra.action}</p>
                        <span className="text-[10px] text-gray-400">{ra.recruiter}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{ra.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-gray-100 mt-6">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REASSIGN CANDIDATE APPLICATION TO RECRUITER MODAL */}
      {assignRecruiterApp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setAssignRecruiterApp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Reassign Candidate Application</h3>
                <p className="text-xs text-gray-500">Reassign {assignRecruiterApp.candidateName}</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <label className="block font-bold text-gray-700">Select Recruiter Owner:</label>
              {recruitersList.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    selectedRecruiterToAssign === r.id
                      ? 'bg-blue-50/60 border-[#0052CC] font-bold text-gray-900 shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="recruiterRadioApp"
                      checked={selectedRecruiterToAssign === r.id}
                      onChange={() => setSelectedRecruiterToAssign(r.id)}
                      className="w-4 h-4 text-[#0052CC]"
                    />
                    <div>
                      <p className="text-xs font-extrabold">{r.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{r.role} • {r.activeCandidates} Active Candidates</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAssignRecruiterApp(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignRecruiter}
                className="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
              >
                Reassign Owner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

