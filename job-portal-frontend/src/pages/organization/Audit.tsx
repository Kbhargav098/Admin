import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  UserCheck,
  Briefcase,
  FileText,
  RefreshCw,
  Zap,
  Lock,
  ShieldAlert,
  Clock,
  User,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  ChevronRight,
  Download,
  Activity,
  Layers,
  Calendar,
} from 'lucide-react';

export type EventCategory =
  | 'RECRUITER_ACTION'
  | 'JOB_ACTION'
  | 'APPLICATION_CHANGE'
  | 'ATS_TRANSITION'
  | 'TOKEN_ALLOCATION'
  | 'PERMISSION_CHANGE'
  | 'SECURITY_EVENT';

export interface AuditEventItem {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  actorName: string;
  actorRole: string;
  actorEmail: string;
  ipAddress: string;
  severity: 'INFO' | 'NOTICE' | 'WARNING' | 'ALERT';
  timestamp: string; // Formatted date time string
  isoDate: string; // ISO string for strict chronological sorting
  metadata?: Record<string, any>;
}

// Global Audit Log Helper function callable from any component/action
export const addAuditLog = (
  category: EventCategory,
  title: string,
  description: string,
  metadata?: Record<string, any>,
  severity: 'INFO' | 'NOTICE' | 'WARNING' | 'ALERT' = 'INFO'
) => {
  try {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const newLog: AuditEventItem = {
      id: `aud-${Date.now()}`,
      category,
      title,
      description,
      actorName: 'Marcus Vance',
      actorRole: 'Org Admin',
      actorEmail: 'marcus.vance@clyptus.io',
      ipAddress: '10.0.4.12',
      severity,
      timestamp: `${formattedDate} ${formattedTime}`,
      isoDate: now.toISOString(),
      metadata,
    };

    const saved = localStorage.getItem('clyptus_org_audit_logs');
    const existing: AuditEventItem[] = saved ? JSON.parse(saved) : [];
    const updated = [newLog, ...existing];
    localStorage.setItem('clyptus_org_audit_logs', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to write audit log:', e);
  }
};

export const Audit: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [viewDetailEvent, setViewDetailEvent] = useState<AuditEventItem | null>(null);

  // Initial Mock Audit Trail Dataset
  const defaultAuditTrail: AuditEventItem[] = [
    {
      id: 'aud-101',
      category: 'ATS_TRANSITION',
      title: 'Candidate ATS Stage Advanced',
      description: 'Moved candidate Sarah Connor from "Shortlisted" to "Technical Interview" stage.',
      actorName: 'Elena Rostova',
      actorRole: 'Tech Recruiter',
      actorEmail: 'elena.r@clyptus.io',
      ipAddress: '192.168.1.104',
      severity: 'INFO',
      timestamp: '2026-02-28 02:20:00 PM',
      isoDate: '2026-02-28T14:20:00.000Z',
      metadata: { candidate: 'Sarah Connor', fromStage: 'Shortlisted', toStage: 'Interview', reqId: 'job-103' },
    },
    {
      id: 'aud-102',
      category: 'TOKEN_ALLOCATION',
      title: 'Token Quota Allocated to Recruiter',
      description: 'Allocated +100 Hiring Tokens to Elena Rostova from Organization Wallet Pool.',
      actorName: 'Marcus Vance',
      actorRole: 'Org Admin',
      actorEmail: 'marcus.vance@clyptus.io',
      ipAddress: '10.0.4.12',
      severity: 'NOTICE',
      timestamp: '2026-02-28 02:05:00 PM',
      isoDate: '2026-02-28T14:05:00.000Z',
      metadata: { recipient: 'Elena Rostova', tokensAdded: 100, remainingPool: 350 },
    },
    {
      id: 'aud-103',
      category: 'JOB_ACTION',
      title: 'Job Requisition Published',
      description: 'Published new job requisition "Senior Full Stack Engineer" (ID: job-101).',
      actorName: 'Elena Rostova',
      actorRole: 'Tech Recruiter',
      actorEmail: 'elena.r@clyptus.io',
      ipAddress: '192.168.1.104',
      severity: 'INFO',
      timestamp: '2026-02-28 01:30:00 PM',
      isoDate: '2026-02-28T13:30:00.000Z',
      metadata: { jobTitle: 'Senior Full Stack Engineer', department: 'Engineering', tokenCost: 20 },
    },
    {
      id: 'aud-104',
      category: 'SECURITY_EVENT',
      title: 'Org Admin Session Authenticated',
      description: 'Successful multi-factor authentication login from registered IP address.',
      actorName: 'Marcus Vance',
      actorRole: 'Org Admin',
      actorEmail: 'marcus.vance@clyptus.io',
      ipAddress: '10.0.4.12',
      severity: 'INFO',
      timestamp: '2026-02-28 12:15:00 PM',
      isoDate: '2026-02-28T12:15:00.000Z',
      metadata: { authMethod: 'Password + TOTP', userAgent: 'Chrome 122.0 (Windows)' },
    },
    {
      id: 'aud-105',
      category: 'PERMISSION_CHANGE',
      title: 'Recruiter Member Permissions Updated',
      description: 'Granted candidate resume unlock permission to David Chen.',
      actorName: 'Marcus Vance',
      actorRole: 'Org Admin',
      actorEmail: 'marcus.vance@clyptus.io',
      ipAddress: '10.0.4.12',
      severity: 'NOTICE',
      timestamp: '2026-02-28 11:40:00 AM',
      isoDate: '2026-02-28T11:40:00.000Z',
      metadata: { targetMember: 'David Chen', permissionAdded: 'RESUME_UNLOCK_ACCESS' },
    },
    {
      id: 'aud-106',
      category: 'APPLICATION_CHANGE',
      title: 'Candidate Application Evaluated',
      description: 'Added interviewer evaluation notes for Bruce Wayne application.',
      actorName: 'David Chen',
      actorRole: 'HR Recruiter',
      actorEmail: 'david.c@clyptus.io',
      ipAddress: '192.168.1.118',
      severity: 'INFO',
      timestamp: '2026-02-28 10:25:00 AM',
      isoDate: '2026-02-28T10:25:00.000Z',
      metadata: { candidate: 'Bruce Wayne', noteLength: 140, rating: 5 },
    },
    {
      id: 'aud-107',
      category: 'RECRUITER_ACTION',
      title: 'Recruiter Account Status Reactivated',
      description: 'Reactivated suspended account for recruiter Alex Rivera.',
      actorName: 'Marcus Vance',
      actorRole: 'Org Admin',
      actorEmail: 'marcus.vance@clyptus.io',
      ipAddress: '10.0.4.12',
      severity: 'NOTICE',
      timestamp: '2026-02-28 09:15:00 AM',
      isoDate: '2026-02-28T09:15:00.000Z',
      metadata: { targetRecruiter: 'Alex Rivera', newStatus: 'Active' },
    },
    {
      id: 'aud-108',
      category: 'SECURITY_EVENT',
      title: 'Unrecognized IP Login Attempt Blocked',
      description: 'Automatic security gate blocked suspicious authentication request.',
      actorName: 'System Defender',
      actorRole: 'Security Gate',
      actorEmail: 'security@clyptus.io',
      ipAddress: '185.220.101.4',
      severity: 'WARNING',
      timestamp: '2026-02-27 11:45:00 PM',
      isoDate: '2026-02-27T23:45:00.000Z',
      metadata: { originCountry: 'External', failureReason: 'Invalid Token Signature' },
    },
  ];

  const [auditLogs, setAuditLogs] = useState<AuditEventItem[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with default and deduplicate by id
          const map = new Map<string, AuditEventItem>();
          parsed.forEach((item: AuditEventItem) => map.set(item.id, item));
          defaultAuditTrail.forEach((item) => {
            if (!map.has(item.id)) map.set(item.id, item);
          });
          return Array.from(map.values());
        }
      }
      return defaultAuditTrail;
    } catch (e) {
      return defaultAuditTrail;
    }
  });

  // Sync to localStorage and listen for updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('clyptus_org_audit_logs');
        if (saved) {
          const parsed = JSON.parse(saved);
          setAuditLogs(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Strict Reverse Chronological Sorting by date & time (Newest Actions First)
  const sortedAuditLogs = [...auditLogs].sort((a, b) => {
    const timeA = a.isoDate ? new Date(a.isoDate).getTime() : new Date(a.timestamp).getTime() || 0;
    const timeB = b.isoDate ? new Date(b.isoDate).getTime() : new Date(b.timestamp).getTime() || 0;
    return timeB - timeA;
  });

  // Filtered Events
  const filteredLogs = sortedAuditLogs.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) return false;

    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ipAddress.includes(searchTerm);

    return matchesSearch;
  });

  const getCategoryBadge = (cat: EventCategory) => {
    switch (cat) {
      case 'RECRUITER_ACTION':
        return <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">RECRUITER ACTION</span>;
      case 'JOB_ACTION':
        return <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">JOB ACTION</span>;
      case 'APPLICATION_CHANGE':
        return <span className="px-2.5 py-0.5 rounded-md bg-[#EBF3FF] text-[#0052CC] border border-blue-200 font-bold text-[10px]">APPLICATION CHANGE</span>;
      case 'ATS_TRANSITION':
        return <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">ATS TRANSITION</span>;
      case 'TOKEN_ALLOCATION':
        return <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">TOKEN ALLOCATION</span>;
      case 'PERMISSION_CHANGE':
        return <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">PERMISSION CHANGE</span>;
      case 'SECURITY_EVENT':
        return <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">SECURITY EVENT</span>;
    }
  };

  // Action: Export Audit Logs CSV Download
  const handleExportAuditLog = () => {
    if (filteredLogs.length === 0) {
      alert('No audit logs available to export.');
      return;
    }

    const headers = ['ID', 'Date & Time', 'Category', 'Title', 'Description', 'Actor Name', 'Actor Role', 'Actor Email', 'IP Address', 'Severity'];
    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.category}"`,
      `"${log.title.replace(/"/g, '""')}"`,
      `"${log.description.replace(/"/g, '""')}"`,
      `"${log.actorName}"`,
      `"${log.actorRole}"`,
      `"${log.actorEmail}"`,
      `"${log.ipAddress}"`,
      `"${log.severity}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">Chronological Organization Audit Log</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100 uppercase tracking-wider">
              REAL-TIME TIME & DATE ORDER
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Displaying all Organization Admin and recruiter actions in strict chronological order with exact date, time, actor identity & event details.
          </p>
        </div>

        <button
          onClick={handleExportAuditLog}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#0052CC] text-white font-bold text-xs rounded-xl hover:bg-[#0043A8] transition shadow-xs shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Category Tabs Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-1 bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Activities' },
            { id: 'RECRUITER_ACTION', label: 'Recruiter Actions' },
            { id: 'JOB_ACTION', label: 'Job Actions' },
            { id: 'APPLICATION_CHANGE', label: 'App Changes' },
            { id: 'ATS_TRANSITION', label: 'ATS Transitions' },
            { id: 'TOKEN_ALLOCATION', label: 'Token Allocations' },
            { id: 'PERMISSION_CHANGE', label: 'Permissions' },
            { id: 'SECURITY_EVENT', label: 'Security Events' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Severity Filters */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, actor, date or time..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium text-xs"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700 text-xs shrink-0"
          >
            <option value="ALL">All Severity</option>
            <option value="INFO">Info</option>
            <option value="NOTICE">Notice</option>
            <option value="WARNING">Warning</option>
          </select>
        </div>
      </div>

      {/* Chronological Audit Log Events List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 font-medium">
            No audit events found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">DATE & TIME (NEWEST FIRST)</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">ACTION & EVENT DETAILS</th>
                  <th className="p-4">PERFORMED BY</th>
                  <th className="p-4">IP ADDRESS</th>
                  <th className="p-4 pr-6 text-right">INSPECT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/30 transition">
                    {/* Timestamp & Date */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-[#0052CC] shrink-0" />
                        <span className="font-extrabold text-gray-900 leading-tight block whitespace-nowrap">
                          {log.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="p-4">{getCategoryBadge(log.category)}</td>

                    {/* Title & Description */}
                    <td className="p-4">
                      <p className="font-extrabold text-gray-900 leading-tight">{log.title}</p>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">{log.description}</p>
                    </td>

                    {/* Performed By */}
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{log.actorName}</p>
                      <span className="text-[10px] text-gray-400 font-medium">{log.actorRole}</span>
                    </td>

                    {/* IP Address */}
                    <td className="p-4 font-mono text-gray-600 text-[11px]">{log.ipAddress}</td>

                    {/* Inspect Action */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setViewDetailEvent(log)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition text-[11px] inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Payload</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EVENT INSPECTION MODAL */}
      {viewDetailEvent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setViewDetailEvent(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Audit Log Event Inspection</h3>
                <p className="text-xs text-gray-500">ID: {viewDetailEvent.id}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <p className="font-extrabold text-gray-900">{viewDetailEvent.title}</p>
                <p className="text-gray-600 font-medium">{viewDetailEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Execution Timestamp</span>
                  <span className="font-extrabold text-gray-900">{viewDetailEvent.timestamp}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Actor / Role</span>
                  <span className="font-bold text-gray-900">{viewDetailEvent.actorName} ({viewDetailEvent.actorRole})</span>
                </div>
              </div>

              {viewDetailEvent.metadata && (
                <div>
                  <span className="font-extrabold text-gray-700 block mb-1">Event Payload JSON:</span>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] overflow-x-auto">
                    {JSON.stringify(viewDetailEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setViewDetailEvent(null)}
                  className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
