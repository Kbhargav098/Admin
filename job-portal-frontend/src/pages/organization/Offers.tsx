import React, { useState } from 'react';
import {
  Gift,
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit3,
  DollarSign,
  Briefcase,
  User,
  Calendar,
  FileText,
  ShieldCheck,
  AlertCircle,
  Building,
  Check,
  X,
  Award,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { addAuditLog } from './Audit';

export interface OfferItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  department: string;
  status: 'Draft' | 'Pending Review' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  baseSalary: number; // e.g. 165000
  bonusPercent: number; // e.g. 15%
  equityUnits: string; // e.g. "10,000 RSUs (4-yr vesting)"
  joiningBonus: number; // e.g. 20000
  startDate: string; // YYYY-MM-DD
  expirationDate: string; // YYYY-MM-DD
  createdDate: string;
  sentDate?: string;
  respondedDate?: string;
  recruiterOwner: string;
  declinationReason?: string;
  benefitsSummary: string;
  adminApproved: boolean;
}

export const Offers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'DRAFT' | 'PENDING_REVIEW' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  >('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reviewOffer, setReviewOffer] = useState<OfferItem | null>(null);
  const [sendOfferTarget, setSendOfferTarget] = useState<OfferItem | null>(null);

  // Form state for Create Offer
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateEmail, setNewCandidateEmail] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('Senior Full Stack Engineer');
  const [newDepartment, setNewDepartment] = useState('Engineering');
  const [newBaseSalary, setNewBaseSalary] = useState(175000);
  const [newBonusPercent, setNewBonusPercent] = useState(15);
  const [newEquityUnits, setNewEquityUnits] = useState('12,000 RSUs (4-year vesting, 1-year cliff)');
  const [newJoiningBonus, setNewJoiningBonus] = useState(20000);
  const [newStartDate, setNewStartDate] = useState('2026-04-01');
  const [newExpirationDate, setNewExpirationDate] = useState('2026-03-15');
  const [newRecruiterOwner, setNewRecruiterOwner] = useState('Elena Rostova');
  const [newBenefits, setNewBenefits] = useState('Comprehensive Healthcare (100% covered), 401(k) 6% match, Unlimited PTO, $3,000 annual learning stipend.');

  // Default Mock Offers Dataset
  const initialOffers: OfferItem[] = [
    {
      id: 'off-101',
      candidateName: 'Diana Prince',
      candidateEmail: 'diana.prince@themyscira.design',
      jobTitle: 'Product Design Lead',
      department: 'Design',
      status: 'Sent',
      baseSalary: 185000,
      bonusPercent: 15,
      equityUnits: '15,000 RSUs (4-year vesting)',
      joiningBonus: 25000,
      startDate: '2026-03-20',
      expirationDate: '2026-03-05',
      createdDate: '2026-02-24',
      sentDate: '2026-02-25',
      recruiterOwner: 'David Chen',
      benefitsSummary: '100% Medical/Dental, $4k Remote Setup, Flexible Working Hours, Equity Grants.',
      adminApproved: true,
    },
    {
      id: 'off-102',
      candidateName: 'Bruce Wayne',
      candidateEmail: 'bruce.wayne@gothamtech.com',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      status: 'Accepted',
      baseSalary: 210000,
      bonusPercent: 20,
      equityUnits: '25,000 RSUs (4-year vesting)',
      joiningBonus: 30000,
      startDate: '2026-03-15',
      expirationDate: '2026-02-28',
      createdDate: '2026-02-18',
      sentDate: '2026-02-20',
      respondedDate: '2026-02-27',
      recruiterOwner: 'Elena Rostova',
      benefitsSummary: 'Top tier health package, Relocation allowance, Executive coaching, 401k match.',
      adminApproved: true,
    },
    {
      id: 'off-103',
      candidateName: 'Sarah Connor',
      candidateEmail: 'sarah.connor@cyberdyne.io',
      jobTitle: 'DevOps & Cloud Specialist',
      department: 'Infrastructure',
      status: 'Pending Review',
      baseSalary: 195000,
      bonusPercent: 15,
      equityUnits: '18,000 RSUs',
      joiningBonus: 20000,
      startDate: '2026-04-01',
      expirationDate: '2026-03-10',
      createdDate: '2026-02-28',
      recruiterOwner: 'Elena Rostova',
      benefitsSummary: 'Comprehensive benefits, Home office allowance, On-call stipend.',
      adminApproved: false,
    },
    {
      id: 'off-104',
      candidateName: 'Hal Jordan',
      candidateEmail: 'hal.jordan@coastcity.com',
      jobTitle: 'Frontend Developer',
      department: 'Engineering',
      status: 'Rejected',
      baseSalary: 140000,
      bonusPercent: 10,
      equityUnits: '5,000 RSUs',
      joiningBonus: 10000,
      startDate: '2026-03-01',
      expirationDate: '2026-02-20',
      createdDate: '2026-02-10',
      sentDate: '2026-02-12',
      respondedDate: '2026-02-18',
      recruiterOwner: 'Sophia Martinez',
      declinationReason: 'Accepted competing counter-offer with higher base salary.',
      benefitsSummary: 'Standard tech benefits package.',
      adminApproved: true,
    },
    {
      id: 'off-105',
      candidateName: 'Arthur Curry',
      candidateEmail: 'arthur.curry@atlantis.org',
      jobTitle: 'Database Performance Architect',
      department: 'Infrastructure',
      status: 'Expired',
      baseSalary: 175000,
      bonusPercent: 12,
      equityUnits: '12,000 RSUs',
      joiningBonus: 15000,
      startDate: '2026-02-15',
      expirationDate: '2026-02-10',
      createdDate: '2026-01-25',
      sentDate: '2026-01-27',
      recruiterOwner: 'Elena Rostova',
      benefitsSummary: 'Standard corporate health benefits.',
      adminApproved: true,
    },
  ];

  const [offersList, setOffersList] = useState<OfferItem[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_offers');
      return saved ? JSON.parse(saved) : initialOffers;
    } catch (e) {
      return initialOffers;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('clyptus_org_offers', JSON.stringify(offersList));
    } catch (e) {
      console.error(e);
    }
  }, [offersList]);

  // Statistics Calculations
  const totalOffersCount = offersList.length;
  const pendingReviewCount = offersList.filter((o) => o.status === 'Pending Review' || o.status === 'Draft').length;
  const sentCount = offersList.filter((o) => o.status === 'Sent').length;
  const acceptedCount = offersList.filter((o) => o.status === 'Accepted').length;
  const rejectedCount = offersList.filter((o) => o.status === 'Rejected').length;
  const expiredCount = offersList.filter((o) => o.status === 'Expired').length;

  // Filtered Offers
  const filteredOffers = offersList.filter((item) => {
    if (activeTab === 'DRAFT' && item.status !== 'Draft') return false;
    if (activeTab === 'PENDING_REVIEW' && item.status !== 'Pending Review') return false;
    if (activeTab === 'SENT' && item.status !== 'Sent') return false;
    if (activeTab === 'ACCEPTED' && item.status !== 'Accepted') return false;
    if (activeTab === 'REJECTED' && item.status !== 'Rejected') return false;
    if (activeTab === 'EXPIRED' && item.status !== 'Expired') return false;

    if (departmentFilter !== 'ALL' && item.department !== departmentFilter) return false;

    const matchesSearch =
      item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recruiterOwner.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Actions
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateEmail) return;

    const newOffer: OfferItem = {
      id: `off-${Date.now()}`,
      candidateName: newCandidateName,
      candidateEmail: newCandidateEmail,
      jobTitle: newJobTitle,
      department: newDepartment,
      status: 'Pending Review',
      baseSalary: Number(newBaseSalary),
      bonusPercent: Number(newBonusPercent),
      equityUnits: newEquityUnits,
      joiningBonus: Number(newJoiningBonus),
      startDate: newStartDate,
      expirationDate: newExpirationDate,
      createdDate: new Date().toISOString().split('T')[0],
      recruiterOwner: newRecruiterOwner,
      benefitsSummary: newBenefits,
      adminApproved: true, // Auto-approved because created by Org Admin
    };

    setOffersList([newOffer, ...offersList]);
    setShowCreateModal(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewCandidateName('');
    setNewCandidateEmail('');
    setNewJobTitle('Senior Full Stack Engineer');
    setNewDepartment('Engineering');
    setNewBaseSalary(175000);
    setNewBonusPercent(15);
    setNewEquityUnits('12,000 RSUs (4-year vesting, 1-year cliff)');
    setNewJoiningBonus(20000);
    setNewStartDate('2026-04-01');
    setNewExpirationDate('2026-03-15');
    setNewRecruiterOwner('Elena Rostova');
    setNewBenefits('Comprehensive Healthcare (100% covered), 401(k) 6% match, Unlimited PTO.');
  };

  const handleApproveOffer = (offerId: string) => {
    setOffersList(
      offersList.map((item) => {
        if (item.id === offerId) {
          return {
            ...item,
            adminApproved: true,
            status: item.status === 'Draft' || item.status === 'Pending Review' ? 'Pending Review' : item.status,
          };
        }
        return item;
      })
    );
    if (reviewOffer && reviewOffer.id === offerId) {
      setReviewOffer({ ...reviewOffer, adminApproved: true });
    }
  };

  const handleSendOffer = (offer: OfferItem) => {
    setOffersList(
      offersList.map((item) => {
        if (item.id === offer.id) {
          return {
            ...item,
            status: 'Sent',
            adminApproved: true,
            sentDate: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
    setSendOfferTarget(null);
  };

  const handleReissueExpiredOffer = (offerId: string) => {
    setOffersList(
      offersList.map((item) => {
        if (item.id === offerId) {
          return {
            ...item,
            status: 'Sent',
            expirationDate: '2026-03-25',
            sentDate: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Banner & Org Admin Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#0B192C]">Offer Governance & Executive Approvals</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052CC] font-bold text-[10px] rounded-md border border-blue-100 uppercase tracking-wider">
              ORG ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Create formal job offer packages, review compensation & equity breakdowns, approve pending offers, send offer letters & track candidate acceptances.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#0052CC] text-white font-bold text-xs rounded-xl hover:bg-[#0043A8] transition shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Formal Offer</span>
        </button>
      </div>

      {/* Offer Metrics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Requisitions Offered</span>
          <p className="text-2xl font-extrabold text-[#0B192C]">{totalOffersCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">Across organization</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-600">{pendingReviewCount}</p>
          <span className="text-[10px] text-amber-600 font-bold">Requires Admin Approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sent / Outstanding</span>
          <p className="text-2xl font-extrabold text-blue-600">{sentCount}</p>
          <span className="text-[10px] text-blue-600 font-bold">Awaiting candidate decision</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accepted Offers</span>
          <p className="text-2xl font-extrabold text-emerald-600">{acceptedCount}</p>
          <span className="text-[10px] text-emerald-700 font-bold">Successfully hired</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rejected / Expired</span>
          <p className="text-2xl font-extrabold text-rose-600">{rejectedCount + expiredCount}</p>
          <span className="text-[10px] text-gray-400 font-medium">{rejectedCount} declined, {expiredCount} expired</span>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Navigation Filter Tabs */}
        <div className="flex items-center space-x-1 bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Offers', count: totalOffersCount },
            { id: 'PENDING_REVIEW', label: 'Pending Review', count: pendingReviewCount },
            { id: 'SENT', label: 'Sent / Extended', count: sentCount },
            { id: 'ACCEPTED', label: 'Accepted', count: acceptedCount },
            { id: 'REJECTED', label: 'Rejected', count: rejectedCount },
            { id: 'EXPIRED', label: 'Expired', count: expiredCount },
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

        {/* Search & Department Filters */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate, email, job title..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium text-xs"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl outline-none font-bold bg-gray-50 text-gray-700 text-xs shrink-0"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>
      </div>

      {/* Offers List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredOffers.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 font-medium">
            No formal job offers match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">CANDIDATE</th>
                  <th className="p-4">POSITION & DEPT</th>
                  <th className="p-4">COMPENSATION PACKAGE</th>
                  <th className="p-4">OFFER STATUS</th>
                  <th className="p-4">ADMIN APPROVAL</th>
                  <th className="p-4">TARGET START</th>
                  <th className="p-4 pr-6 text-right">ORG ADMIN ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-blue-50/30 transition">
                    {/* Candidate */}
                    <td className="p-4 pl-6">
                      <p className="font-extrabold text-gray-900 leading-tight">{offer.candidateName}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{offer.candidateEmail}</p>
                    </td>

                    {/* Position */}
                    <td className="p-4">
                      <p className="font-bold text-[#0052CC]">{offer.jobTitle}</p>
                      <span className="text-[10px] text-gray-400 font-medium">{offer.department} • Recruiter: {offer.recruiterOwner}</span>
                    </td>

                    {/* Compensation */}
                    <td className="p-4">
                      <p className="font-extrabold text-gray-900">${offer.baseSalary.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">/ yr</span></p>
                      <p className="text-[10px] text-purple-700 font-semibold">
                        +${offer.joiningBonus.toLocaleString()} Sign-on | {offer.bonusPercent}% Bonus
                      </p>
                    </td>

                    {/* Offer Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center space-x-1 ${
                          offer.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : offer.status === 'Sent'
                            ? 'bg-blue-100 text-blue-800'
                            : offer.status === 'Pending Review' || offer.status === 'Draft'
                            ? 'bg-amber-100 text-amber-800'
                            : offer.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {offer.status === 'Accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {offer.status === 'Sent' && <Send className="w-3 h-3 mr-1" />}
                        {offer.status === 'Pending Review' && <Clock className="w-3 h-3 mr-1" />}
                        {offer.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {offer.status === 'Expired' && <AlertCircle className="w-3 h-3 mr-1" />}
                        <span>{offer.status}</span>
                      </span>
                    </td>

                    {/* Admin Approval Tag */}
                    <td className="p-4">
                      {offer.adminApproved ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100 inline-flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveOffer(offer.id)}
                          className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200 hover:bg-amber-100 transition inline-flex items-center space-x-1"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Approve Offer</span>
                        </button>
                      )}
                    </td>

                    {/* Target Start Date */}
                    <td className="p-4 text-gray-700 font-semibold">{offer.startDate}</td>

                    {/* Org Admin Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setReviewOffer(offer)}
                          title="Review Offer Package & Terms"
                          className="p-1.5 text-gray-500 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {(offer.status === 'Pending Review' || offer.status === 'Draft') && (
                          <button
                            onClick={() => setSendOfferTarget(offer)}
                            title="Send Formal Offer Letter"
                            className="px-2.5 py-1 bg-[#0052CC] text-white font-bold text-[10px] rounded-lg hover:bg-[#0043A8] transition shadow-xs flex items-center space-x-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Offer</span>
                          </button>
                        )}

                        {offer.status === 'Expired' && (
                          <button
                            onClick={() => handleReissueExpiredOffer(offer.id)}
                            title="Re-issue / Extend Expiration Date"
                            className="px-2.5 py-1 bg-amber-600 text-white font-bold text-[10px] rounded-lg hover:bg-amber-700 transition shadow-xs flex items-center space-x-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reissue</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. CREATE NEW FORMAL OFFER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Create Formal Offer Package</h3>
                <p className="text-xs text-gray-500">Executive Offer Letter & Compensation Structure</p>
              </div>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
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
                    placeholder="sarah@cyberdyne.io"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Job Requisition Title</label>
                  <select
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-gray-50 outline-none text-[#0052CC]"
                  >
                    <option value="Senior Full Stack Engineer">Senior Full Stack Engineer</option>
                    <option value="DevOps & Cloud Specialist">DevOps & Cloud Specialist</option>
                    <option value="Product Design Lead">Product Design Lead</option>
                    <option value="HR Talent Coordinator">HR Talent Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-gray-50 outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              {/* Compensation Breakdown Inputs */}
              <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-3">
                <span className="font-extrabold text-[#0052CC] text-xs uppercase tracking-wider block">
                  Executive Compensation & Equity Package
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Annual Base ($)</label>
                    <input
                      type="number"
                      required
                      value={newBaseSalary}
                      onChange={(e) => setNewBaseSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Signing Bonus ($)</label>
                    <input
                      type="number"
                      value={newJoiningBonus}
                      onChange={(e) => setNewJoiningBonus(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold outline-none bg-white text-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Annual Bonus (%)</label>
                    <input
                      type="number"
                      value={newBonusPercent}
                      onChange={(e) => setNewBonusPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Equity / Stock Grant Structure</label>
                  <input
                    type="text"
                    value={newEquityUnits}
                    onChange={(e) => setNewEquityUnits(e.target.value)}
                    placeholder="e.g. 15,000 RSUs (4-year vesting, 1-year cliff)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Offer Expiration Date</label>
                  <input
                    type="date"
                    required
                    value={newExpirationDate}
                    onChange={(e) => setNewExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assigned Recruiter</label>
                  <select
                    value={newRecruiterOwner}
                    onChange={(e) => setNewRecruiterOwner(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-gray-50 outline-none"
                  >
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="David Chen">David Chen</option>
                    <option value="Sophia Martinez">Sophia Martinez</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Benefits & Relocation Summary</label>
                <textarea
                  rows={2}
                  value={newBenefits}
                  onChange={(e) => setNewBenefits(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium outline-none text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md"
                >
                  Create & Approve Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. REVIEW OFFER PACKAGE DRAWER / MODAL */}
      {reviewOffer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReviewOffer(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Offer Letter Package Review</h3>
                <p className="text-xs text-gray-500">Candidate: {reviewOffer.candidateName}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Approval Banner */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Executive Approval</span>
                  <p className="font-extrabold text-gray-900 mt-0.5">
                    {reviewOffer.adminApproved ? 'Approved by Org Admin' : 'Pending Org Admin Review'}
                  </p>
                </div>
                {!reviewOffer.adminApproved && (
                  <button
                    onClick={() => handleApproveOffer(reviewOffer.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 text-xs"
                  >
                    Grant Approval
                  </button>
                )}
              </div>

              {/* Compensation Breakdown Grid */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <h4 className="font-extrabold text-[#0052CC] text-xs uppercase tracking-wider">
                  Compensation Package Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Annual Base Salary</span>
                    <p className="font-black text-sm text-gray-900">${reviewOffer.baseSalary.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Signing Bonus</span>
                    <p className="font-black text-sm text-purple-700">${reviewOffer.joiningBonus.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Performance Bonus</span>
                    <p className="font-black text-sm text-gray-900">{reviewOffer.bonusPercent}% Target</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Target Start Date</span>
                    <p className="font-black text-sm text-gray-900">{reviewOffer.startDate}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Equity & Stock Options</span>
                  <p className="font-bold text-gray-800 mt-0.5">{reviewOffer.equityUnits}</p>
                </div>
              </div>

              {/* Offer Expiration & Owner Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Offer Expiration</span>
                  <p className="font-bold text-gray-900 mt-0.5">{reviewOffer.expirationDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Recruiter</span>
                  <p className="font-bold text-gray-900 mt-0.5">{reviewOffer.recruiterOwner}</p>
                </div>
              </div>

              {/* Declination Reason if Rejected */}
              {reviewOffer.declinationReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="font-extrabold text-rose-800 text-xs">Declination Reason:</span>
                  <p className="text-gray-700 font-medium">{reviewOffer.declinationReason}</p>
                </div>
              )}

              {/* Benefits Summary */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-1">Perks & Benefits Summary</h4>
                <p className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-gray-700 font-medium leading-relaxed">
                  {reviewOffer.benefitsSummary}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReviewOffer(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Close Review
                </button>

                {(reviewOffer.status === 'Pending Review' || reviewOffer.status === 'Draft') && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSendOffer(reviewOffer);
                      setReviewOffer(null);
                    }}
                    className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md flex items-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Offer Letter</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONFIRM SEND OFFER MODAL */}
      {sendOfferTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs">
            <button
              onClick={() => setSendOfferTarget(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Send Formal Offer Letter</h3>
                <p className="text-xs text-gray-500">Candidate: {sendOfferTarget.candidateName}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 font-medium">
                Are you ready to send the official offer letter for <span className="font-bold text-gray-900">{sendOfferTarget.jobTitle}</span> to <span className="font-bold text-[#0052CC]">{sendOfferTarget.candidateEmail}</span>?
              </p>

              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Base Salary:</span>
                  <span>${sendOfferTarget.baseSalary.toLocaleString()} / yr</span>
                </div>
                <div className="flex justify-between font-bold text-purple-700">
                  <span>Sign-on Bonus:</span>
                  <span>${sendOfferTarget.joiningBonus.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSendOfferTarget(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOffer(sendOfferTarget)}
                  className="px-5 py-2 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] shadow-md flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm & Send Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
