import React, { useState } from 'react';
import {
  ArrowLeft,
  BarChart2,
  Bold,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  HelpCircle,
  Italic,
  Layers,
  List,
  ListOrdered,
  MapPin,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Underline,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';

interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requiredSkills?: string[];
  status: 'PUBLISHED' | 'CLOSED' | 'DRAFT';
  assignedRecruiterId?: string;
  assignedRecruiterName?: string;
  applicationsCount: number;
  createdAt: string;
  analytics: {
    applied: number;
    shortlisted: number;
    interview: number;
    offered: number;
    hired: number;
    timeToFillDays: number;
    conversionRate: number;
  };
}

import { addAuditLog } from './Audit';

export const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editJobItem, setEditJobItem] = useState<JobItem | null>(null);
  const [assignRecruiterJob, setAssignRecruiterJob] = useState<JobItem | null>(null);
  const [analysisJob, setAnalysisJob] = useState<JobItem | null>(null);

  // Available Recruiters list for assignment (loaded dynamically from Members section)
  const defaultRecruiters = [
    { id: 'rec-1', name: 'Elena Rostova', role: 'Tech Recruiter', email: 'elena.r@abctech.com' },
    { id: 'rec-2', name: 'David Chen', role: 'HR Recruiter', email: 'david.c@abctech.com' },
    { id: 'rec-3', name: 'Sophia Martinez', role: 'Hiring Manager', email: 'sophia.m@abctech.com' },
  ];

  const [recruitersList, setRecruitersList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_recruiters');
      return saved ? JSON.parse(saved) : defaultRecruiters;
    } catch (e) {
      return defaultRecruiters;
    }
  });

  // Default Jobs list
  const defaultJobs: JobItem[] = [
    {
      id: 'job-101',
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time',
      salaryMin: 140000,
      salaryMax: 180000,
      description: 'We are seeking an experienced Full Stack Engineer proficient in React, Node.js, and cloud architecture.',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
      status: 'PUBLISHED',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      applicationsCount: 5,
      createdAt: '2026-02-10',
      analytics: {
        applied: 5,
        shortlisted: 1,
        interview: 1,
        offered: 1,
        hired: 1,
        timeToFillDays: 18,
        conversionRate: 20.0,
      },
    },
    {
      id: 'job-102',
      title: 'Product Design Lead',
      department: 'Design',
      location: 'New York, NY (On-site)',
      employmentType: 'Full-time',
      salaryMin: 130000,
      salaryMax: 165000,
      description: 'Lead design systems and user experience research across web and mobile enterprise platforms.',
      requiredSkills: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
      status: 'PUBLISHED',
      assignedRecruiterId: 'rec-2',
      assignedRecruiterName: 'David Chen',
      applicationsCount: 3,
      createdAt: '2026-02-14',
      analytics: {
        applied: 3,
        shortlisted: 1,
        interview: 0,
        offered: 1,
        hired: 0,
        timeToFillDays: 22,
        conversionRate: 33.3,
      },
    },
    {
      id: 'job-103',
      title: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      location: 'Remote',
      employmentType: 'Contract',
      salaryMin: 120000,
      salaryMax: 150000,
      description: 'Manage AWS infrastructure, Kubernetes deployments, CI/CD pipelines, and observability.',
      requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
      status: 'CLOSED',
      assignedRecruiterId: 'rec-1',
      assignedRecruiterName: 'Elena Rostova',
      applicationsCount: 4,
      createdAt: '2025-12-01',
      analytics: {
        applied: 4,
        shortlisted: 1,
        interview: 1,
        offered: 0,
        hired: 1,
        timeToFillDays: 14,
        conversionRate: 25.0,
      },
    },
    {
      id: 'job-104',
      title: 'HR Talent Coordinator',
      department: 'Human Resources',
      location: 'Austin, TX',
      employmentType: 'Full-time',
      salaryMin: 75000,
      salaryMax: 95000,
      description: 'Coordinate talent acquisition pipelines, schedule interviews, and manage candidate communications.',
      requiredSkills: ['Sourcing', 'ATS', 'Interview Scheduling', 'Communication'],
      status: 'DRAFT',
      assignedRecruiterId: undefined,
      assignedRecruiterName: 'Unassigned',
      applicationsCount: 2,
      createdAt: '2026-03-01',
      analytics: {
        applied: 2,
        shortlisted: 1,
        interview: 0,
        offered: 0,
        hired: 1,
        timeToFillDays: 12,
        conversionRate: 50.0,
      },
    },
  ];

  const [jobsList, setJobsList] = useState<JobItem[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_jobs');
      return saved ? JSON.parse(saved) : defaultJobs;
    } catch (e) {
      return defaultJobs;
    }
  });

  const [allApplications, setAllApplications] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_applications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('clyptus_org_jobs', JSON.stringify(jobsList));
    } catch (e) {
      console.error(e);
    }
  }, [jobsList]);

  React.useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('clyptus_org_applications');
        if (saved) setAllApplications(JSON.parse(saved));
        const savedJobs = localStorage.getItem('clyptus_org_jobs');
        if (savedJobs) setJobsList(JSON.parse(savedJobs));
        const savedRecruiters = localStorage.getItem('clyptus_org_recruiters');
        if (savedRecruiters) setRecruitersList(JSON.parse(savedRecruiters));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Compute live dynamic stats from clyptus_org_applications
  const getDynamicJobStats = (job: JobItem) => {
    const matching = allApplications.filter(
      (a: any) => a.jobId === job.id || a.jobTitle?.toLowerCase() === job.title.toLowerCase()
    );

    if (allApplications.length === 0 || matching.length === 0) {
      return {
        applied: job.applicationsCount || job.analytics.applied || 0,
        shortlisted: job.analytics.shortlisted || 0,
        interview: job.analytics.interview || 0,
        offered: job.analytics.offered || 0,
        hired: job.analytics.hired || 0,
        timeToFillDays: job.analytics.timeToFillDays || 14,
        conversionRate: job.analytics.conversionRate || 0,
      };
    }

    const applied = matching.length;
    const shortlisted = matching.filter((a: any) => a.status === 'Shortlisted').length;
    const interview = matching.filter((a: any) => a.status === 'Interview').length;
    const offered = matching.filter((a: any) => a.status === 'Offer').length;
    const hired = matching.filter((a: any) => a.status === 'Hired').length;
    const conversionRate = applied > 0 ? Math.round((hired / applied) * 100 * 10) / 10 : 0;

    return {
      applied,
      shortlisted,
      interview,
      offered,
      hired,
      timeToFillDays: job.analytics.timeToFillDays || 14,
      conversionRate,
    };
  };

  // Comprehensive Form State matching User Screenshots 1 & 2
  const [formData, setFormData] = useState({
    title: '',
    referenceCode: '',
    showRefCodeInput: false,
    postingCategory: 'Permanent' as 'Permanent' | 'Contract' | 'Walk-in',
    workType: 'Full time' as 'Full time' | 'Part time',
    scheduleType: 'Post now' as 'Post now' | 'Choose a date',
    expiryDate: '29-11-2026',
    experienceType: 'Experienced only' as 'Fresher only' | 'Experienced only',
    minExperience: '2 Years',
    maxExperience: '6 Years',
    department: 'Engineering',
    workMode: 'On-site' as 'On-site' | 'Hybrid' | 'Remote',
    location: 'Bangalore, Karnataka',
    salaryMin: '₹ 8 Lakhs',
    salaryMax: '₹ 15 Lakhs',
    perks: 'Cab Services, Paternity leave, Health Insurance, Annual Bonus',
    industry: 'IT Software & Services',
    functionRole: 'Software Engineering - Frontend',
    education: 'B.E / B.Tech (CS / IT / ECE)',
    description: '',
    skillsTags: ['React', 'TypeScript'] as string[],
    skillInputText: '',
    assignedRecruiterId: 'rec-1',
    isGeneratingAi: false,
  });

  const [selectedRecruiterForAssign, setSelectedRecruiterForAssign] = useState('rec-1');

  // AI Content Generator Simulation
  const handleGenerateAi = () => {
    setFormData((prev) => ({ ...prev, isGeneratingAi: true }));
    setTimeout(() => {
      const jobTitle = formData.title || 'Senior Frontend Engineer';
      setFormData((prev) => ({
        ...prev,
        isGeneratingAi: false,
        description: `Outlines the roles and responsibilities the candidate will perform in this role as a ${jobTitle}:\n\n- Design and construct responsive, high-performance web applications using React, TypeScript, and modern CSS architecture.\n- Collaborate closely with product managers, UX designers, and backend engineering teams to deliver seamless user experiences.\n- Optimize web application frontend performance, accessibility (WCAG), and cross-browser compatibility.\n- Implement reusable component libraries and robust unit/integration tests.`,
        skillsTags: Array.from(new Set([...prev.skillsTags, 'React', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST APIs', 'GraphQL'])),
      }));
    }, 450);
  };

  // Skill Tags handlers
  const handleAddSkillTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.skillsTags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skillsTags: [...prev.skillsTags, trimmed],
        skillInputText: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, skillInputText: '' }));
    }
  };

  const handleRemoveSkillTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsTags: prev.skillsTags.filter((t) => t !== tagToRemove),
    }));
  };

  // Filtered jobs
  const filteredJobs = jobsList.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || j.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Actions
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedRecruiter = recruitersList.find((r) => r.id === formData.assignedRecruiterId);

    const finalSkills = formData.skillsTags.length > 0
      ? formData.skillsTags
      : ['React', 'TypeScript'];

    const newJob: JobItem = {
      id: `job-${Date.now()}`,
      title: formData.title || 'Senior Frontend Engineer',
      department: formData.department || 'Engineering',
      location: `${formData.location} (${formData.workMode})`,
      employmentType: `${formData.postingCategory} • ${formData.workType}`,
      salaryMin: 800000,
      salaryMax: 1500000,
      description: formData.description || 'Job description outlines roles and responsibilities.',
      requiredSkills: finalSkills,
      status: 'PUBLISHED',
      assignedRecruiterId: assignedRecruiter?.id,
      assignedRecruiterName: assignedRecruiter?.name || 'Unassigned',
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      analytics: {
        applied: 0,
        shortlisted: 0,
        interview: 0,
        offered: 0,
        hired: 0,
        timeToFillDays: 0,
        conversionRate: 0,
      },
    };

    const updatedJobsList = [newJob, ...jobsList];
    setJobsList(updatedJobsList);
    localStorage.setItem('clyptus_org_jobs', JSON.stringify(updatedJobsList));

    // Sync newly created job to assigned recruiter in clyptus_org_recruiters
    if (assignedRecruiter) {
      try {
        const savedRecruitersStr = localStorage.getItem('clyptus_org_recruiters');
        if (savedRecruitersStr) {
          const recruitersArr = JSON.parse(savedRecruitersStr);
          const targetJobItem = {
            id: newJob.id,
            title: newJob.title,
            department: newJob.department,
            status: newJob.status,
          };

          const updatedRecruiters = recruitersArr.map((r: any) => {
            if (r.id === assignedRecruiter.id || r.name === assignedRecruiter.name) {
              const currentAssigned: any[] = r.assignedJobs || [];
              const exists = currentAssigned.some((j: any) => j.id === newJob.id);
              const newJobs = exists ? currentAssigned : [targetJobItem, ...currentAssigned];
              return {
                ...r,
                assignedJobs: newJobs,
                assignedJobsCount: newJobs.length,
                workloadScore: Math.min(100, newJobs.length * 25),
              };
            }
            return r;
          });

          localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));
        }
      } catch (e) {
        console.error('Error syncing new job assignment to recruiter:', e);
      }
    }

    addAuditLog('JOB_ACTION', 'Job Requisition Created', `Created new job opening "${newJob.title}" in ${newJob.department}`, { title: newJob.title, department: newJob.department });
    window.dispatchEvent(new Event('storage'));
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJobItem) return;

    setJobsList(
      jobsList.map((j) => (j.id === editJobItem.id ? editJobItem : j))
    );
    addAuditLog('JOB_ACTION', 'Job Requisition Details Updated', `Updated job details and compensation for "${editJobItem.title}"`, { jobId: editJobItem.id, title: editJobItem.title });
    setEditJobItem(null);
  };

  const handleToggleStatus = (jobId: string, newStatus: 'PUBLISHED' | 'CLOSED') => {
    const target = jobsList.find((j) => j.id === jobId);
    setJobsList(
      jobsList.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    addAuditLog('JOB_ACTION', `Job Requisition ${newStatus === 'PUBLISHED' ? 'Published' : 'Closed'}`, `Changed status of "${target?.title || jobId}" to ${newStatus}`, { jobId, newStatus });
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job opening?')) {
      setJobsList(jobsList.filter((j) => j.id !== jobId));
    }
  };

  const handleSaveAssignRecruiter = () => {
    if (!assignRecruiterJob) return;
    const recruiter = recruitersList.find((r) => r.id === selectedRecruiterForAssign);
    const assignedName = recruiter?.name || 'Unassigned';
    const assignedId = recruiter?.id;

    // 1. Update jobs list in state and localStorage
    const updatedJobs = jobsList.map((j) =>
      j.id === assignRecruiterJob.id
        ? {
            ...j,
            assignedRecruiterId: assignedId,
            assignedRecruiterName: assignedName,
          }
        : j
    );
    setJobsList(updatedJobs);
    localStorage.setItem('clyptus_org_jobs', JSON.stringify(updatedJobs));

    // 2. Sync assigned job into Recruiter profile in clyptus_org_recruiters
    try {
      const savedRecruitersStr = localStorage.getItem('clyptus_org_recruiters');
      if (savedRecruitersStr) {
        const recruitersArr = JSON.parse(savedRecruitersStr);
        const targetJobItem = {
          id: assignRecruiterJob.id,
          title: assignRecruiterJob.title,
          department: assignRecruiterJob.department,
          status: assignRecruiterJob.status,
        };

        const updatedRecruiters = recruitersArr.map((r: any) => {
          if (assignedId && (r.id === assignedId || r.name === assignedName)) {
            const currentAssigned: any[] = r.assignedJobs || [];
            const exists = currentAssigned.some((j: any) => j.id === assignRecruiterJob.id);
            const newJobs = exists ? currentAssigned : [targetJobItem, ...currentAssigned];
            return {
              ...r,
              assignedJobs: newJobs,
              assignedJobsCount: newJobs.length,
            };
          } else if (r.assignedJobs) {
            const newJobs = r.assignedJobs.filter((j: any) => j.id !== assignRecruiterJob.id);
            return {
              ...r,
              assignedJobs: newJobs,
              assignedJobsCount: newJobs.length,
            };
          }
          return r;
        });

        localStorage.setItem('clyptus_org_recruiters', JSON.stringify(updatedRecruiters));
      }
    } catch (e) {
      console.error('Failed to sync job assignment to recruiter profile:', e);
    }

    addAuditLog('JOB_ACTION', 'Recruiter Assigned to Job Opening', `Assigned recruiter ${assignedName} to job opening "${assignRecruiterJob.title}"`, { jobId: assignRecruiterJob.id, jobTitle: assignRecruiterJob.title, assignedRecruiter: assignedName });
    window.dispatchEvent(new Event('storage'));
    setAssignRecruiterJob(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      referenceCode: '',
      showRefCodeInput: false,
      postingCategory: 'Permanent',
      workType: 'Full time',
      scheduleType: 'Post now',
      expiryDate: '29-11-2026',
      experienceType: 'Experienced only',
      minExperience: '2 Years',
      maxExperience: '6 Years',
      department: 'Engineering',
      workMode: 'On-site',
      location: 'Bangalore, Karnataka',
      salaryMin: '₹ 8 Lakhs',
      salaryMax: '₹ 15 Lakhs',
      perks: 'Cab Services, Paternity leave, Health Insurance, Annual Bonus',
      industry: 'IT Software & Services',
      functionRole: 'Software Engineering - Frontend',
      education: 'B.E / B.Tech (CS / IT / ECE)',
      description: '',
      skillsTags: ['React', 'TypeScript'],
      skillInputText: '',
      assignedRecruiterId: 'rec-1',
      isGeneratingAi: false,
    });
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">Job Openings Overview</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100">
              ORG ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Create, publish, close, or reopen job openings, assign recruiters, specify required skills, and inspect candidate conversion analytics.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#0052CC] text-white text-xs font-bold rounded-xl hover:bg-[#0043A8] transition shadow-md flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job Opening</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, location or department..."
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published (Open)</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>

          <div className="flex items-center space-x-1.5 text-gray-500 font-semibold shrink-0 ml-2">
            <span>Dept:</span>
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 font-medium">
            No job openings match your search filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">JOB TITLE & LOCATION</th>
                  <th className="p-4">DEPARTMENT</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">ASSIGNED RECRUITER</th>
                  <th className="p-4">APPLICANTS</th>
                  <th className="p-4 pr-6 text-right">ORG ADMIN ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-blue-50/30 transition">
                    {/* Title, Location & Required Skills */}
                    <td className="p-4 pl-6">
                      <p className="font-extrabold text-gray-900 leading-tight">{j.title}</p>
                      <div className="flex items-center space-x-2 text-[11px] text-gray-400 font-medium mt-0.5">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{j.location}</span>
                        </span>
                        <span>•</span>
                        <span>{j.employmentType}</span>
                      </div>
                      {j.requiredSkills && j.requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {j.requiredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-blue-50 text-[#0052CC] font-bold text-[10px] border border-blue-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Department */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold">
                        {j.department}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          j.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : j.status === 'CLOSED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            j.status === 'PUBLISHED'
                              ? 'bg-emerald-500'
                              : j.status === 'CLOSED'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        ></span>
                        <span>{j.status === 'PUBLISHED' ? 'PUBLISHED (OPEN)' : j.status}</span>
                      </span>
                    </td>

                    {/* Assigned Recruiter */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-3.5 h-3.5 text-[#0052CC]" />
                        <span className="font-bold text-gray-800">
                          {j.assignedRecruiterName || 'Unassigned'}
                        </span>
                      </div>
                    </td>

                    {/* Applicants count */}
                    <td className="p-4">
                      <span className="font-extrabold text-[#0052CC] text-xs">
                        {getDynamicJobStats(j).applied} candidates
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* View Job Analytics */}
                        <button
                          onClick={() => setAnalysisJob(j)}
                          title="View Job Status & Analytics"
                          className="p-1.5 text-gray-500 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>

                        {/* Assign Recruiter */}
                        <button
                          onClick={() => {
                            setAssignRecruiterJob(j);
                            setSelectedRecruiterForAssign(j.assignedRecruiterId || 'rec-1');
                          }}
                          title="Assign to Recruiter"
                          className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>

                        {/* Edit Job */}
                        <button
                          onClick={() => setEditJobItem(j)}
                          title="Edit Job Details"
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Publish / Close / Reopen */}
                        {j.status === 'PUBLISHED' ? (
                          <button
                            onClick={() => handleToggleStatus(j.id, 'CLOSED')}
                            title="Close Job Opening"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(j.id, 'PUBLISHED')}
                            title="Publish / Reopen Job"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteJob(j.id)}
                          title="Delete Job"
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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

      {/* 1. CREATE JOB MODAL - EXACT REPLICA OF USER SCREENSHOTS */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#F8FAFC] rounded-3xl max-w-6xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-200 text-xs flex flex-col my-auto relative">
            
            {/* Header with Breadcrumb matching Screenshot 1 */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex items-center justify-between shadow-xs">
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-semibold text-gray-500 mb-0.5">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="hover:text-[#0052CC] flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>
                  <span>›</span>
                  <span className="text-[#0052CC] font-bold">Post Job</span>
                </div>
                <h2 className="text-xl font-black text-[#0B192C]">Create Job</h2>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Form */}
            <form onSubmit={handleCreateJob} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN: Posting details matching Screenshot 1 */}
                <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                  <h3 className="font-extrabold text-sm text-gray-900">Posting details</h3>

                  {/* Segmented Category Tabs: Permanent | Contract | Walk-in */}
                  <div className="bg-gray-100/80 p-1 rounded-2xl grid grid-cols-3 gap-1 text-center font-bold text-gray-600">
                    {(['Permanent', 'Contract', 'Walk-in'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, postingCategory: cat })}
                        className={`py-2 rounded-xl transition cursor-pointer text-xs ${
                          formData.postingCategory === cat
                            ? 'bg-white text-[#0052CC] shadow-sm font-extrabold border border-gray-200'
                            : 'hover:text-gray-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Work Type: Full time | Part time */}
                  <div className="flex items-center space-x-6 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="radio"
                        name="workTypeRadio"
                        checked={formData.workType === 'Full time'}
                        onChange={() => setFormData({ ...formData, workType: 'Full time' })}
                        className="w-4 h-4 text-[#0052CC]"
                      />
                      <span>Full time</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="radio"
                        name="workTypeRadio"
                        checked={formData.workType === 'Part time'}
                        onChange={() => setFormData({ ...formData, workType: 'Part time' })}
                        className="w-4 h-4 text-[#0052CC]"
                      />
                      <span>Part time</span>
                    </label>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Schedule job post */}
                  <div className="space-y-2">
                    <label className="block font-bold text-gray-700">Schedule job post</label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer font-bold text-gray-800">
                        <input
                          type="radio"
                          name="scheduleRadio"
                          checked={formData.scheduleType === 'Post now'}
                          onChange={() => setFormData({ ...formData, scheduleType: 'Post now' })}
                          className="w-4 h-4 text-[#0052CC]"
                        />
                        <span>Post now</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer font-bold text-gray-800">
                        <input
                          type="radio"
                          name="scheduleRadio"
                          checked={formData.scheduleType === 'Choose a date'}
                          onChange={() => setFormData({ ...formData, scheduleType: 'Choose a date' })}
                          className="w-4 h-4 text-[#0052CC]"
                        />
                        <span>Choose a date</span>
                      </label>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700">Expiry date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-900"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Assign Recruiter */}
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700">Assign Recruiter *</label>
                    <select
                      value={formData.assignedRecruiterId}
                      onChange={(e) => setFormData({ ...formData, assignedRecruiterId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                    >
                      {recruitersList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* RIGHT COLUMN: Job details & Compensation matching Screenshots 1 & 2 */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Job details box */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                    <h3 className="font-extrabold text-sm text-gray-900">Job details</h3>

                    {/* Job title + Add reference code */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-gray-700">Job title *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, showRefCodeInput: !formData.showRefCodeInput })}
                          className="text-[#0052CC] font-bold text-xs hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <span>+ Add reference code</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Search job title e.g. Senior Frontend Engineer"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-400"
                        required
                      />

                      {formData.showRefCodeInput && (
                        <input
                          type="text"
                          value={formData.referenceCode}
                          onChange={(e) => setFormData({ ...formData, referenceCode: e.target.value })}
                          placeholder="e.g. REF-2026-ENG01"
                          className="w-full mt-2 px-3.5 py-2 border border-gray-200 rounded-xl outline-none font-medium text-gray-800"
                        />
                      )}
                    </div>

                    {/* Experience Pills + Dropdowns */}
                    <div className="space-y-2">
                      <label className="block font-bold text-gray-700">Experience *</label>
                      <div className="flex items-center space-x-2">
                        {(['Fresher only', 'Experienced only'] as const).map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => setFormData({ ...formData, experienceType: exp })}
                            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer text-xs ${
                              formData.experienceType === exp
                                ? 'bg-purple-100/70 text-purple-700 border border-purple-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                            }`}
                          >
                            {exp}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Min experience (years) *</label>
                          <select
                            value={formData.minExperience}
                            onChange={(e) => setFormData({ ...formData, minExperience: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                          >
                            <option value="0 Years">0 Years (Fresher)</option>
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="5+ Years">5+ Years</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Max experience (years) *</label>
                          <select
                            value={formData.maxExperience}
                            onChange={(e) => setFormData({ ...formData, maxExperience: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                          >
                            <option value="2 Years">2 Years</option>
                            <option value="4 Years">4 Years</option>
                            <option value="6 Years">6 Years</option>
                            <option value="8 Years">8 Years</option>
                            <option value="10+ Years">10+ Years</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Generate skills & job description by AI */}
                    <div>
                      <button
                        type="button"
                        onClick={handleGenerateAi}
                        disabled={formData.isGeneratingAi}
                        className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-extrabold rounded-2xl border border-purple-200 hover:border-purple-300 transition flex items-center space-x-2 cursor-pointer shadow-xs"
                      >
                        <Sparkles className={`w-4 h-4 text-purple-600 ${formData.isGeneratingAi ? 'animate-spin' : ''}`} />
                        <span>{formData.isGeneratingAi ? 'Generating AI Content...' : 'Generate skills & job description by AI'}</span>
                      </button>
                    </div>

                    {/* Job description with toolbar */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-gray-700">Job description *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, description: '' })}
                          className="text-gray-400 font-bold hover:text-gray-600 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#0052CC]">
                        {/* Editor Toolbar */}
                        <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center space-x-3 text-gray-600">
                          <button type="button" className="p-1 hover:bg-gray-200 rounded font-black"><Bold className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline className="w-3.5 h-3.5" /></button>
                          <span className="text-gray-300">|</span>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded flex items-center space-x-1 font-bold">
                            <List className="w-3.5 h-3.5" />
                            <span>List</span>
                          </button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded flex items-center space-x-1 font-bold">
                            <ListOrdered className="w-3.5 h-3.5" />
                            <span>1. List</span>
                          </button>
                          <span className="text-gray-300">|</span>
                          <span className="font-semibold text-gray-600">Normal ∨</span>
                        </div>

                        <textarea
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Outlines the roles and responsibilities the candidate will perform in this role."
                          className="w-full p-4 outline-none resize-y font-medium text-gray-800 leading-relaxed"
                          required
                        />
                      </div>
                    </div>

                    {/* Required Skills Tags Input with 10 Preset Skills Dropdown */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <label className="block font-bold text-gray-700">Required Skills *</label>

                        {/* 10 Skills Dropdown Select */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSkillTag(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs text-purple-700 outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
                        >
                          <option value="">+ Add from 10 Recommended Skills</option>
                          <option value="React.js">React.js</option>
                          <option value="TypeScript">TypeScript</option>
                          <option value="Node.js">Node.js</option>
                          <option value="Python">Python</option>
                          <option value="Java / Spring Boot">Java / Spring Boot</option>
                          <option value="AWS Cloud">AWS Cloud</option>
                          <option value="Docker & Kubernetes">Docker & Kubernetes</option>
                          <option value="SQL / PostgreSQL">SQL / PostgreSQL</option>
                          <option value="Figma / UI/UX Design">Figma / UI/UX Design</option>
                          <option value="DevOps & CI/CD">DevOps & CI/CD</option>
                        </select>
                      </div>
                      
                      <div className="p-3 bg-white border border-gray-200 rounded-2xl space-y-2">
                        {formData.skillsTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {formData.skillsTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-purple-50 text-purple-700 font-extrabold text-xs rounded-xl border border-purple-100 flex items-center space-x-1.5"
                              >
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkillTag(tag)}
                                  className="hover:text-purple-900 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <input
                          type="text"
                          value={formData.skillInputText}
                          onChange={(e) => setFormData({ ...formData, skillInputText: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddSkillTag(formData.skillInputText);
                            }
                          }}
                          placeholder="Press Enter to add custom skills tag or pick from dropdown above"
                          className="w-full outline-none font-medium text-gray-700 bg-transparent text-xs"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">Select skills from dropdown above or press Enter to add custom skill tag.</p>
                    </div>

                    {/* Job location */}
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-700">Job location *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          value={formData.workMode}
                          onChange={(e: any) => setFormData({ ...formData, workMode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                        >
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                        </select>

                        <select
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                        >
                          <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                          <option value="San Francisco, CA">San Francisco, CA</option>
                          <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                          <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Remote">Remote (Global)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Compensation & Metadata box matching Screenshot 2 */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                    {/* Salary Min / Max */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Min salary (Annually ₹) *</label>
                        <select
                          value={formData.salaryMin}
                          onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                        >
                          <option value="₹ 3 Lakhs">₹ 3 Lakhs</option>
                          <option value="₹ 5 Lakhs">₹ 5 Lakhs</option>
                          <option value="₹ 8 Lakhs">₹ 8 Lakhs</option>
                          <option value="₹ 12 Lakhs">₹ 12 Lakhs</option>
                          <option value="₹ 18 Lakhs">₹ 18 Lakhs</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Max salary (Annually ₹) *</label>
                        <select
                          value={formData.salaryMax}
                          onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                        >
                          <option value="₹ 8 Lakhs">₹ 8 Lakhs</option>
                          <option value="₹ 12 Lakhs">₹ 12 Lakhs</option>
                          <option value="₹ 15 Lakhs">₹ 15 Lakhs</option>
                          <option value="₹ 25 Lakhs">₹ 25 Lakhs</option>
                          <option value="₹ 35+ Lakhs">₹ 35+ Lakhs</option>
                        </select>
                      </div>
                    </div>

                    {/* Perks and benefits */}
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <label className="block font-bold text-gray-700">Perks and benefits</label>
                        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.perks}
                        onChange={(e) => setFormData({ ...formData, perks: e.target.value })}
                        placeholder="Eg. Cab Services, Paternity leave, Health Insurance, Annual Bonus"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl outline-none font-medium text-gray-800"
                      />
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                      >
                        <option value="IT Software & Services">IT Software & Services</option>
                        <option value="Financial Technology (FinTech)">Financial Technology (FinTech)</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                      </select>
                    </div>

                    {/* Functions and roles */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Functions and roles</label>
                      <select
                        value={formData.functionRole}
                        onChange={(e) => setFormData({ ...formData, functionRole: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                      >
                        <option value="Software Engineering - Frontend">Software Engineering - Frontend</option>
                        <option value="Software Engineering - Full Stack">Software Engineering - Full Stack</option>
                        <option value="Product Design & UX">Product Design & UX</option>
                        <option value="DevOps & Cloud Architecture">DevOps & Cloud Architecture</option>
                      </select>
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Education</label>
                      <select
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-800"
                      >
                        <option value="B.E / B.Tech (CS / IT / ECE)">B.E / B.Tech (CS / IT / ECE)</option>
                        <option value="M.E / M.Tech / MCA">M.E / M.Tech / MCA</option>
                        <option value="B.Sc / M.Sc Computer Science">B.Sc / M.Sc Computer Science</option>
                        <option value="Any Graduate">Any Graduate</option>
                      </select>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom Action Bar matching Screenshot 2 */}
              <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-gray-200 rounded-b-3xl flex items-center justify-end space-x-3 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    alert('Job saved as draft!');
                    setIsCreateModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Save as draft
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Previewing Job: ${formData.title || 'Job Posting'}`)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Preview job post
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0052CC] text-white font-extrabold rounded-2xl hover:bg-[#0043A8] transition shadow-md cursor-pointer"
                >
                  Post Job
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 2. EDIT JOB MODAL */}
      {editJobItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setEditJobItem(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-gray-900 mb-4">Edit Job Opening</h3>

            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={editJobItem.title}
                  onChange={(e) => setEditJobItem({ ...editJobItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editJobItem.department}
                    onChange={(e) => setEditJobItem({ ...editJobItem, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editJobItem.location}
                    onChange={(e) => setEditJobItem({ ...editJobItem, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editJobItem.requiredSkills) ? editJobItem.requiredSkills.join(', ') : editJobItem.requiredSkills || ''}
                  onChange={(e) => {
                    const skillsArr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setEditJobItem({ ...editJobItem, requiredSkills: skillsArr });
                  }}
                  placeholder="e.g. React, TypeScript, AWS"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Job Status</label>
                <select
                  value={editJobItem.status}
                  onChange={(e: any) => setEditJobItem({ ...editJobItem, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none font-bold text-gray-800 bg-white"
                >
                  <option value="PUBLISHED">Published (Open)</option>
                  <option value="CLOSED">Closed</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={editJobItem.description}
                  onChange={(e) => setEditJobItem({ ...editJobItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none resize-none font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditJobItem(null)}
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

      {/* 3. ASSIGN RECRUITER TO JOB MODAL */}
      {assignRecruiterJob && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setAssignRecruiterJob(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Assign Job to Recruiter</h3>
                <p className="text-xs text-gray-500">Reassign "{assignRecruiterJob.title}"</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <label className="block font-bold text-gray-700">Select Recruiter:</label>
              {recruitersList.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    selectedRecruiterForAssign === r.id
                      ? 'bg-blue-50/60 border-[#0052CC] font-bold text-gray-900 shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="recruiterRadio"
                      checked={selectedRecruiterForAssign === r.id}
                      onChange={() => setSelectedRecruiterForAssign(r.id)}
                      className="w-4 h-4 text-[#0052CC]"
                    />
                    <div>
                      <p className="text-xs font-extrabold">{r.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{r.role} • {r.email}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAssignRecruiterJob(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignRecruiter}
                className="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
              >
                Assign Recruiter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW JOB STATUS & ANALYTICS MODAL */}
      {analysisJob && (() => {
        const dynamicStats = getDynamicJobStats(analysisJob);
        return (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
              <button
                onClick={() => setAnalysisJob(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">Job Analytics & Funnel Status</h3>
                  <p className="text-xs text-gray-500">{analysisJob.title}</p>
                </div>
              </div>

              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Applicants</span>
                  <p className="text-xl font-extrabold text-[#0052CC] mt-0.5">{dynamicStats.applied}</p>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Avg Time-To-Fill</span>
                  <p className="text-xl font-extrabold text-purple-700 mt-0.5">{dynamicStats.timeToFillDays} days</p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Conversion</span>
                  <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{dynamicStats.conversionRate}%</p>
                </div>
              </div>

              {/* Required Skills Section */}
              {analysisJob.requiredSkills && analysisJob.requiredSkills.length > 0 && (
                <div className="mb-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Required Technical & Candidate Skills</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {analysisJob.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white text-[#0052CC] font-bold text-xs rounded-xl border border-blue-100 shadow-2xs">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate Funnel Progress */}
              <h4 className="font-extrabold text-gray-900 mb-3">Recruitment Funnel Breakdown:</h4>
              <div className="space-y-2.5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-700">1. Applied Candidates</span>
                    <span className="text-[#0052CC]">{dynamicStats.applied}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0052CC] rounded-full w-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-700">2. Shortlisted</span>
                    <span className="text-purple-700">{dynamicStats.shortlisted}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{
                        width: `${
                          dynamicStats.applied > 0
                            ? (dynamicStats.shortlisted / dynamicStats.applied) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-700">3. Technical Interview</span>
                    <span className="text-indigo-700">{dynamicStats.interview}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${
                          dynamicStats.applied > 0
                            ? (dynamicStats.interview / dynamicStats.applied) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-700">4. Offer Extended & Hired</span>
                    <span className="text-emerald-700">{dynamicStats.hired} Hired</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${
                          dynamicStats.applied > 0
                            ? (dynamicStats.hired / dynamicStats.applied) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-gray-100 mt-5">
                <button
                  onClick={() => setAnalysisJob(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

