import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Users,
  Video,
  MapPin,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Edit3,
  RefreshCw,
  Eye,
  Star,
  UserPlus,
  Building,
  Briefcase,
  FileText,
  ChevronRight,
  ExternalLink,
  X,
  ShieldCheck,
  Check,
  Award,
} from 'lucide-react';

import { addAuditLog } from './Audit';

export interface Interviewer {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface InterviewItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  department: string;
  roundName: 'Screening' | 'Technical Round 1' | 'System Design' | 'Hiring Manager' | 'HR & Culture';
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  durationMinutes: number;
  format: 'Video Call' | 'In-Person' | 'Phone Screening';
  locationOrLink: string;
  assignedInterviewers: Interviewer[];
  notesOrInstructions: string;
  cancellationReason?: string;
  feedback?: {
    overallRating: number; // 1 to 5
    decision: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
    strengths: string[];
    weaknesses: string[];
    evaluationNotes: string;
    submittedBy: string;
    submittedAt: string;
    scoreBreakdown?: {
      technicalSkills: number;
      problemSolving: number;
      communication: number;
      cultureFit: number;
    };
  };
}

export const Interviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<string>('ALL');

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [rescheduleInterview, setRescheduleInterview] = useState<InterviewItem | null>(null);
  const [cancelInterview, setCancelInterview] = useState<InterviewItem | null>(null);
  const [assignInterviewerApp, setAssignInterviewerApp] = useState<InterviewItem | null>(null);
  const [viewFeedbackInterview, setViewFeedbackInterview] = useState<InterviewItem | null>(null);
  const [viewDetailsInterview, setViewDetailsInterview] = useState<InterviewItem | null>(null);

  // Form states for Schedule Interview
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateEmail, setNewCandidateEmail] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('Senior Full Stack Engineer');
  const [newRoundName, setNewRoundName] = useState<'Screening' | 'Technical Round 1' | 'System Design' | 'Hiring Manager' | 'HR & Culture'>('Technical Round 1');
  const [newDate, setNewDate] = useState('2026-03-02');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newDuration, setNewDuration] = useState(60);
  const [newFormat, setNewFormat] = useState<'Video Call' | 'In-Person' | 'Phone Screening'>('Video Call');
  const [newLink, setNewLink] = useState('https://meet.google.com/xyz-abc-def');
  const [newSelectedInterviewerIds, setNewSelectedInterviewerIds] = useState<string[]>(['int-1']);
  const [newNotes, setNewNotes] = useState('');

  // Form states for Reschedule
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleLink, setRescheduleLink] = useState('');

  // Form state for Cancel
  const [cancelReasonText, setCancelReasonText] = useState('');

  // Available Interviewers list
  const availableInterviewers: Interviewer[] = [
    { id: 'int-1', name: 'Elena Rostova', role: 'Tech Recruiter & Staff Engineer' },
    { id: 'int-2', name: 'David Chen', role: 'Lead HR Business Partner' },
    { id: 'int-3', name: 'Sophia Martinez', role: 'Engineering Director' },
    { id: 'int-4', name: 'Marcus Vance', role: 'Organization Admin' },
    { id: 'int-5', name: 'Alex Rivera', role: 'Principal Architect' },
  ];

  // Initial Mock Interviews Dataset
  const initialInterviews: InterviewItem[] = [
    {
      id: 'int-101',
      candidateName: 'Bruce Wayne',
      candidateEmail: 'bruce.wayne@gothamtech.com',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      roundName: 'Technical Round 1',
      status: 'Upcoming',
      date: '2026-03-01',
      time: '03:00 PM',
      durationMinutes: 60,
      format: 'Video Call',
      locationOrLink: 'https://meet.google.com/bru-tech-101',
      assignedInterviewers: [
        { id: 'int-1', name: 'Elena Rostova', role: 'Tech Recruiter' },
        { id: 'int-5', name: 'Alex Rivera', role: 'Principal Architect' },
      ],
      notesOrInstructions: 'Focus on React performance optimizations, TypeScript generics, and distributed cache invalidation strategies.',
    },
    {
      id: 'int-102',
      candidateName: 'Sarah Connor',
      candidateEmail: 'sarah.connor@cyberdyne.io',
      jobTitle: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      roundName: 'System Design',
      status: 'Upcoming',
      date: '2026-03-02',
      time: '10:30 AM',
      durationMinutes: 90,
      format: 'Video Call',
      locationOrLink: 'https://meet.google.com/sarah-sys-des',
      assignedInterviewers: [
        { id: 'int-3', name: 'Sophia Martinez', role: 'Engineering Director' },
      ],
      notesOrInstructions: 'System architecture review: Multi-region Kubernetes deployments, Terraform IaC, and zero-downtime failover.',
    },
    {
      id: 'int-103',
      candidateName: 'Diana Prince',
      candidateEmail: 'diana.prince@themyscira.design',
      jobTitle: 'Product Design Lead',
      department: 'Design',
      roundName: 'Hiring Manager',
      status: 'Completed',
      date: '2026-02-26',
      time: '02:00 PM',
      durationMinutes: 60,
      format: 'Video Call',
      locationOrLink: 'https://meet.google.com/diana-ux-lead',
      assignedInterviewers: [
        { id: 'int-2', name: 'David Chen', role: 'Lead HR Business Partner' },
        { id: 'int-4', name: 'Marcus Vance', role: 'Organization Admin' },
      ],
      notesOrInstructions: 'Portfolio deep dive & design system governance presentation.',
      feedback: {
        overallRating: 5,
        decision: 'Strong Hire',
        strengths: ['Exceptional design system architecture', 'Strong cross-functional leadership', 'Deep empathy for user workflows'],
        weaknesses: ['High compensation expectation'],
        evaluationNotes: 'Diana delivered an outstanding presentation on scaling design tokens across multi-brand applications. Unanimous Strong Hire recommendation.',
        submittedBy: 'David Chen (Lead HR)',
        submittedAt: '2026-02-26 04:15 PM',
        scoreBreakdown: {
          technicalSkills: 5,
          problemSolving: 5,
          communication: 5,
          cultureFit: 4.8,
        },
      },
    },
    {
      id: 'int-104',
      candidateName: 'Hal Jordan',
      candidateEmail: 'hal.jordan@coastcity.com',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      roundName: 'Screening',
      status: 'Rescheduled',
      date: '2026-03-05',
      time: '11:00 AM',
      durationMinutes: 30,
      format: 'Phone Screening',
      locationOrLink: '+1 (555) 234-5678',
      assignedInterviewers: [
        { id: 'int-1', name: 'Elena Rostova', role: 'Tech Recruiter' },
      ],
      notesOrInstructions: 'Initial recruiter fitment call & background verification.',
      cancellationReason: 'Rescheduled due to candidate personal emergency.',
    },
    {
      id: 'int-105',
      candidateName: 'Arthur Curry',
      candidateEmail: 'arthur.curry@atlantis.org',
      jobTitle: 'Database Performance Architect',
      department: 'Infrastructure',
      roundName: 'Technical Round 1',
      status: 'Cancelled',
      date: '2026-02-24',
      time: '04:00 PM',
      durationMinutes: 60,
      format: 'Video Call',
      locationOrLink: 'https://meet.google.com/arthur-db-arch',
      assignedInterviewers: [
        { id: 'int-5', name: 'Alex Rivera', role: 'Principal Architect' },
      ],
      notesOrInstructions: 'PostgreSQL indexing, query plan analysis, and sharding strategies.',
      cancellationReason: 'Candidate accepted another offer prior to interview date.',
    },
  ];

  const [interviewsList, setInterviewsList] = useState<InterviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_interviews');
      return saved ? JSON.parse(saved) : initialInterviews;
    } catch (e) {
      return initialInterviews;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('clyptus_org_interviews', JSON.stringify(interviewsList));
    } catch (e) {
      console.error(e);
    }
  }, [interviewsList]);

  // Statistics Calculations
  const totalInterviewsCount = interviewsList.length;
  const upcomingCount = interviewsList.filter((i) => i.status === 'Upcoming').length;
  const completedCount = interviewsList.filter((i) => i.status === 'Completed').length;
  const rescheduledCount = interviewsList.filter((i) => i.status === 'Rescheduled').length;

  // Filtered Interviews List
  const filteredInterviews = interviewsList.filter((item) => {
    // Tab Filter
    if (activeTab === 'UPCOMING' && item.status !== 'Upcoming') return false;
    if (activeTab === 'COMPLETED' && item.status !== 'Completed') return false;
    if (activeTab === 'RESCHEDULED' && item.status !== 'Rescheduled') return false;
    if (activeTab === 'CANCELLED' && item.status !== 'Cancelled') return false;

    // Round Filter
    if (selectedRoundFilter !== 'ALL' && item.roundName !== selectedRoundFilter) return false;

    // Search term filter
    const matchesSearch =
      item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignedInterviewers.some((int) => int.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Action Handlers
  const handleScheduleNewInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateEmail) return;

    const selectedInterviewers = availableInterviewers.filter((int) =>
      newSelectedInterviewerIds.includes(int.id)
    );

    const newInterview: InterviewItem = {
      id: `int-${Date.now()}`,
      candidateName: newCandidateName,
      candidateEmail: newCandidateEmail,
      jobTitle: newJobTitle,
      department: 'Engineering',
      roundName: newRoundName,
      status: 'Upcoming',
      date: newDate,
      time: newTime,
      durationMinutes: Number(newDuration),
      format: newFormat,
      locationOrLink: newLink,
      assignedInterviewers: selectedInterviewers.length > 0 ? selectedInterviewers : [availableInterviewers[0]],
      notesOrInstructions: newNotes || 'Standard evaluation format.',
    };

    setInterviewsList([newInterview, ...interviewsList]);
    addAuditLog('RECRUITER_ACTION', 'Interview Scheduled', `Scheduled ${newRoundName} interview for ${newCandidateName} on ${newDate} at ${newTime}`, { candidate: newCandidateName, roundName: newRoundName, date: newDate, time: newTime });
    setShowScheduleModal(false);
    resetScheduleForm();
  };

  const resetScheduleForm = () => {
    setNewCandidateName('');
    setNewCandidateEmail('');
    setNewJobTitle('Senior Full Stack Engineer');
    setNewRoundName('Technical Round 1');
    setNewDate('2026-03-02');
    setNewTime('02:00 PM');
    setNewDuration(60);
    setNewFormat('Video Call');
    setNewLink('https://meet.google.com/xyz-abc-def');
    setNewSelectedInterviewerIds(['int-1']);
    setNewNotes('');
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleInterview) return;

    setInterviewsList(
      interviewsList.map((item) => {
        if (item.id === rescheduleInterview.id) {
          return {
            ...item,
            status: 'Rescheduled',
            date: rescheduleDate || item.date,
            time: rescheduleTime || item.time,
            locationOrLink: rescheduleLink || item.locationOrLink,
            cancellationReason: `Rescheduled by Marcus Vance (Org Admin) on ${new Date().toLocaleDateString()}`,
          };
        }
        return item;
      })
    );
    addAuditLog('RECRUITER_ACTION', 'Interview Rescheduled', `Rescheduled interview for candidate ${rescheduleInterview.candidateName} to ${rescheduleDate} at ${rescheduleTime}`, { candidate: rescheduleInterview.candidateName, newDate: rescheduleDate, newTime: rescheduleTime });
    setRescheduleInterview(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelInterview) return;

    setInterviewsList(
      interviewsList.map((item) => {
        if (item.id === cancelInterview.id) {
          return {
            ...item,
            status: 'Cancelled',
            cancellationReason: cancelReasonText || 'Cancelled by Organization Admin.',
          };
        }
        return item;
      })
    );
    addAuditLog('RECRUITER_ACTION', 'Interview Cancelled', `Cancelled ${cancelInterview.roundName} interview for ${cancelInterview.candidateName}. Reason: ${cancelReasonText || 'Cancelled by Org Admin'}`, { candidate: cancelInterview.candidateName, reason: cancelReasonText });
    setCancelInterview(null);
    setCancelReasonText('');
  };

  const handleToggleInterviewerAssignment = (interviewerId: string) => {
    if (!assignInterviewerApp) return;

    const exists = assignInterviewerApp.assignedInterviewers.some((i) => i.id === interviewerId);
    let updatedInterviewers: Interviewer[];

    if (exists) {
      updatedInterviewers = assignInterviewerApp.assignedInterviewers.filter((i) => i.id !== interviewerId);
    } else {
      const target = availableInterviewers.find((i) => i.id === interviewerId);
      if (target) {
        updatedInterviewers = [...assignInterviewerApp.assignedInterviewers, target];
      } else {
        updatedInterviewers = assignInterviewerApp.assignedInterviewers;
      }
    }

    const updatedItem = { ...assignInterviewerApp, assignedInterviewers: updatedInterviewers };
    setAssignInterviewerApp(updatedItem);

    setInterviewsList(
      interviewsList.map((item) => (item.id === assignInterviewerApp.id ? updatedItem : item))
    );
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Header Banner & Oversee Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">Interview Oversight & Scheduling Center</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100 uppercase tracking-wider">
              ORG ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Schedule, reschedule, or cancel interviews, assign evaluation panelists, review interview feedback & track hiring pipeline rounds.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#0052CC] text-white font-bold text-xs rounded-xl hover:bg-[#0043A8] transition shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Interview</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Interviews</span>
            <Calendar className="w-4 h-4 text-[#0052CC]" />
          </div>
          <p className="text-2xl font-extrabold text-[#0B192C]">{totalInterviewsCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">All recorded rounds</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Upcoming Sessions</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0052CC]">{upcomingCount}</p>
          <span className="text-[10px] text-blue-600 font-bold">Scheduled & Pending</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed Rounds</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{completedCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">With submitted feedback</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rescheduled / Shifted</span>
            <RefreshCw className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{rescheduledCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">Updated timings</span>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Interviews', count: totalInterviewsCount },
            { id: 'UPCOMING', label: 'Upcoming', count: upcomingCount },
            { id: 'COMPLETED', label: 'Completed', count: completedCount },
            { id: 'RESCHEDULED', label: 'Rescheduled', count: rescheduledCount },
            { id: 'CANCELLED', label: 'Cancelled', count: interviewsList.filter((i) => i.status === 'Cancelled').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center space-x-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-blue-50 text-[#0052CC]' : 'bg-gray-200/60 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Round Filters */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate, job, interviewer..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium text-xs"
            />
          </div>

          <select
            value={selectedRoundFilter}
            onChange={(e) => setSelectedRoundFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700 text-xs shrink-0"
          >
            <option value="ALL">All Interview Rounds</option>
            <option value="Screening">Screening</option>
            <option value="Technical Round 1">Technical Round 1</option>
            <option value="System Design">System Design</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="HR & Culture">HR & Culture</option>
          </select>
        </div>
      </div>

      {/* Interviews Grid / List */}
      {filteredInterviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-400 font-medium">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-extrabold text-gray-600 text-sm">No interviews found</p>
          <p className="mt-1">No scheduled sessions match your current filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 relative group"
            >
              {/* Top Row: Round Badge & Status */}
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0052CC] font-extrabold text-[11px]">
                  {item.roundName}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center space-x-1 ${
                    item.status === 'Upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : item.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Rescheduled'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status === 'Upcoming' && <Clock className="w-3 h-3 mr-1" />}
                  {item.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {item.status === 'Rescheduled' && <RefreshCw className="w-3 h-3 mr-1" />}
                  {item.status === 'Cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                  <span>{item.status}</span>
                </span>
              </div>

              {/* Candidate & Job Information */}
              <div className="space-y-1">
                <h3 className="font-black text-sm text-gray-900 leading-tight">{item.candidateName}</h3>
                <p className="text-xs text-[#0052CC] font-bold">{item.jobTitle}</p>
                <p className="text-[11px] text-gray-400 font-medium">{item.candidateEmail}</p>
              </div>

              {/* Date, Time & Location / Format */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100 text-xs">
                <div className="flex items-center justify-between text-gray-700 font-bold">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0052CC]" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time} ({item.durationMinutes}m)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200/50">
                  <div className="flex items-center space-x-1.5 text-gray-600 font-semibold truncate">
                    {item.format === 'Video Call' ? (
                      <Video className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">{item.format}</span>
                  </div>

                  {item.locationOrLink.startsWith('http') ? (
                    <a
                      href={item.locationOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0052CC] font-bold hover:underline flex items-center space-x-1 text-[10px]"
                    >
                      <span>Join Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-500 text-[10px] font-mono">{item.locationOrLink}</span>
                  )}
                </div>
              </div>

              {/* Assigned Interview Panel */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                    Assigned Interviewers ({item.assignedInterviewers.length})
                  </span>
                  <button
                    onClick={() => setAssignInterviewerApp(item)}
                    className="text-[#0052CC] font-bold hover:underline text-[10px] flex items-center space-x-1"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Manage</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.assignedInterviewers.map((panelist) => (
                    <span
                      key={panelist.id}
                      className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 font-bold text-[10px] border border-gray-200 flex items-center space-x-1"
                    >
                      <User className="w-3 h-3 text-gray-400" />
                      <span>{panelist.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback Summary Badge if Completed */}
              {item.status === 'Completed' && item.feedback && (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-extrabold text-xs text-emerald-900 block leading-tight">
                        {item.feedback.decision} ({item.feedback.overallRating}/5 ★)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">By {item.feedback.submittedBy}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewFeedbackInterview(item)}
                    className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg hover:bg-emerald-700"
                  >
                    View Feedback
                  </button>
                </div>
              )}

              {/* Cancellation Reason if Cancelled or Rescheduled */}
              {item.cancellationReason && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 font-medium">
                  <span className="font-bold">Note:</span> {item.cancellationReason}
                </div>
              )}

              {/* Org Admin Actions Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewDetailsInterview(item)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg text-[11px] font-bold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setRescheduleInterview(item);
                      setRescheduleDate(item.date);
                      setRescheduleTime(item.time);
                      setRescheduleLink(item.locationOrLink);
                    }}
                    title="Reschedule Interview"
                    className="p-1.5 text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => {
                      setCancelInterview(item);
                      setCancelReasonText('');
                    }}
                    title="Cancel Interview"
                    className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. SCHEDULE NEW INTERVIEW MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Schedule Interview Session</h3>
                <p className="text-xs text-gray-500">Org Admin Direct Interview Assignment</p>
              </div>
            </div>

            <form onSubmit={handleScheduleNewInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="e.g. Clark Kent"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Candidate Email *</label>
                  <input
                    type="email"
                    required
                    value={newCandidateEmail}
                    onChange={(e) => setNewCandidateEmail(e.target.value)}
                    placeholder="clark@metropolis.org"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Job Title / Requisition</label>
                  <select
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-gray-50 outline-none"
                  >
                    <option value="Senior Full Stack Engineer">Senior Full Stack Engineer</option>
                    <option value="DevOps & Cloud Specialist">DevOps & Cloud Specialist</option>
                    <option value="Product Design Lead">Product Design Lead</option>
                    <option value="HR Talent Coordinator">HR Talent Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Interview Round</label>
                  <select
                    value={newRoundName}
                    onChange={(e: any) => setNewRoundName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-gray-50 outline-none text-[#0052CC]"
                  >
                    <option value="Screening">Screening</option>
                    <option value="Technical Round 1">Technical Round 1</option>
                    <option value="System Design">System Design</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="HR & Culture">HR & Culture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="02:00 PM"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e: any) => setNewFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-gray-50 outline-none"
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Phone Screening">Phone Screening</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Meeting Link or Location</label>
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assign Evaluation Panelists / Interviewers</label>
                <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-2xl p-3 bg-gray-50 max-h-36 overflow-y-auto">
                  {availableInterviewers.map((int) => {
                    const isChecked = newSelectedInterviewerIds.includes(int.id);
                    return (
                      <label
                        key={int.id}
                        className={`flex items-center space-x-2 p-2 rounded-xl cursor-pointer transition border text-[11px] ${
                          isChecked ? 'bg-blue-50 border-[#0052CC] font-bold text-gray-900' : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewSelectedInterviewerIds(newSelectedInterviewerIds.filter((id) => id !== int.id));
                            } else {
                              setNewSelectedInterviewerIds([...newSelectedInterviewerIds, int.id]);
                            }
                          }}
                          className="w-3.5 h-3.5 text-[#0052CC]"
                        />
                        <div className="truncate">
                          <p className="truncate font-extrabold">{int.name}</p>
                          <p className="text-[9px] text-gray-400 truncate">{int.role}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notes & Instructions for Panel</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key competencies to evaluate, code challenge topics, or preparation notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. RESCHEDULE INTERVIEW MODAL */}
      {rescheduleInterview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setRescheduleInterview(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Reschedule Interview</h3>
                <p className="text-xs text-gray-500">Update timing for {rescheduleInterview.candidateName}</p>
              </div>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">New Time</label>
                <input
                  type="text"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  placeholder="03:30 PM"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Meeting Link or Location</label>
                <input
                  type="text"
                  value={rescheduleLink}
                  onChange={(e) => setRescheduleLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRescheduleInterview(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-md"
                >
                  Save Rescheduled Timing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CANCEL INTERVIEW MODAL */}
      {cancelInterview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setCancelInterview(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Cancel Interview Session</h3>
                <p className="text-xs text-gray-500">Candidate: {cancelInterview.candidateName}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 font-medium">
                Are you sure you want to cancel the <span className="font-bold text-gray-900">{cancelInterview.roundName}</span> interview with <span className="font-bold text-gray-900">{cancelInterview.candidateName}</span>?
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason for Cancellation</label>
                <textarea
                  rows={3}
                  required
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                  placeholder="e.g. Candidate withdrew application, role filled internally, schedule conflict..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCancelInterview(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Keep Interview
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ASSIGN INTERVIEWERS PANEL MODAL */}
      {assignInterviewerApp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setAssignInterviewerApp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Manage Interview Panel</h3>
                <p className="text-xs text-gray-500">Assign or remove evaluation panelists</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <p className="font-bold text-gray-700">Select Interview Panelists for {assignInterviewerApp.candidateName}:</p>
              {availableInterviewers.map((int) => {
                const isAssigned = assignInterviewerApp.assignedInterviewers.some((i) => i.id === int.id);
                return (
                  <div
                    key={int.id}
                    onClick={() => handleToggleInterviewerAssignment(int.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                      isAssigned ? 'bg-blue-50/60 border-[#0052CC] font-bold text-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${isAssigned ? 'bg-[#0052CC] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {int.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold">{int.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{int.role}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isAssigned ? 'bg-blue-100 text-[#0052CC]' : 'bg-gray-100 text-gray-400'}`}>
                      {isAssigned ? 'Assigned' : 'Click to Add'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAssignInterviewerApp(null)}
                className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8]"
              >
                Done Managing Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW INTERVIEW FEEDBACK MODAL */}
      {viewFeedbackInterview && viewFeedbackInterview.feedback && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewFeedbackInterview(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Interviewer Feedback & Scorecard</h3>
                <p className="text-xs text-gray-500">Candidate: {viewFeedbackInterview.candidateName} ({viewFeedbackInterview.roundName})</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Overall Rating & Recommendation */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Hiring Recommendation</span>
                  <p className="text-lg font-black text-emerald-900">{viewFeedbackInterview.feedback.decision}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Overall Rating</span>
                  <div className="flex items-center space-x-1 text-amber-500 text-sm font-extrabold">
                    <span>{viewFeedbackInterview.feedback.overallRating} / 5</span>
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
              </div>

              {/* Score Breakdown if available */}
              {viewFeedbackInterview.feedback.scoreBreakdown && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <h4 className="font-extrabold text-gray-900 text-xs">Competency Scorecard Breakdown</h4>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Technical Competency</span>
                      <span className="font-bold text-[#0052CC]">{viewFeedbackInterview.feedback.scoreBreakdown.technicalSkills} / 5</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Problem Solving</span>
                      <span className="font-bold text-[#0052CC]">{viewFeedbackInterview.feedback.scoreBreakdown.problemSolving} / 5</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Communication</span>
                      <span className="font-bold text-[#0052CC]">{viewFeedbackInterview.feedback.scoreBreakdown.communication} / 5</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Culture Alignment</span>
                      <span className="font-bold text-[#0052CC]">{viewFeedbackInterview.feedback.scoreBreakdown.cultureFit} / 5</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Identified Strengths</span>
                  </span>
                  <ul className="list-disc list-inside text-gray-700 space-y-0.5 text-[11px] font-medium">
                    {viewFeedbackInterview.feedback.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Areas of Concern</span>
                  </span>
                  <ul className="list-disc list-inside text-gray-700 space-y-0.5 text-[11px] font-medium">
                    {viewFeedbackInterview.feedback.weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Evaluation Notes */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-1">Detailed Panel Evaluation Notes</h4>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 font-medium text-gray-700 leading-relaxed">
                  {viewFeedbackInterview.feedback.evaluationNotes}
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  Submitted by {viewFeedbackInterview.feedback.submittedBy} on {viewFeedbackInterview.feedback.submittedAt}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setViewFeedbackInterview(null)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Close Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW DETAILS MODAL */}
      {viewDetailsInterview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setViewDetailsInterview(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Interview Session Details</h3>
                <p className="text-xs text-gray-500">ID: {viewDetailsInterview.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-400 text-[10px] uppercase">Candidate</span>
                  <span className="font-extrabold text-gray-900">{viewDetailsInterview.candidateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-400 text-[10px] uppercase">Requisition</span>
                  <span className="font-bold text-[#0052CC]">{viewDetailsInterview.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-400 text-[10px] uppercase">Interview Round</span>
                  <span className="font-bold text-purple-700">{viewDetailsInterview.roundName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-400 text-[10px] uppercase">Status</span>
                  <span className="font-extrabold text-gray-900">{viewDetailsInterview.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-gray-900 mb-1">Panel Preparation Notes</h4>
                <p className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-gray-700 font-medium">
                  {viewDetailsInterview.notesOrInstructions}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setViewDetailsInterview(null)}
                  className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
