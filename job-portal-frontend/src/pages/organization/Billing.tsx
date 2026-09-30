import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { addAuditLog } from './Audit';
import {
  CreditCard,
  Zap,
  Users,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Edit3,
  CheckCircle,
  History,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ShieldCheck,
  Lock,
  Plus,
  Minus,
  X,
  PieChart,
  UserCheck,
} from 'lucide-react';

export interface RecruiterAllocation {
  id: string;
  name: string;
  email: string;
  role: string;
  allocatedTokens: number;
  usedTokens: number;
  lastAllocatedDate: string;
  status: 'Active' | 'Low Balance' | 'Depleted';
}

export interface TokenConsumptionLog {
  id: string;
  recruiterName: string;
  action: string;
  tokensSpent: number;
  targetRef: string;
  timestamp: string;
}

export const Billing: React.FC = () => {
  const { user } = useAuthStore();

  // Overall Organization Wallet State (Reflects available unallocated master wallet tokens)
  const [totalOrgTokens, setTotalOrgTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_total_tokens');
      return saved ? JSON.parse(saved) : 650;
    } catch (e) {
      return 650;
    }
  });

  // Recruiter Token Allocations Helper - merges recruiter records from Members section
  const loadMergedAllocations = (): RecruiterAllocation[] => {
    const initialAllocations: RecruiterAllocation[] = [
      {
        id: 'rec-1',
        name: 'Elena Rostova',
        email: 'elena.r@abctech.com',
        role: 'HR Recruiter',
        allocatedTokens: 350,
        usedTokens: 280,
        lastAllocatedDate: '2026-02-15',
        status: 'Low Balance',
      },
      {
        id: 'rec-2',
        name: 'David Chen',
        email: 'david.c@abctech.com',
        role: 'HR Recruiter',
        allocatedTokens: 250,
        usedTokens: 110,
        lastAllocatedDate: '2026-02-18',
        status: 'Active',
      },
      {
        id: 'rec-3',
        name: 'Sophia Martinez',
        email: 'sophia.m@abctech.com',
        role: 'HR Recruiter',
        allocatedTokens: 100,
        usedTokens: 95,
        lastAllocatedDate: '2026-02-01',
        status: 'Low Balance',
      },
    ];

    try {
      const savedAllocationsStr = localStorage.getItem('clyptus_org_allocations');
      const savedRecruitersStr = localStorage.getItem('clyptus_org_recruiters');

      let currentAllocations: RecruiterAllocation[] = savedAllocationsStr ? JSON.parse(savedAllocationsStr) : initialAllocations;
      const recruitersList = savedRecruitersStr ? JSON.parse(savedRecruitersStr) : [];

      if (recruitersList.length > 0) {
        const existingEmails = new Set(currentAllocations.map((a) => a.email.toLowerCase()));
        const existingIds = new Set(currentAllocations.map((a) => a.id));

        recruitersList.forEach((r: any) => {
          if (!existingIds.has(r.id) && !existingEmails.has(r.email.toLowerCase())) {
            const initialTokens = r.tokenBalance !== undefined ? r.tokenBalance : 100;
            currentAllocations.push({
              id: r.id,
              name: r.name,
              email: r.email,
              role: r.recruiterType === 'HIRING_MANAGER' ? 'Hiring Manager' : r.recruiterType === 'TECH_RECRUITER' ? 'Tech Recruiter' : 'HR Recruiter',
              allocatedTokens: initialTokens,
              usedTokens: 0,
              lastAllocatedDate: r.joinDate || new Date().toISOString().split('T')[0],
              status: initialTokens <= 25 ? 'Low Balance' : 'Active',
            });
          }
        });
      }

      return currentAllocations;
    } catch (e) {
      return initialAllocations;
    }
  };

  const [allocationsList, setAllocationsList] = useState<RecruiterAllocation[]>(() => loadMergedAllocations());

  // Token Consumption Activity Logs
  const initialConsumptionLogs: TokenConsumptionLog[] = [
    {
      id: 'tx-101',
      recruiterName: 'Elena Rostova',
      action: 'Published Job Requisition',
      tokensSpent: 20,
      targetRef: 'Senior Full Stack Engineer',
      timestamp: '2 hours ago',
    },
    {
      id: 'tx-102',
      recruiterName: 'Elena Rostova',
      action: 'Unlocked Verified Candidate Resume',
      tokensSpent: 5,
      targetRef: 'Bruce Wayne (Full Stack Architect)',
      timestamp: '5 hours ago',
    },
    {
      id: 'tx-103',
      recruiterName: 'David Chen',
      action: 'Published Job Requisition',
      tokensSpent: 20,
      targetRef: 'Product Design Lead',
      timestamp: '1 day ago',
    },
    {
      id: 'tx-104',
      recruiterName: 'Sophia Martinez',
      action: 'AI Candidate Fit Scoring Run',
      tokensSpent: 10,
      targetRef: 'DevOps & Cloud Specialist',
      timestamp: '2 days ago',
    },
  ];

  const [consumptionLogs, setConsumptionLogs] = useState<TokenConsumptionLog[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_consumption_logs');
      return saved ? JSON.parse(saved) : initialConsumptionLogs;
    } catch (e) {
      return initialConsumptionLogs;
    }
  });

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clyptus_org_total_tokens', JSON.stringify(totalOrgTokens));
      localStorage.setItem('clyptus_org_allocations', JSON.stringify(allocationsList));
      localStorage.setItem('clyptus_org_consumption_logs', JSON.stringify(consumptionLogs));
    } catch (e) {
      console.error('Failed to sync token state:', e);
    }
  }, [totalOrgTokens, allocationsList, consumptionLogs]);

  // Listen for storage events (e.g. when recruiters are added in Members.tsx)
  useEffect(() => {
    const handleStorage = () => {
      setAllocationsList(loadMergedAllocations());
      try {
        const savedTokens = localStorage.getItem('clyptus_org_total_tokens');
        if (savedTokens) setTotalOrgTokens(JSON.parse(savedTokens));
        const savedLogs = localStorage.getItem('clyptus_org_consumption_logs');
        if (savedLogs) setConsumptionLogs(JSON.parse(savedLogs));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Modals state
  const [selectedRecruiterForAllocate, setSelectedRecruiterForAllocate] = useState<RecruiterAllocation | null>(null);
  const [allocationAmountInput, setAllocationAmountInput] = useState<number>(50);
  const [allocationOperation, setAllocationOperation] = useState<'ADD' | 'RECLAIM'>('ADD');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Calculated Wallet Totals
  const totalAllocated = allocationsList.reduce((acc, curr) => acc + curr.allocatedTokens, 0);
  const totalConsumed = allocationsList.reduce((acc, curr) => acc + curr.usedTokens, 0);

  const lowBalanceRecruiters = allocationsList.filter(
    (r) => r.allocatedTokens - r.usedTokens <= 25
  );

  // Filtered Allocations List
  const filteredAllocations = allocationsList.filter((item) => {
    if (statusFilter === 'LOW_BALANCE' && item.allocatedTokens - item.usedTokens > 25) return false;
    if (statusFilter === 'ACTIVE' && item.allocatedTokens - item.usedTokens <= 25) return false;

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Action Handler: Allocate / Reclaim Recruiter Tokens
  const handleSaveAllocation = () => {
    if (!selectedRecruiterForAllocate) return;
    const amount = Number(allocationAmountInput);
    if (amount <= 0) return;

    if (allocationOperation === 'ADD' && amount > totalOrgTokens) {
      alert(`Cannot allocate ${amount} tokens. Only ${totalOrgTokens} total tokens available in organization wallet.`);
      return;
    }

    const updatedAllocations = allocationsList.map((rec) => {
      if (rec.id === selectedRecruiterForAllocate.id) {
        const newAllocated =
          allocationOperation === 'ADD'
            ? rec.allocatedTokens + amount
            : Math.max(rec.usedTokens, rec.allocatedTokens - amount);

        const remaining = newAllocated - rec.usedTokens;
        const newStatus = remaining <= 25 ? 'Low Balance' : 'Active';

        return {
          ...rec,
          allocatedTokens: newAllocated,
          lastAllocatedDate: new Date().toISOString().split('T')[0],
          status: newStatus as 'Active' | 'Low Balance' | 'Depleted',
        };
      }
      return rec;
    });

    // Update Total Organization Wallet Tokens dynamically on allocation or reclaim
    const newTotalOrgTokens =
      allocationOperation === 'ADD'
        ? Math.max(0, totalOrgTokens - amount)
        : totalOrgTokens + amount;

    setTotalOrgTokens(newTotalOrgTokens);
    setAllocationsList(updatedAllocations);

    // 1. Log to Audit Trail (Audit.tsx)
    const auditTitle = allocationOperation === 'ADD' ? 'Token Quota Allocated' : 'Token Quota Reclaimed';
    const auditDesc = allocationOperation === 'ADD'
      ? `Allocated +${amount} hiring tokens to ${selectedRecruiterForAllocate.name} from Organization Wallet`
      : `Reclaimed -${amount} unused hiring tokens from ${selectedRecruiterForAllocate.name} back to wallet`;

    addAuditLog('TOKEN_ALLOCATION', auditTitle, auditDesc, {
      recruiter: selectedRecruiterForAllocate.name,
      amount,
      operation: allocationOperation,
      remainingWalletBalance: newTotalOrgTokens,
    }, 'NOTICE');

    // 2. Log to Token Consumption Activity Audit Log (Billing.tsx)
    const newConsumptionLog: TokenConsumptionLog = {
      id: `tx-${Date.now()}`,
      recruiterName: selectedRecruiterForAllocate.name,
      action: allocationOperation === 'ADD' ? `Quota Allocation (+${amount} Tokens)` : `Quota Reclaim (-${amount} Tokens)`,
      tokensSpent: allocationOperation === 'ADD' ? -amount : amount,
      targetRef: `Org Admin Distribution by Marcus Vance`,
      timestamp: 'Just now',
    };

    setConsumptionLogs([newConsumptionLog, ...consumptionLogs]);

    setSelectedRecruiterForAllocate(null);
    setAllocationAmountInput(50);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Wallet Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">Token Allocation & Quota Governance</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100 uppercase tracking-wider">
              ORG ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Allocate available organization hiring tokens to recruiters, adjust quotas & track credit consumption activity in real-time.
          </p>
        </div>

        {/* Current Wallet Display */}
        <div className="flex items-center space-x-3 bg-orange-50/80 px-4 py-3 rounded-2xl border border-orange-200 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-black">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#C2410C] uppercase tracking-wider block">
              TOTAL WALLET TOKENS
            </span>
            <p className="text-xl font-black text-[#0B192C]">
              {totalOrgTokens.toLocaleString()} <span className="text-xs font-bold text-gray-500">Tokens</span>
            </p>
          </div>
        </div>
      </div>

      {/* Low Balance Warning Notification Banner */}
      {lowBalanceRecruiters.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 text-amber-900">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-amber-900">
                Low Token Balance Alert ({lowBalanceRecruiters.length} Recruiter{lowBalanceRecruiters.length > 1 ? 's' : ''})
              </p>
              <p className="text-amber-800 font-medium mt-0.5">
                {lowBalanceRecruiters.map((r) => r.name).join(', ')} {lowBalanceRecruiters.length === 1 ? 'has' : 'have'} 25 or fewer tokens remaining. Allocate tokens to prevent requisition delays.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatusFilter('LOW_BALANCE')}
            className="px-3.5 py-1.5 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition shadow-xs text-xs shrink-0"
          >
            Review Low Balances
          </button>
        </div>
      )}

      {/* 3 Stat Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Wallet Tokens</span>
          <p className="text-2xl font-extrabold text-[#0B192C]">{totalOrgTokens.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 font-medium">Available for allocation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Allocated to Recruiters</span>
          <p className="text-2xl font-extrabold text-purple-700">{totalAllocated.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 font-medium">Distributed recruiter quota</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tokens Consumed</span>
          <p className="text-2xl font-extrabold text-[#F97316]">{totalConsumed.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 font-medium">For job posts & candidate resumes</span>
        </div>
      </div>

      {/* Recruiter Allocations Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#0052CC]" />
            <h3 className="font-extrabold text-sm text-gray-900">Recruiter Token Allocations & Quota Adjustments</h3>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recruiter name, role..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700 text-xs shrink-0"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Healthy Balance</option>
              <option value="LOW_BALANCE">Low Balance (&le; 25)</option>
            </select>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-6">RECRUITER / MEMBER</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">ALLOCATED TOKENS</th>
                <th className="p-4">USED TOKENS</th>
                <th className="p-4">REMAINING BALANCE</th>
                <th className="p-4">USAGE PROGRESS</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-right">ORG ADMIN ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredAllocations.map((rec) => {
                const remaining = rec.allocatedTokens - rec.usedTokens;
                const percentUsed = Math.min(100, Math.round((rec.usedTokens / (rec.allocatedTokens || 1)) * 100));

                return (
                  <tr key={rec.id} className="hover:bg-blue-50/30 transition">
                    <td className="p-4 pl-6">
                      <p className="font-extrabold text-gray-900 leading-tight">{rec.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{rec.email}</p>
                    </td>

                    <td className="p-4 font-bold text-gray-700">{rec.role}</td>

                    <td className="p-4 font-extrabold text-[#0B192C]">
                      {rec.allocatedTokens.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">Tokens</span>
                    </td>

                    <td className="p-4 font-bold text-purple-700">
                      {rec.usedTokens.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">Spent</span>
                    </td>

                    <td className="p-4 font-black text-[#0052CC]">
                      {remaining.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">Left</span>
                    </td>

                    {/* Progress Bar */}
                    <td className="p-4 w-40">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-extrabold">
                          <span className="text-gray-500">{percentUsed}% Used</span>
                          <span className="text-gray-400">{rec.usedTokens}/{rec.allocatedTokens}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentUsed > 85 ? 'bg-amber-500' : 'bg-[#0052CC]'
                            }`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {remaining <= 25 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold inline-flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Balance</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold inline-flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Healthy</span>
                        </span>
                      )}
                    </td>

                    {/* Admin Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRecruiterForAllocate(rec);
                            setAllocationOperation('ADD');
                            setAllocationAmountInput(50);
                          }}
                          className="px-3 py-1.5 bg-[#0052CC] text-white font-bold text-[11px] rounded-xl hover:bg-[#0043A8] transition shadow-xs flex items-center space-x-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Allocate Tokens</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedRecruiterForAllocate(rec);
                            setAllocationOperation('RECLAIM');
                            setAllocationAmountInput(20);
                          }}
                          title="Adjust or Reclaim Allocation Quota"
                          className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Token Consumption Activity Audit Log */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-sm text-gray-900">Token Consumption Activity Audit Log</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">Live Expenditure & Allocation Stream</span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {consumptionLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between text-xs hover:bg-blue-50/30 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-900">{log.action}</p>
                  <p className="text-[11px] text-gray-500">
                    By <span className="font-bold text-gray-700">{log.recruiterName}</span> • Target: <span className="font-bold text-[#0052CC]">{log.targetRef}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`font-extrabold text-xs ${log.tokensSpent < 0 ? 'text-emerald-600' : 'text-[#F97316]'}`}>
                  {log.tokensSpent < 0 ? `+${Math.abs(log.tokensSpent)} Tokens` : `-${log.tokensSpent} Tokens`}
                </span>
                <p className="text-[10px] text-gray-400 font-medium">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALLOCATE / ADJUST TOKENS MODAL */}
      {selectedRecruiterForAllocate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setSelectedRecruiterForAllocate(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {allocationOperation === 'ADD' ? 'Allocate Available Tokens' : 'Adjust / Reclaim Allocation'}
                </h3>
                <p className="text-xs text-gray-500">Recruiter: {selectedRecruiterForAllocate.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Wallet Pool Status */}
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-600">Total Wallet Balance:</span>
                <span className="font-black text-[#0052CC]">{totalOrgTokens} Tokens Available</span>
              </div>

              {/* Operation Selector */}
              <div className="flex rounded-xl bg-gray-100 p-1 font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setAllocationOperation('ADD')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    allocationOperation === 'ADD' ? 'bg-white text-[#0052CC] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  + Add Tokens
                </button>
                <button
                  type="button"
                  onClick={() => setAllocationOperation('RECLAIM')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    allocationOperation === 'RECLAIM' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  - Reclaim Tokens
                </button>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Token Amount to {allocationOperation === 'ADD' ? 'Allocate' : 'Reclaim'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={allocationAmountInput}
                  onChange={(e) => setAllocationAmountInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-bold text-base outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1 text-[11px] font-medium text-gray-600">
                <p>Current Quota: <span className="font-bold text-gray-900">{selectedRecruiterForAllocate.allocatedTokens} Tokens</span></p>
                <p>New Quota After Update: <span className="font-bold text-[#0052CC]">
                  {allocationOperation === 'ADD'
                    ? selectedRecruiterForAllocate.allocatedTokens + Number(allocationAmountInput)
                    : Math.max(selectedRecruiterForAllocate.usedTokens, selectedRecruiterForAllocate.allocatedTokens - Number(allocationAmountInput))} Tokens
                </span></p>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedRecruiterForAllocate(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllocation}
                  className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
                >
                  Confirm Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
