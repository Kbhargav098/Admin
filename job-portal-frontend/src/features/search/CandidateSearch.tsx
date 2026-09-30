import React, { useState, useEffect } from 'react';
import { addAuditLog } from '../../pages/organization/Audit';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Download,
  Eye,
  UserCheck,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Globe,
  Award,
  FileText,
  X,
  History,
  CheckCircle,
  AlertCircle,
  Zap,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Building,
  User,
  Sliders,
  Check,
  Star,
  Info,
  Plus,
  Send,
  GraduationCap,
  Briefcase as JobIcon,
  HelpCircle,
  FileCheck,
  Lock,
} from 'lucide-react';

export interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobRole: string;
  headline: string;
  location: string;
  relocateWilling: boolean;
  expectedSalary: number;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  noticePeriod: 'Immediate' | '15 Days' | '30 Days' | '60 Days' | '90 Days';
  profileStatus: 'Active' | 'Available' | 'Not Available';
  lastActive: 'Today' | 'This Week' | 'This Month' | '2 Months Ago';
  languages: string[];
  experienceYrs: number;
  summary: string;
  skills: string[];
  workHistory: Array<{ company: string; role: string; duration: string; highlights: string }>;
  education: { degree: string; institution: string; year: string };
  resumeFileName: string;
  ugDegree?: string;
  pgDegree?: string;
  visaStatus?: string;
  gender?: string;
  age?: number;
  industry?: string;
}

export const CandidateSearch: React.FC = () => {
  // Wallet Balance State (Synced with localStorage)
  const [totalOrgTokens, setTotalOrgTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('clyptus_org_total_tokens');
      return saved ? JSON.parse(saved) : 650;
    } catch (e) {
      return 650;
    }
  });

  // Saved Bookmarked Profiles IDs
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_saved_candidates');
      return saved ? JSON.parse(saved) : ['cand-101', 'cand-103'];
    } catch (e) {
      return ['cand-101', 'cand-103'];
    }
  });

  // Shortlisted Candidate IDs
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_shortlisted_candidates');
      return saved ? JSON.parse(saved) : ['cand-102'];
    } catch (e) {
      return ['cand-102'];
    }
  });

  // Previously Viewed History (IDs of viewed candidates)
  const [viewedHistoryIds, setViewedHistoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clyptus_viewed_history');
      return saved ? JSON.parse(saved) : ['cand-[#102]', 'cand-104'];
    } catch (e) {
      return ['cand-[#102]', 'cand-104'];
    }
  });

  // UI Navigation Tabs
  const [mainTab, setMainTab] = useState<'SEARCH_FORM' | 'SAVED_PROFILES'>('SEARCH_FORM');
  const [formModeTab, setFormModeTab] = useState<'SEARCH_FORM' | 'SEARCH_BY_JD'>('SEARCH_FORM');
  const [country, setCountry] = useState<string>('India');
  const [savedSearchName, setSavedSearchName] = useState<string>('');

  // Modals / Drawers state
  const [activeProfile, setActiveProfile] = useState<CandidateRecord | null>(null);
  const [contactCandidate, setContactCandidate] = useState<CandidateRecord | null>(null);
  const [contactMessage, setContactMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SEARCH FORM CRITERIA (Matching Screenshot Exact UI)
  // Card 1: Keywords
  const [keywords, setKeywords] = useState<Array<{ id: string; text: string; isMandatory: boolean }>>([
    { id: 'kw-1', text: 'ai', isMandatory: true },
    { id: 'kw-2', text: 'frontend', isMandatory: true },
    { id: 'kw-3', text: 'Backend Developer', isMandatory: true },
  ]);
  const [newKeywordInput, setNewKeywordInput] = useState<string>('');
  const [booleanSearch, setBooleanSearch] = useState<boolean>(false);
  const [searchInOption, setSearchInOption] = useState<string>('Profile');
  const [excludeSynonyms, setExcludeSynonyms] = useState<boolean>(false);
  const [showExcludeKeywordsInput, setShowExcludeKeywordsInput] = useState<boolean>(false);
  const [excludeKeywordText, setExcludeKeywordText] = useState<string>('');
  const [excludedKeywordsList, setExcludedKeywordsList] = useState<string[]>([]);

  // Card 1: Experience & Location
  const [minExp, setMinExp] = useState<string>('Years');
  const [maxExp, setMaxExp] = useState<string>('Years');
  const [showAddMonths, setShowAddMonths] = useState<boolean>(false);
  const [extraMonths, setExtraMonths] = useState<string>('0');
  const [currentLocationInput, setCurrentLocationInput] = useState<string>('');
  const [includeRelocating, setIncludeRelocating] = useState<boolean>(true);
  const [showAddPrefLocation, setShowAddPrefLocation] = useState<boolean>(false);
  const [prefLocationText, setPrefLocationText] = useState<string>('');
  const [preferredLocationsList, setPreferredLocationsList] = useState<string[]>([]);

  // Card 2: Annual Salary & Notice Period
  const [minSalary, setMinSalary] = useState<string>('Lacs');
  const [maxSalary, setMaxSalary] = useState<string>('Lacs');
  const [showAddThousands, setShowAddThousands] = useState<boolean>(false);
  const [extraThousands, setExtraThousands] = useState<string>('0');
  const [includeUnmentionedSalary, setIncludeUnmentionedSalary] = useState<boolean>(true);
  const [noticePeriodPill, setNoticePeriodPill] = useState<string>('Any');
  const [noticeServingType, setNoticeServingType] = useState<string>('Without notice period');

  // Card 3: Education & Employment Details
  const [ugQualification, setUgQualification] = useState<string>('Any UG');
  const [pgQualification, setPgQualification] = useState<string>('Any PG');
  const [showDoctorateInput, setShowDoctorateInput] = useState<boolean>(false);
  const [doctorateText, setDoctorateText] = useState<string>('');
  const [industryInput, setIndustryInput] = useState<string>('');
  const [companyInput, setCompanyInput] = useState<string>('');

  // Card 4: Demographics, Visa Status & Age
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedDiffAbled, setSelectedDiffAbled] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState<string>('');
  const [selectedVisaStatuses, setSelectedVisaStatuses] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>('Min');
  const [maxAge, setMaxAge] = useState<string>('Max');

  // Sticky Bottom Bar
  const [timeFilter, setTimeFilter] = useState<string>('In last 6 months');

  // Job Description Search Tab State
  const [jdText, setJdText] = useState<string>('');
  const [isAiParsingJd, setIsAiParsingJd] = useState<boolean>(false);

  // Results Trigger Counter
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Show toast utility
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync state to localStorage & listen for events
  useEffect(() => {
    try {
      localStorage.setItem('clyptus_saved_candidates', JSON.stringify(savedCandidateIds));
      localStorage.setItem('clyptus_shortlisted_candidates', JSON.stringify(shortlistedIds));
      localStorage.setItem('clyptus_viewed_history', JSON.stringify(viewedHistoryIds));
      localStorage.setItem('clyptus_org_total_tokens', JSON.stringify(totalOrgTokens));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }, [savedCandidateIds, shortlistedIds, viewedHistoryIds, totalOrgTokens]);

  // Handlers for Keyword Tags
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newKeywordInput.trim()) {
      e.preventDefault();
      setKeywords([
        ...keywords,
        { id: `kw-${Date.now()}`, text: newKeywordInput.trim(), isMandatory: false },
      ]);
      setNewKeywordInput('');
    }
  };

  const toggleMandatoryKeyword = (id: string) => {
    setKeywords(
      keywords.map((kw) => (kw.id === id ? { ...kw, isMandatory: !kw.isMandatory } : kw))
    );
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter((kw) => kw.id !== id));
  };

  const clearAllKeywords = () => {
    setKeywords([]);
    setNewKeywordInput('');
  };

  // Clear All Form Fields
  const handleClearAll = () => {
    setKeywords([]);
    setNewKeywordInput('');
    setBooleanSearch(false);
    setSearchInOption('Profile');
    setExcludeSynonyms(false);
    setExcludedKeywordsList([]);
    setMinExp('Years');
    setMaxExp('Years');
    setShowAddMonths(false);
    setCurrentLocationInput('');
    setIncludeRelocating(true);
    setPreferredLocationsList([]);
    setMinSalary('Lacs');
    setMaxSalary('Lacs');
    setShowAddThousands(false);
    setIncludeUnmentionedSalary(true);
    setNoticePeriodPill('Any');
    setNoticeServingType('Without notice period');
    setUgQualification('Any UG');
    setPgQualification('Any PG');
    setShowDoctorateInput(false);
    setDoctorateText('');
    setIndustryInput('');
    setCompanyInput('');
    setSelectedGenders([]);
    setSelectedDiffAbled([]);
    setLanguageInput('');
    setSelectedVisaStatuses([]);
    setMinAge('Min');
    setMaxAge('Max');
    triggerToast('All candidate search criteria have been cleared.');
  };

  // Dataset of 50 Diverse Candidate Profiles
  const default50Candidates: CandidateRecord[] = [
    {
      id: 'cand-101',
      name: 'Bruce Wayne',
      email: 'bruce.wayne@gothamtech.com',
      phone: '+1 (555) 901-2345',
      jobRole: 'Full Stack Engineer',
      headline: 'Lead Full Stack Architect & Distributed Systems Specialist',
      location: 'San Francisco, CA',
      relocateWilling: true,
      expectedSalary: 28,
      workMode: 'Remote',
      employmentType: 'Full-time',
      noticePeriod: 'Immediate',
      profileStatus: 'Active',
      lastActive: 'Today',
      languages: ['English', 'Spanish'],
      experienceYrs: 8,
      summary: 'Passionate software architect with 8+ years building enterprise SaaS, microservices, and real-time streaming engines in TypeScript, Node.js, and React.',
      skills: ['ai', 'frontend', 'Backend Developer', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      workHistory: [{ company: 'Wayne Enterprises Tech', role: 'Principal Engineer', duration: '2022 - Present', highlights: 'Architected microservices handling 2M rpm.' }],
      education: { degree: 'M.S. Computer Science', institution: 'Gotham Tech University', year: '2018' },
      resumeFileName: 'Bruce_Wayne_Architect_Resume.pdf',
      ugDegree: 'B.Tech CS',
      pgDegree: 'M.S. CS',
      visaStatus: 'US Citizen',
      gender: 'Male candidates',
      age: 32,
      industry: 'IT Software',
    },
    {
      id: 'cand-102',
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.io',
      phone: '+1 (555) 345-6789',
      jobRole: 'DevOps & Cloud Specialist',
      headline: 'Principal Infrastructure Engineer & Multi-Cloud Architect',
      location: 'Austin, TX',
      relocateWilling: true,
      expectedSalary: 24,
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      noticePeriod: '15 Days',
      profileStatus: 'Available',
      lastActive: 'Today',
      languages: ['English', 'French'],
      experienceYrs: 10,
      summary: 'DevOps leader specializing in Kubernetes cluster management, Terraform IaC pipelines, and Zero-Downtime AWS/GCP cloud deployments.',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python', 'CI/CD', 'Backend Developer'],
      workHistory: [{ company: 'Cyberdyne Systems', role: 'Staff DevOps Engineer', duration: '2020 - Present', highlights: 'Automated CI/CD for 140+ microservices.' }],
      education: { degree: 'B.S. Information Technology', institution: 'UT Austin', year: '2016' },
      resumeFileName: 'Sarah_Connor_DevOps_Resume.pdf',
      ugDegree: 'B.S. IT',
      pgDegree: 'No PG',
      visaStatus: 'Green Card Holder',
      gender: 'Female candidates',
      age: 34,
      industry: 'IT Software',
    },
    {
      id: 'cand-103',
      name: 'Diana Prince',
      email: 'diana.prince@themyscira.design',
      phone: '+1 (555) 456-7890',
      jobRole: 'Product Design Lead',
      headline: 'Staff UX/UI Designer & Enterprise Design System Lead',
      location: 'New York, NY',
      relocateWilling: false,
      expectedSalary: 22,
      workMode: 'Remote',
      employmentType: 'Full-time',
      noticePeriod: '30 Days',
      profileStatus: 'Active',
      lastActive: 'This Week',
      languages: ['English', 'German', 'Italian'],
      experienceYrs: 7,
      summary: 'UX Designer focused on complex SaaS workflows, design token systems, interactive prototyping, and data visualization in Figma.',
      skills: ['frontend', 'Figma', 'UX Research', 'Design Systems', 'Prototyping', 'User Testing', 'CSS/HTML'],
      workHistory: [{ company: 'Themyscira Creative Studios', role: 'Lead Product Designer', duration: '2021 - Present', highlights: 'Built multi-brand UI design library.' }],
      education: { degree: 'B.F.A. Interactive Media', institution: 'Pratt Institute', year: '2019' },
      resumeFileName: 'Diana_Prince_Design_Portfolio.pdf',
      ugDegree: 'B.F.A. Media',
      pgDegree: 'No PG',
      visaStatus: 'Authorized to work in the US',
      gender: 'Female candidates',
      age: 29,
      industry: 'Design & Media',
    },
    {
      id: 'cand-104',
      name: 'Clark Kent',
      email: 'clark.kent@metropolis.org',
      phone: '+1 (555) 234-5678',
      jobRole: 'HR Talent Coordinator',
      headline: 'Senior Talent Acquisition Specialist & HR Operations Manager',
      location: 'Chicago, IL',
      relocateWilling: true,
      expectedSalary: 16,
      workMode: 'Onsite',
      employmentType: 'Full-time',
      noticePeriod: 'Immediate',
      profileStatus: 'Available',
      lastActive: 'Today',
      languages: ['English', 'Spanish'],
      experienceYrs: 5,
      summary: 'Data-driven HR specialist with expertise in high-volume sourcing, candidate experience optimization, and ATS pipeline management.',
      skills: ['Talent Sourcing', 'ATS Management', 'Interviewing', 'HR Operations', 'LinkedIn Recruiter'],
      workHistory: [{ company: 'Daily Planet Media', role: 'Talent Acquisition Specialist', duration: '2021 - Present', highlights: 'Hired 120+ tech professionals annually.' }],
      education: { degree: 'B.A. Communications & HR', institution: 'Northwestern University', year: '2021' },
      resumeFileName: 'Clark_Kent_HR_Resume.pdf',
      ugDegree: 'B.A. HR',
      pgDegree: 'No PG',
      visaStatus: 'US Citizen',
      gender: 'Male candidates',
      age: 28,
      industry: 'Human Resources',
    },
    {
      id: 'cand-105',
      name: 'Hal Jordan',
      email: 'hal.jordan@coastcity.com',
      phone: '+1 (555) 789-0123',
      jobRole: 'Frontend Developer',
      headline: 'Senior React Developer & Micro-Frontend Specialist',
      location: 'Seattle, WA',
      relocateWilling: true,
      expectedSalary: 18,
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      noticePeriod: '30 Days',
      profileStatus: 'Active',
      lastActive: 'This Week',
      languages: ['English'],
      experienceYrs: 4,
      summary: 'Frontend engineer with expertise in Next.js, Redux Toolkit, WebGL graphics, and web performance optimization.',
      skills: ['frontend', 'React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Redux', 'WebGL'],
      workHistory: [{ company: 'Ferris Aircraft Tech', role: 'Frontend Engineer', duration: '2022 - Present', highlights: 'Accelerated page load speed by 40%.' }],
      education: { degree: 'B.S. Software Engineering', institution: 'University of Washington', year: '2022' },
      resumeFileName: 'Hal_Jordan_Frontend_Resume.pdf',
      ugDegree: 'B.S. SE',
      pgDegree: 'No PG',
      visaStatus: 'Have H1 Visa',
      gender: 'Male candidates',
      age: 26,
      industry: 'IT Software',
    },
    {
      id: 'cand-106',
      name: 'Arthur Curry',
      email: 'arthur.curry@atlantis.org',
      phone: '+1 (555) 890-1234',
      jobRole: 'Database Architect',
      headline: 'Principal Database Architect & Query Optimization Specialist',
      location: 'Boston, MA',
      relocateWilling: false,
      expectedSalary: 30,
      workMode: 'Remote',
      employmentType: 'Contract',
      noticePeriod: '60 Days',
      profileStatus: 'Available',
      lastActive: 'This Month',
      languages: ['English', 'Greek'],
      experienceYrs: 12,
      summary: 'Database performance specialist expert in PostgreSQL sharding, TimescaleDB, MongoDB clusters, and zero-loss database migrations.',
      skills: ['PostgreSQL', 'MongoDB', 'TimescaleDB', 'Query Tuning', 'Redis', 'Cassandra', 'Backend Developer'],
      workHistory: [{ company: 'Oceanic Data Systems', role: 'Lead Database Architect', duration: '2018 - Present', highlights: 'Managed 50TB distributed PostgreSQL engine.' }],
      education: { degree: 'M.S. Database Engineering', institution: 'MIT', year: '2014' },
      resumeFileName: 'Arthur_Curry_Database_Resume.pdf',
      ugDegree: 'B.S. CS',
      pgDegree: 'M.S. CS',
      visaStatus: 'US Citizen',
      gender: 'Male candidates',
      age: 36,
      industry: 'Fintech',
    },
    {
      id: 'cand-107',
      name: 'Barry Allen',
      email: 'barry.allen@centralcity.lab',
      phone: '+1 (555) 123-4567',
      jobRole: 'Real-time Systems Engineer',
      headline: 'High-Speed Low-Latency C++ & Go Developer',
      location: 'Los Angeles, CA',
      relocateWilling: true,
      expectedSalary: 25,
      workMode: 'Remote',
      employmentType: 'Full-time',
      noticePeriod: 'Immediate',
      profileStatus: 'Active',
      lastActive: 'Today',
      languages: ['English'],
      experienceYrs: 6,
      summary: 'Low-latency software specialist developing high-frequency data pipelines in Go, C++, Kafka, and WebSockets.',
      skills: ['ai', 'Go', 'C++', 'Kafka', 'WebSockets', 'gRPC', 'Distributed Systems'],
      workHistory: [{ company: 'S.T.A.R. Labs', role: 'Systems Developer', duration: '2020 - Present', highlights: 'Reduced data processing latency to sub-millisecond.' }],
      education: { degree: 'B.S. Forensic Science & CS', institution: 'UCLA', year: '2020' },
      resumeFileName: 'Barry_Allen_Systems_Resume.pdf',
      ugDegree: 'B.S. CS',
      pgDegree: 'No PG',
      visaStatus: 'US Citizen',
      gender: 'Male candidates',
      age: 27,
      industry: 'Healthcare',
    },
    {
      id: 'cand-108',
      name: 'Victor Stone',
      email: 'victor.stone@cybertech.org',
      phone: '+1 (555) 678-9012',
      jobRole: 'Cyber Security Specialist',
      headline: 'Staff Information Security & Penetration Testing Lead',
      location: 'Detroit, MI',
      relocateWilling: false,
      expectedSalary: 26,
      workMode: 'Onsite',
      employmentType: 'Full-time',
      noticePeriod: '30 Days',
      profileStatus: 'Available',
      lastActive: 'This Week',
      languages: ['English'],
      experienceYrs: 9,
      summary: 'Certified Information Security Manager (CISM) specialized in SOC 2 compliance, penetration testing, zero-trust network design, and threat analysis.',
      skills: ['Cyber Security', 'Penetration Testing', 'SIEM', 'Zero Trust', 'Python', 'Network Audit'],
      workHistory: [{ company: 'STAR Labs Cyber', role: 'Security Architect', duration: '2019 - Present', highlights: 'Achieved 100% SOC 2 Type II compliance.' }],
      education: { degree: 'M.S. Cyber Security', institution: 'University of Michigan', year: '2017' },
      resumeFileName: 'Victor_Stone_Security_Resume.pdf',
      ugDegree: 'B.S. Security',
      pgDegree: 'M.S. Security',
      visaStatus: 'US Citizen',
      gender: 'Male candidates',
      age: 31,
      industry: 'IT Software',
    },
    {
      id: 'cand-109',
      name: 'Natasha Romanoff',
      email: 'natasha.r@shield.gov',
      phone: '+1 (555) 567-8901',
      jobRole: 'Technical Program Manager',
      headline: 'Principal Technical Program Manager & Agile Operations Director',
      location: 'New York, NY',
      relocateWilling: true,
      expectedSalary: 27,
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      noticePeriod: '15 Days',
      profileStatus: 'Active',
      lastActive: 'Today',
      languages: ['English', 'Russian', 'French'],
      experienceYrs: 11,
      summary: 'Results-driven TPM with 11+ years delivering multi-million dollar engineering initiatives across global cross-functional product teams.',
      skills: ['Agile Leadership', 'Scrum', 'Jira', 'Stakeholder Management', 'Risk Assessment', 'Roadmapping'],
      workHistory: [{ company: 'S.H.I.E.L.D. Tech Ops', role: 'Senior TPM Lead', duration: '2017 - Present', highlights: 'Managed 15 engineering squads across 3 continents.' }],
      education: { degree: 'B.S. Industrial Engineering', institution: 'Columbia University', year: '2015' },
      resumeFileName: 'Natasha_Romanoff_TPM_Resume.pdf',
      ugDegree: 'B.S. IE',
      pgDegree: 'No PG',
      visaStatus: 'Have L1 Visa',
      gender: 'Female candidates',
      age: 33,
      industry: 'Fintech',
    },
    {
      id: 'cand-110',
      name: 'Tony Stark',
      email: 'tony.stark@starkind.com',
      phone: '+1 (555) 999-0000',
      jobRole: 'AI & Robotics Lead',
      headline: 'Executive Director of AI Systems & Hardware Automation Architect',
      location: 'San Jose, CA',
      relocateWilling: true,
      expectedSalary: 45,
      workMode: 'Remote',
      employmentType: 'Full-time',
      noticePeriod: 'Immediate',
      profileStatus: 'Active',
      lastActive: 'Today',
      languages: ['English', 'Mandarin'],
      experienceYrs: 15,
      summary: 'Visionary engineer & AI researcher building generative AI, neural network models, and autonomous hardware control engines in PyTorch and C++.',
      skills: ['ai', 'PyTorch', 'C++', 'Python', 'Computer Vision', 'Robotics', 'TensorFlow', 'Backend Developer'],
      workHistory: [{ company: 'Stark Industries R&D', role: 'Chief Scientist', duration: '2011 - Present', highlights: 'Authored 25+ patents in AI automation.' }],
      education: { degree: 'Ph.D. Artificial Intelligence & Robotics', institution: 'MIT', year: '2011' },
      resumeFileName: 'Tony_Stark_AI_Executive_Resume.pdf',
      ugDegree: 'B.S. Physics',
      pgDegree: 'Ph.D. AI',
      visaStatus: 'US Citizen',
      gender: 'Male candidates',
      age: 40,
      industry: 'IT Software',
    },
  ];

  // Dynamically generate remaining 40 candidates for full 50 dataset
  const extra40Candidates: CandidateRecord[] = Array.from({ length: 40 }).map((_, index) => {
    const idNum = 111 + index;
    const roles = [
      'Backend Engineer',
      'Data Scientist',
      'Mobile iOS Developer',
      'Android Lead',
      'QA Manager',
      'Cloud Solutions Architect',
      'System Engineer',
      'Scrum Master',
      'Security Engineer',
      'Full Stack Developer',
    ];
    const cities = [
      'San Francisco, CA',
      'New York, NY',
      'Austin, TX',
      'Seattle, WA',
      'Chicago, IL',
      'Denver, CO',
      'Miami, FL',
      'Boston, MA',
      'Atlanta, GA',
      'Remote',
      'Bengaluru, India',
      'Mumbai, India',
    ];
    const names = [
      'Steve Rogers', 'Wanda Maximoff', 'Peter Parker', 'Stephen Strange', 'Carol Danvers',
      'T\'Challa Udaku', 'James Rhodes', 'Sam Wilson', 'Bucky Barnes', 'Scott Lang',
      'Hope Van Dyne', 'Nick Fury', 'Maria Hill', 'Phil Coulson', 'Matt Murdock',
      'Jessica Jones', 'Luke Cage', 'Danny Rand', 'Frank Castle', 'Jennifer Walters',
      'Marc Spector', 'Steven Grant', 'Kamala Khan', 'Miles Morales', 'Gwen Stacy',
      'Miguel O\'Hara', 'Kate Bishop', 'Clint Barton', 'Laura Kinney', 'Logan Howlett',
      'Charles Xavier', 'Erik Lehnsherr', 'Ororo Munroe', 'Jean Grey', 'Scott Summers',
      'Hank McCoy', 'Remy LeBeau', 'Anna Marie', 'Kurt Wagner', 'Piotr Rasputin'
    ];
    const skillsList = [
      ['ai', 'Python', 'Django', 'PostgreSQL', 'Docker'],
      ['frontend', 'React', 'TypeScript', 'GraphQL', 'TailwindCSS'],
      ['Backend Developer', 'AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
      ['iOS', 'Swift', 'SwiftUI', 'Objective-C', 'frontend'],
      ['Backend Developer', 'Java', 'Spring Boot', 'Microservices', 'Kafka'],
      ['ai', 'Machine Learning', 'TensorFlow', 'Python', 'Pandas'],
    ];

    const roleName = roles[index % roles.length];
    const candName = names[index] || `Candidate #${idNum}`;
    const city = cities[index % cities.length];
    const exp = (index % 12) + 1;
    const salary = 12 + (index % 15) * 2;
    const workModeVal: 'Remote' | 'Hybrid' | 'Onsite' = index % 3 === 0 ? 'Remote' : index % 3 === 1 ? 'Hybrid' : 'Onsite';
    const empTypeVal: 'Full-time' | 'Part-time' | 'Contract' = index % 4 === 0 ? 'Contract' : index % 4 === 1 ? 'Part-time' : 'Full-time';
    const noticeVal: 'Immediate' | '15 Days' | '30 Days' | '60 Days' | '90 Days' = index % 5 === 0 ? 'Immediate' : index % 5 === 1 ? '15 Days' : index % 5 === 2 ? '30 Days' : '60 Days';
    const statusVal: 'Active' | 'Available' | 'Not Available' = index % 4 === 3 ? 'Not Available' : index % 2 === 0 ? 'Active' : 'Available';
    const genderVal = index % 2 === 0 ? 'Male candidates' : 'Female candidates';
    const visaVal = index % 3 === 0 ? 'US Citizen' : index % 3 === 1 ? 'Have H1 Visa' : 'Green Card Holder';

    return {
      id: `cand-${idNum}`,
      name: candName,
      email: `${candName.toLowerCase().replace(/[^a-z]/g, '.')}@candidate.org`,
      phone: `+1 (555) ${100 + index}-${2000 + index}`,
      jobRole: roleName,
      headline: `Experienced ${roleName} with ${exp}+ Years Expertise`,
      location: city,
      relocateWilling: index % 2 === 0,
      expectedSalary: salary,
      workMode: workModeVal,
      employmentType: empTypeVal,
      noticePeriod: noticeVal,
      profileStatus: statusVal,
      lastActive: index % 3 === 0 ? 'Today' : index % 3 === 1 ? 'This Week' : 'This Month',
      languages: ['English', index % 2 === 0 ? 'Spanish' : 'French'],
      experienceYrs: exp,
      summary: `Accomplished ${roleName} specializing in scalable architecture, clean code principles, and cross-functional team delivery.`,
      skills: skillsList[index % skillsList.length],
      workHistory: [{ company: 'Tech Innovation Global', role: roleName, duration: '2021 - Present', highlights: 'Led core technical architecture projects.' }],
      education: { degree: 'B.S. Computer Science', institution: 'State University', year: '2019' },
      resumeFileName: `${candName.replace(/\s+/g, '_')}_Resume.pdf`,
      ugDegree: 'B.S. CS',
      pgDegree: index % 2 === 0 ? 'M.S. CS' : 'No PG',
      visaStatus: visaVal,
      gender: genderVal,
      age: 24 + (index % 15),
      industry: 'IT Software',
    };
  });

  const all50Candidates: CandidateRecord[] = [...default50Candidates, ...extra40Candidates];

  // FILTERING LOGIC MATCHING FORM CRITERIA
  const filteredCandidates = all50Candidates.filter((cand) => {
    // If in saved profiles tab, filter specifically by Saved IDs and candidate name
    if (mainTab === 'SAVED_PROFILES') {
      if (!savedCandidateIds.includes(cand.id)) return false;
      if (savedSearchName.trim()) {
        return cand.name.toLowerCase().includes(savedSearchName.toLowerCase().trim());
      }
      return true;
    }

    // 1. Keyword search (Mandatory keywords MUST match)
    if (keywords.length > 0) {
      for (const kw of keywords) {
        const query = kw.text.toLowerCase().trim();
        if (!query) continue;
        const matchesSkill = cand.skills.some((s) => s.toLowerCase().includes(query));
        const matchesRole = cand.jobRole.toLowerCase().includes(query);
        const matchesSummary = cand.summary.toLowerCase().includes(query);
        const matchesName = cand.name.toLowerCase().includes(query);

        const hasMatch = matchesSkill || matchesRole || matchesSummary || matchesName;

        if (kw.isMandatory && !hasMatch) {
          return false;
        }
      }
    }

    // 2. Excluded Keywords
    if (excludedKeywordsList.length > 0) {
      const containsExcluded = excludedKeywordsList.some((ex) => {
        const exLow = ex.toLowerCase();
        return (
          cand.skills.some((s) => s.toLowerCase().includes(exLow)) ||
          cand.jobRole.toLowerCase().includes(exLow)
        );
      });
      if (containsExcluded) return false;
    }

    // 3. Experience Minimum & Maximum
    if (minExp !== 'Years') {
      const minNum = parseInt(minExp, 10);
      if (!isNaN(minNum) && cand.experienceYrs < minNum) return false;
    }
    if (maxExp !== 'Years') {
      const maxNum = parseInt(maxExp, 10);
      if (!isNaN(maxNum) && cand.experienceYrs > maxNum) return false;
    }

    // 4. Current Location
    if (currentLocationInput.trim()) {
      const locQuery = currentLocationInput.toLowerCase().trim();
      const matchesLocation = cand.location.toLowerCase().includes(locQuery);
      if (!matchesLocation) {
        if (!includeRelocating || !cand.relocateWilling) return false;
      }
    }

    // 5. Annual Salary
    if (minSalary !== 'Lacs') {
      const minSalNum = parseInt(minSalary, 10);
      if (!isNaN(minSalNum) && cand.expectedSalary < minSalNum) return false;
    }
    if (maxSalary !== 'Lacs') {
      const maxSalNum = parseInt(maxSalary, 10);
      if (!isNaN(maxSalNum) && cand.expectedSalary > maxSalNum) return false;
    }

    // 6. Notice Period Pill
    if (noticePeriodPill !== 'Any') {
      if (noticePeriodPill === 'Immediate joiner' && cand.noticePeriod !== 'Immediate') return false;
      if (noticePeriodPill === 'Upto 30 days' && cand.noticePeriod !== 'Immediate' && cand.noticePeriod !== '15 Days' && cand.noticePeriod !== '30 Days') return false;
      if (noticePeriodPill === 'Upto 45 days' && (cand.noticePeriod === '60 Days' || cand.noticePeriod === '90 Days')) return false;
      if (noticePeriodPill === 'Upto 60 days' && cand.noticePeriod === '90 Days') return false;
    }

    // 7. Education UG & PG
    if (ugQualification === 'Specific UG' && (!cand.ugDegree || cand.ugDegree === 'No UG')) return false;
    if (ugQualification === 'No UG' && cand.ugDegree && cand.ugDegree !== 'No UG') return false;

    if (pgQualification === 'Specific PG' && (!cand.pgDegree || cand.pgDegree === 'No PG')) return false;
    if (pgQualification === 'No PG' && cand.pgDegree && cand.pgDegree !== 'No PG') return false;

    // 8. Industry & Company
    if (industryInput.trim()) {
      const indQuery = industryInput.toLowerCase().trim();
      if (!cand.industry || !cand.industry.toLowerCase().includes(indQuery)) return false;
    }
    if (companyInput.trim()) {
      const compQuery = companyInput.toLowerCase().trim();
      const matchesCompany = cand.workHistory.some(
        (wh) => wh.company.toLowerCase().includes(compQuery) || wh.role.toLowerCase().includes(compQuery)
      );
      if (!matchesCompany) return false;
    }

    // 9. Gender filter
    if (selectedGenders.length > 0) {
      if (!cand.gender || !selectedGenders.includes(cand.gender)) return false;
    }

    // 10. Visa Status filter
    if (selectedVisaStatuses.length > 0) {
      if (!cand.visaStatus || !selectedVisaStatuses.includes(cand.visaStatus)) return false;
    }

    // 11. Age Range filter
    if (minAge !== 'Min') {
      const minA = parseInt(minAge, 10);
      if (!isNaN(minA) && cand.age && cand.age < minA) return false;
    }
    if (maxAge !== 'Max') {
      const maxA = parseInt(maxAge, 10);
      if (!isNaN(maxA) && cand.age && cand.age > maxA) return false;
    }

    return true;
  });

  // Toggle candidate bookmark / save
  const toggleSaveCandidate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedCandidateIds.includes(id)) {
      setSavedCandidateIds(savedCandidateIds.filter((item) => item !== id));
      triggerToast('Candidate profile removed from saved profiles.');
    } else {
      setSavedCandidateIds([...savedCandidateIds, id]);
      triggerToast('Candidate profile saved successfully!');
    }
  };

  // Toggle shortlist candidate
  const toggleShortlistCandidate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (shortlistedIds.includes(id)) {
      setShortlistedIds(shortlistedIds.filter((item) => item !== id));
      triggerToast('Candidate removed from shortlist.');
    } else {
      setShortlistedIds([...shortlistedIds, id]);
      triggerToast('Candidate shortlisted for active open position!');
    }
  };

  // Action: Open Candidate Profile (Consumes 1 Token)
  const handleOpenCandidateProfile = (cand: CandidateRecord) => {
    if (totalOrgTokens < 1) {
      alert('Insufficient token balance! Contact your Organization Admin to allocate additional tokens.');
      return;
    }

    // Deduct 1 Token for viewing full profile if not already viewed in session
    if (!viewedHistoryIds.includes(cand.id)) {
      const newBalance = totalOrgTokens - 1;
      setTotalOrgTokens(newBalance);
      addAuditLog(
        'APPLICATION_CHANGE',
        'Candidate Profile Unlocked',
        `Unlocked full candidate profile for ${cand.name} (Cost: 1 Token)`,
        { candidate: cand.name, tokenCost: 1, remainingBalance: newBalance }
      );
      const newHistory = [cand.id, ...viewedHistoryIds.filter((id) => id !== cand.id)];
      setViewedHistoryIds(newHistory);
    }

    setActiveProfile(cand);
  };

  // Action: Download Resume / Profile (Consumes 2 Tokens & Triggers File Download)
  const handleDownloadResume = (cand: CandidateRecord) => {
    if (totalOrgTokens < 2) {
      alert('Insufficient token balance! Downloading candidate resume requires 2 tokens.');
      return;
    }

    // Deduct 2 Tokens for downloading resume
    const newBalance = totalOrgTokens - 2;
    setTotalOrgTokens(newBalance);

    addAuditLog(
      'APPLICATION_CHANGE',
      'Candidate Resume Downloaded',
      `Downloaded candidate resume for ${cand.name} (${cand.resumeFileName}) - Cost: 2 Tokens`,
      { candidate: cand.name, resumeFile: cand.resumeFileName, tokenCost: 2, remainingBalance: newBalance }
    );

    const resumeText = `================================================================================
CANDIDATE VERIFIED RESUME PROFILE
================================================================================
Name              : ${cand.name}
Role              : ${cand.jobRole}
Experience        : ${cand.experienceYrs} Years
Location          : ${cand.location}
Relocation        : ${cand.relocateWilling ? 'Yes (Willing to Relocate)' : 'No'}
Expected Salary   : ₹${cand.expectedSalary} LPA / $${cand.expectedSalary * 1000}/yr
Notice Period     : ${cand.noticePeriod}
Work Mode         : ${cand.workMode}
Employment Type   : ${cand.employmentType}
Profile Status    : ${cand.profileStatus}
Last Active       : ${cand.lastActive}
Languages Known   : ${cand.languages ? cand.languages.join(', ') : 'English'}
Visa Status       : ${cand.visaStatus || 'US Citizen / Authorized'}

--------------------------------------------------------------------------------
TECHNICAL SKILLS & COMPETENCIES
--------------------------------------------------------------------------------
Key Skills        : ${cand.skills.join(', ')}

--------------------------------------------------------------------------------
EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
${cand.summary}

================================================================================
VERIFIED TALENT RECORD - CLYPTUS RECRUITMENT ATS
================================================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${cand.name.replace(/\s+/g, '_')}_Resume.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded ${cand.name}'s resume! (2 Tokens deducted)`);
  };

  // Action: Send Message to Candidate
  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactCandidate || !contactMessage.trim()) return;

    addAuditLog(
      'RECRUITER_ACTION',
      'Candidate Direct Message Sent',
      `Sent direct interview message to candidate ${contactCandidate.name}`,
      { candidate: contactCandidate.name, messagePreview: contactMessage.substring(0, 50) }
    );

    triggerToast(`Message sent successfully to ${contactCandidate.name}!`);
    setContactCandidate(null);
    setContactMessage('');
  };

  // AI Extract Keywords from JD
  const handleParseJdAi = () => {
    if (!jdText.trim()) return;
    setIsAiParsingJd(true);
    setTimeout(() => {
      // Parse sample keywords from text
      const sampleExtracted = ['React', 'TypeScript', 'Node.js', 'AWS', 'System Design'];
      setKeywords(
        sampleExtracted.map((text, idx) => ({
          id: `kw-jd-${idx}`,
          text,
          isMandatory: idx < 2,
        }))
      );
      setIsAiParsingJd(false);
      setFormModeTab('SEARCH_FORM');
      triggerToast('AI extracted 5 target skill keywords from Job Description!');
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto pb-24 text-gray-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B192C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/30 flex items-center space-x-3 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0B192C] tracking-tight">
              Find the right candidates with AI
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Source verified talent matching exact skills, experience, relocation & salary criteria.
            </p>
          </div>
        </div>

        {/* Right Header Actions: Tokens & Country Select */}
        <div className="flex items-center space-x-3">
          {/* Token Balance Pill */}
          <div className="flex items-center space-x-2 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200">
            <Zap className="w-4 h-4 text-purple-600 fill-purple-600" />
            <span className="text-xs font-black text-purple-900">
              {totalOrgTokens} <span className="text-[10px] font-bold text-purple-600">Tokens</span>
            </span>
          </div>

          {/* Country Selection Dropdown matching reference image top right */}
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-9 font-bold text-xs text-gray-700 shadow-xs hover:border-purple-400 focus:outline-none cursor-pointer"
            >
              <option value="India">🌐 India</option>
              <option value="United States">🌐 United States</option>
              <option value="United Kingdom">🌐 United Kingdom</option>
              <option value="Global">🌐 Global Sourcing</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Primary Mode Tabs Container: Search form | Search by Job Description */}
      <div className="bg-gray-100/80 p-1.5 rounded-2xl inline-flex items-center space-x-1 border border-gray-200/80 text-xs font-bold">
        <button
          onClick={() => {
            setMainTab('SEARCH_FORM');
            setFormModeTab('SEARCH_FORM');
          }}
          className={`px-6 py-2.5 rounded-xl transition ${
            mainTab === 'SEARCH_FORM' && formModeTab === 'SEARCH_FORM'
              ? 'bg-white text-purple-700 shadow-xs font-black'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Search form
        </button>

        <button
          onClick={() => {
            setMainTab('SEARCH_FORM');
            setFormModeTab('SEARCH_BY_JD');
          }}
          className={`px-6 py-2.5 rounded-xl transition ${
            mainTab === 'SEARCH_FORM' && formModeTab === 'SEARCH_BY_JD'
              ? 'bg-white text-purple-700 shadow-xs font-black'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Search by Job Description
        </button>

        <button
          onClick={() => setMainTab('SAVED_PROFILES')}
          className={`px-6 py-2.5 rounded-xl transition flex items-center space-x-1.5 ${
            mainTab === 'SAVED_PROFILES'
              ? 'bg-white text-purple-700 shadow-xs font-black'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Saved Profiles ({savedCandidateIds.length})</span>
        </button>
      </div>

      {/* SEARCH BY JOB DESCRIPTION VIEW */}
      {mainTab === 'SEARCH_FORM' && formModeTab === 'SEARCH_BY_JD' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-sm text-gray-900">AI Job Description Keyword Extractor</h3>
          </div>
          <p className="text-xs text-gray-500">
            Paste your complete job description below. Clyptus AI will parse essential skill keywords, minimum experience, and job roles automatically to populate the search form.
          </p>
          <textarea
            rows={6}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste Job Description here (e.g. Seeking Senior React / Node.js Full Stack Architect with 5+ years experience in AWS microservices...)"
            className="w-full p-4 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600 font-medium"
          />
          <div className="flex justify-end">
            <button
              onClick={handleParseJdAi}
              disabled={isAiParsingJd || !jdText.trim()}
              className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition disabled:opacity-50 flex items-center space-x-2 shadow-xs"
            >
              {isAiParsingJd ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Extracting Keywords with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Keywords & Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SAVED PROFILES SEARCH BAR */}
      {mainTab === 'SAVED_PROFILES' && (
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <Bookmark className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>Saved Candidate Profiles ({savedCandidateIds.length})</span>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-amber-500" />
            <input
              type="text"
              value={savedSearchName}
              onChange={(e) => setSavedSearchName(e.target.value)}
              placeholder="Search saved profiles directly using Candidate Name..."
              className="w-full pl-10 pr-4 py-2 border border-amber-300 bg-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-xs text-gray-800"
            />
          </div>
        </div>
      )}

      {/* MAIN SEARCH FORM (Refined exact design from Screenshot 1, 2 & 3) */}
      {mainTab === 'SEARCH_FORM' && formModeTab === 'SEARCH_FORM' && (
        <div className="space-y-6">
          {/* CARD 1: KEYWORDS, EXPERIENCE & LOCATION */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            {/* Keywords Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-extrabold text-xs text-gray-900">Keywords</label>

                {/* Right controls: Boolean search & Search in profile */}
                <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={booleanSearch}
                      onChange={(e) => setBooleanSearch(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Boolean search</span>
                  </label>

                  <div className="flex items-center space-x-1.5">
                    <span>Search in</span>
                    <select
                      value={searchInOption}
                      onChange={(e) => setSearchInOption(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 bg-gray-50 outline-none"
                    >
                      <option value="Profile">Profile</option>
                      <option value="Entire Resume">Entire Resume</option>
                      <option value="Skills Only">Skills Only</option>
                      <option value="Job Titles">Job Titles</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tag Input Box with purple star chips matching screenshot 1 */}
              <div className="relative border border-gray-300 focus-within:border-purple-600 rounded-2xl p-2.5 flex flex-wrap items-center gap-2 bg-white min-h-[50px] shadow-2xs">
                {keywords.map((kw) => (
                  <div key={kw.id} className="relative group/tag">
                    {/* Tooltip popping up on mandatory keyword star */}
                    {kw.isMandatory && (
                      <div className="absolute -top-9 left-0 z-20 bg-[#0B192C] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover/tag:opacity-100 transition">
                        This keyword is marked as 'Mandatory'.
                        <div className="absolute -bottom-1 left-3 w-2 h-2 bg-[#0B192C] rotate-45" />
                      </div>
                    )}

                    <div
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold transition border ${
                        kw.isMandatory
                          ? 'bg-purple-100/80 text-purple-900 border-purple-300'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {/* Star button toggles mandatory flag */}
                      <button
                        onClick={() => toggleMandatoryKeyword(kw.id)}
                        title="Click to toggle mandatory keyword"
                        className="text-purple-600 hover:scale-110 transition"
                      >
                        <Star className={`w-3.5 h-3.5 ${kw.isMandatory ? 'fill-purple-600 text-purple-600' : 'text-gray-400'}`} />
                      </button>
                      <span>{kw.text}</span>
                      <button
                        onClick={() => removeKeyword(kw.id)}
                        className="text-gray-400 hover:text-gray-700 ml-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {/* Input for typing another keyword */}
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder="Type another keyword and press Enter"
                  className="flex-1 border-none outline-none text-xs text-gray-700 min-w-[160px] bg-transparent font-medium"
                />

                {/* Clear all keywords icon right end */}
                {keywords.length > 0 && (
                  <button
                    onClick={clearAllKeywords}
                    className="p-1 text-gray-400 hover:text-gray-600 text-xs ml-auto"
                    title="Clear all keywords"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Below Keywords options row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs pt-1 gap-2">
                <label className="flex items-center space-x-1.5 text-gray-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeSynonyms}
                    onChange={(e) => setExcludeSynonyms(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Exclude synonyms</span>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </label>

                <button
                  onClick={() => setShowExcludeKeywordsInput(!showExcludeKeywordsInput)}
                  className="text-purple-700 font-bold hover:underline"
                >
                  + Add keywords to exclude from search
                </button>
              </div>

              {/* Exclude Keywords expandable input */}
              {showExcludeKeywordsInput && (
                <div className="pt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value={excludeKeywordText}
                    onChange={(e) => setExcludeKeywordText(e.target.value)}
                    placeholder="Enter keyword to exclude (e.g. Intern, Trainee)"
                    className="px-3 py-1.5 border border-red-200 bg-red-50/40 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-400 font-medium w-full md:w-80"
                  />
                  <button
                    onClick={() => {
                      if (excludeKeywordText.trim()) {
                        setExcludedKeywordsList([...excludedKeywordsList, excludeKeywordText.trim()]);
                        setExcludeKeywordText('');
                        triggerToast(`Added '${excludeKeywordText}' to excluded keywords.`);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition"
                  >
                    Add Exclude
                  </button>
                </div>
              )}

              {excludedKeywordsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-red-600 uppercase">Excluded:</span>
                  {excludedKeywordsList.map((ex, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-[10px] font-bold border border-red-100 flex items-center space-x-1">
                      <span>{ex}</span>
                      <button onClick={() => setExcludedKeywordsList(excludedKeywordsList.filter((_, i) => i !== idx))}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Experience (Minimum & Maximum) Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block font-bold text-xs text-gray-700 mb-1.5">
                  Experience (Minimum)
                </label>
                <div className="relative">
                  <select
                    value={minExp}
                    onChange={(e) => setMinExp(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                  >
                    <option value="Years">Years</option>
                    <option value="0">0 Years (Fresher)</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="8">8 Years</option>
                    <option value="10">10+ Years</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-xs text-gray-700">Experience (Maximum)</label>
                  <button
                    onClick={() => setShowAddMonths(!showAddMonths)}
                    className="text-purple-700 font-bold text-xs hover:underline"
                  >
                    + Add months
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={maxExp}
                    onChange={(e) => setMaxExp(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                  >
                    <option value="Years">Years</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="8">8 Years</option>
                    <option value="12">12 Years</option>
                    <option value="20">20+ Years</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
                {showAddMonths && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-gray-500">Months:</span>
                    <select
                      value={extraMonths}
                      onChange={(e) => setExtraMonths(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold bg-gray-50"
                    >
                      <option value="0">0 Months</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Current Location Section */}
            <div className="space-y-2 pt-2">
              <label className="block font-bold text-xs text-gray-700">Current location</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={currentLocationInput}
                  onChange={(e) => setCurrentLocationInput(e.target.value)}
                  placeholder="Enter current location (e.g. San Francisco, Austin, Remote)"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600 font-medium text-gray-800"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs pt-1 gap-2">
                <label className="flex items-center space-x-2 font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRelocating}
                    onChange={(e) => setIncludeRelocating(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Include relocating candidates</span>
                </label>

                <button
                  onClick={() => setShowAddPrefLocation(!showAddPrefLocation)}
                  className="text-purple-700 font-bold hover:underline"
                >
                  + Add different preferred location
                </button>
              </div>

              {showAddPrefLocation && (
                <div className="pt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value={prefLocationText}
                    onChange={(e) => setPrefLocationText(e.target.value)}
                    placeholder="Enter preferred location (e.g. New York, NY)"
                    className="px-3 py-1.5 border border-purple-200 bg-purple-50/30 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-400 font-medium w-full md:w-80"
                  />
                  <button
                    onClick={() => {
                      if (prefLocationText.trim()) {
                        setPreferredLocationsList([...preferredLocationsList, prefLocationText.trim()]);
                        setPrefLocationText('');
                        triggerToast(`Added '${prefLocationText}' to preferred locations.`);
                      }
                    }}
                    className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition"
                  >
                    Add Location
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: ANNUAL SALARY & NOTICE PERIOD */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            {/* Annual Salary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-xs text-gray-700 mb-1.5">
                  Annual Salary (Minimum)
                </label>
                <div className="relative">
                  <select
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                  >
                    <option value="Lacs">Lacs</option>
                    <option value="3">3 Lacs</option>
                    <option value="5">5 Lacs</option>
                    <option value="10">10 Lacs</option>
                    <option value="15">15 Lacs</option>
                    <option value="25">25 Lacs</option>
                    <option value="50">50+ Lacs</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-xs text-gray-700">Annual Salary (Maximum)</label>
                  <button
                    onClick={() => setShowAddThousands(!showAddThousands)}
                    className="text-purple-700 font-bold text-xs hover:underline"
                  >
                    + Add thousands
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                  >
                    <option value="Lacs">Lacs</option>
                    <option value="5">5 Lacs</option>
                    <option value="10">10 Lacs</option>
                    <option value="18">18 Lacs</option>
                    <option value="25">25 Lacs</option>
                    <option value="35">35 Lacs</option>
                    <option value="60">60+ Lacs</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className="flex items-center space-x-2 font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUnmentionedSalary}
                  onChange={(e) => setIncludeUnmentionedSalary(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span>Include profiles who have not mentioned current salary</span>
              </label>
            </div>

            {/* Notice Period Section */}
            <div className="space-y-3 pt-2">
              <label className="block font-extrabold text-xs text-gray-900">Notice period</label>
              
              {/* Notice Period Pills matching Screenshot 2 */}
              <div className="flex flex-wrap gap-2.5 text-xs">
                {['Immediate joiner', 'Upto 30 days', 'Upto 45 days', 'Upto 60 days', 'Upto 90 days', 'Any'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setNoticePeriodPill(item)}
                    className={`px-4 py-2 rounded-full font-bold border transition ${
                      noticePeriodPill === item
                        ? 'bg-purple-50 text-purple-700 border-purple-400 shadow-2xs ring-2 ring-purple-400/20'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Notice Serving Radio Group */}
              <div className="flex items-center space-x-6 text-xs font-semibold text-gray-700 pt-1">
                <span className="text-gray-500">Include candidates:</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="noticeType"
                    checked={noticeServingType === 'Without notice period'}
                    onChange={() => setNoticeServingType('Without notice period')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Without notice period</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="noticeType"
                    checked={noticeServingType === 'Serving notice period'}
                    onChange={() => setNoticeServingType('Serving notice period')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Serving notice period</span>
                </label>
              </div>
            </div>
          </div>

          {/* CARD 3: EDUCATION & EMPLOYMENT DETAILS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            {/* Education Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-sm text-gray-900">Education details</h3>
              </div>

              {/* Under Graduation Qualification */}
              <div className="space-y-2">
                <label className="block font-bold text-xs text-gray-700">Under graduation qualification</label>
                <div className="flex items-center space-x-2 text-xs">
                  {['Any UG', 'Specific UG', 'No UG'].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setUgQualification(pill)}
                      className={`px-4 py-2 rounded-full font-bold border transition ${
                        ugQualification === pill
                          ? 'bg-purple-50 text-purple-700 border-purple-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Graduation Qualification */}
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-xs text-gray-700">Post graduation qualification</label>
                <div className="flex items-center space-x-2 text-xs">
                  {['Any PG', 'Specific PG', 'No PG'].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setPgQualification(pill)}
                      className={`px-4 py-2 rounded-full font-bold border transition ${
                        pgQualification === pill
                          ? 'bg-purple-50 text-purple-700 border-purple-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctorate Link */}
              <div className="pt-1">
                <button
                  onClick={() => setShowDoctorateInput(!showDoctorateInput)}
                  className="text-purple-700 font-bold text-xs hover:underline"
                >
                  + Add Doctorate qualification
                </button>

                {showDoctorateInput && (
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      value={doctorateText}
                      onChange={(e) => setDoctorateText(e.target.value)}
                      placeholder="Enter Doctorate Degree (e.g. Ph.D. CS)"
                      className="px-3 py-1.5 border border-purple-200 bg-purple-50/30 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-400 font-medium w-full md:w-80"
                    />
                    <button
                      onClick={() => {
                        if (doctorateText.trim()) {
                          triggerToast(`Added Doctorate filter: ${doctorateText}`);
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-xl text-xs"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2 pb-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-sm text-gray-900">Employment details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-xs text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    placeholder="Enter industry (e.g. IT Software, Fintech, Healthcare)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600 font-medium text-gray-800"
                  />
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">Include: Current or past industry</span>
                </div>

                <div>
                  <label className="block font-bold text-xs text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    placeholder="Enter company name..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600 font-medium text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: DEMOGRAPHICS, DIFFERENTLY ABLED, LANGUAGES, VISA STATUS & AGE */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            {/* Gender */}
            <div className="space-y-2">
              <label className="block font-extrabold text-xs text-gray-900">Gender</label>
              <div className="flex items-center space-x-2 text-xs">
                {['Male candidates', 'Female candidates'].map((g) => {
                  const isSel = selectedGenders.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        if (isSel) {
                          setSelectedGenders(selectedGenders.filter((item) => item !== g));
                        } else {
                          setSelectedGenders([...selectedGenders, g]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full font-bold border transition ${
                        isSel
                          ? 'bg-purple-50 text-purple-700 border-purple-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {g} {isSel ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Differently abled */}
            <div className="space-y-2">
              <label className="block font-extrabold text-xs text-gray-900">Differently abled</label>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center space-x-2 text-xs text-blue-900 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Filter not applicable to sourced profiles</span>
              </div>
              <div className="flex items-center space-x-2 text-xs pt-1">
                {['Developmental', 'Mental', 'Physical'].map((item) => {
                  const isSel = selectedDiffAbled.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (isSel) {
                          setSelectedDiffAbled(selectedDiffAbled.filter((i) => i !== item));
                        } else {
                          setSelectedDiffAbled([...selectedDiffAbled, item]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full font-bold border transition ${
                        isSel
                          ? 'bg-purple-50 text-purple-700 border-purple-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {item} {isSel ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <label className="block font-extrabold text-xs text-gray-900">Languages</label>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center space-x-2 text-xs text-blue-900 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Filter not applicable to sourced profiles</span>
              </div>
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                placeholder="Enter language"
                className="w-full md:w-96 px-4 py-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600 font-medium text-gray-800"
              />
            </div>

            {/* Visa status */}
            <div className="space-y-2">
              <label className="block font-extrabold text-xs text-gray-900">Visa status</label>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center space-x-2 text-xs text-blue-900 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Filter not applicable to sourced profiles</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs pt-1">
                {[
                  'Have H1 Visa',
                  'Have L1 Visa',
                  'TN Permit Holder',
                  'Green Card Holder',
                  'US Citizen',
                  'Authorized to work in the US',
                ].map((visa) => {
                  const isSel = selectedVisaStatuses.includes(visa);
                  return (
                    <button
                      key={visa}
                      type="button"
                      onClick={() => {
                        if (isSel) {
                          setSelectedVisaStatuses(selectedVisaStatuses.filter((v) => v !== visa));
                        } else {
                          setSelectedVisaStatuses([...selectedVisaStatuses, visa]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full font-bold border transition ${
                        isSel
                          ? 'bg-purple-50 text-purple-700 border-purple-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {visa} {isSel ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age (Years) */}
            <div className="space-y-2">
              <label className="block font-extrabold text-xs text-gray-900">Age (Years)</label>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center space-x-2 text-xs text-blue-900 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Filter not applicable to sourced profiles</span>
              </div>
              <div className="flex items-center space-x-3 text-xs w-full md:w-80">
                <div className="relative flex-1">
                  <select
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 bg-white outline-none appearance-none"
                  >
                    <option value="Min">Min</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <select
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 bg-white outline-none appearance-none"
                  >
                    <option value="Max">Max</option>
                    <option value="35">35</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY GRID CONTAINER */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-gray-900">
              Matching Candidates ({filteredCandidates.length})
            </h2>
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-md">
              VERIFIED ATS PROFILES
            </span>
          </div>

          <span className="text-xs text-gray-400 font-medium">
            Click any candidate card to unlock full resume & contact info
          </span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-400 font-medium shadow-2xs">
            <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-extrabold text-gray-700 text-sm">No matching candidate profiles found</p>
            <p className="mt-1">Try adjusting your multi-criteria search form or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCandidates.map((cand) => {
              const isSaved = savedCandidateIds.includes(cand.id);
              const isShortlisted = shortlistedIds.includes(cand.id);

              return (
                <div
                  key={cand.id}
                  onClick={() => handleOpenCandidateProfile(cand)}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group relative border-l-4 border-l-purple-600"
                >
                  {/* Top Bar: Role & Action Icon Buttons */}
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-[11px] border border-purple-100">
                      {cand.jobRole}
                    </span>

                    <div className="flex items-center space-x-1">
                      {/* Shortlist Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleShortlistCandidate(cand.id, e)}
                        title={isShortlisted ? 'Remove Shortlist' : 'Shortlist Candidate'}
                        className={`p-1.5 rounded-lg transition ${
                          isShortlisted ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>

                      {/* Bookmark Save Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleSaveCandidate(cand.id, e)}
                        title={isSaved ? 'Remove Bookmark' : 'Save Profile'}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isSaved ? 'text-amber-500 fill-amber-400' : 'text-gray-400'}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Core Information */}
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-gray-900 group-hover:text-purple-700 transition leading-tight flex items-center space-x-1.5">
                      <span>{cand.name}</span>
                      {isShortlisted && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded">SHORTLISTED</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-600 font-semibold line-clamp-1">{cand.headline}</p>
                  </div>

                  {/* Attributes Block */}
                  <div className="p-3 bg-gray-50/80 rounded-xl space-y-2 border border-gray-100 text-xs">
                    <div className="flex items-center justify-between text-gray-700 font-semibold">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" />
                        <span>{cand.location}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {cand.relocateWilling ? '✓ Willing Relocate' : 'Local Only'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-200/60">
                      <div>
                        <span className="text-gray-400 font-medium block text-[9px] uppercase">Experience</span>
                        <span className="font-extrabold text-gray-900">{cand.experienceYrs} Years</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block text-[9px] uppercase">Expected Salary</span>
                        <span className="font-extrabold text-purple-700">₹{cand.expectedSalary} LPA</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block text-[9px] uppercase">Work Mode</span>
                        <span className="font-bold text-gray-800">{cand.workMode}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block text-[9px] uppercase">Notice Period</span>
                        <span className="font-bold text-purple-700">{cand.noticePeriod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1">
                    {cand.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-bold text-[10px]">
                        {skill}
                      </span>
                    ))}
                    {cand.skills.length > 4 && (
                      <span className="px-1.5 py-0.5 text-gray-400 text-[10px] font-bold">+{cand.skills.length - 4}</span>
                    )}
                  </div>

                  {/* Card Functional Action Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContactCandidate(cand);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-[11px] transition flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3 text-purple-600" />
                      <span>Contact</span>
                    </button>

                    <div className="flex items-center space-x-1 text-purple-700 font-bold text-[11px]">
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ACTION BAR MATCHING SCREENSHOT EXACT DESIGN */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3.5 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left duration selector matching Screenshot 3 bottom left */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-9 font-bold text-xs text-gray-700 shadow-xs outline-none cursor-pointer"
            >
              <option value="In last 15 days">In last 15 days</option>
              <option value="In last 30 days">In last 30 days</option>
              <option value="In last 3 months">In last 3 months</option>
              <option value="In last 6 months">In last 6 months</option>
              <option value="In last 1 year">In last 1 year</option>
              <option value="All time">All time</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Right Actions: Clear All button & Search Candidates primary button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearAll}
              className="font-bold text-xs text-gray-600 hover:text-gray-900 hover:underline px-2 py-1"
            >
              Clear All
            </button>

            <button
              onClick={() => {
                setHasSearched(true);
                triggerToast(`Found ${filteredCandidates.length} candidate profiles matching search form!`);
              }}
              className="px-8 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-extrabold rounded-2xl text-xs transition shadow-lg flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Candidates</span>
            </button>
          </div>
        </div>
      </div>

      {/* CANDIDATE PROFILE DRAWER WITH HISTORY SIDEBAR */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-4xl h-full p-6 shadow-2xl border-l border-gray-200 overflow-y-auto text-xs flex flex-col md:flex-row gap-6">
            
            {/* HISTORY SIDEBAR */}
            <div className="w-full md:w-64 border-r border-gray-100 pr-4 shrink-0 space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                <History className="w-4 h-4 text-purple-600" />
                <h4 className="font-extrabold text-xs text-gray-900">Previously Viewed History</h4>
              </div>

              <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1">
                {viewedHistoryIds.map((hId) => {
                  const hCand = all50Candidates.find((c) => c.id === hId);
                  if (!hCand) return null;
                  const isCurrent = hCand.id === activeProfile.id;

                  return (
                    <div
                      key={hCand.id}
                      onClick={() => handleOpenCandidateProfile(hCand)}
                      className={`p-3 rounded-xl border cursor-pointer transition text-xs space-y-1 ${
                        isCurrent
                          ? 'bg-purple-50 border-purple-500 font-bold shadow-xs'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-black text-gray-900 leading-tight line-clamp-1">{hCand.name}</p>
                      <p className="text-[10px] text-purple-700 font-bold line-clamp-1">{hCand.jobRole}</p>
                      <span className="text-[9px] text-gray-400 font-medium block">{hCand.location}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FULL CANDIDATE PROFILE DETAILS */}
            <div className="flex-1 space-y-5">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-xl text-gray-900">{activeProfile.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {activeProfile.profileStatus}
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 font-bold mt-0.5">{activeProfile.headline}</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{activeProfile.location} • {activeProfile.email} • {activeProfile.phone}</p>
                </div>

                <button
                  onClick={() => setActiveProfile(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Experience</span>
                  <p className="font-extrabold text-gray-900">{activeProfile.experienceYrs} Years</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Expected Salary</span>
                  <p className="font-black text-purple-700">₹{activeProfile.expectedSalary} LPA</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Relocation</span>
                  <p className="font-extrabold text-emerald-600">{activeProfile.relocateWilling ? 'Willing' : 'No'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Work Mode</span>
                  <p className="font-bold text-gray-800">{activeProfile.workMode} ({activeProfile.employmentType})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Notice Period</span>
                  <p className="font-bold text-purple-700">{activeProfile.noticePeriod}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Visa Status</span>
                  <p className="font-bold text-gray-800">{activeProfile.visaStatus || 'US Citizen'}</p>
                </div>
              </div>

              {/* Verified Technical Skills */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-gray-900">Technical Skills & Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-[11px] border border-purple-100">
                      {s}
                    </span>
                  ))}
                  {activeProfile.languages.map((l, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold text-[11px]">
                      🌐 {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-1">Executive Summary</h4>
                <p className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-gray-700 font-medium leading-relaxed">
                  {activeProfile.summary}
                </p>
              </div>

              {/* Work History */}
              <div>
                <h4 className="font-extrabold text-gray-900 mb-2">Work History</h4>
                {activeProfile.workHistory.map((w, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1 mb-2">
                    <div className="flex justify-between font-extrabold text-gray-900">
                      <span>{w.role} • {w.company}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{w.duration}</span>
                    </div>
                    <p className="text-gray-600 font-medium">{w.highlights}</p>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => toggleShortlistCandidate(activeProfile.id, e)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      shortlistedIds.includes(activeProfile.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {shortlistedIds.includes(activeProfile.id) ? '✓ Shortlisted' : '+ Shortlist Candidate'}
                  </button>

                  <button
                    onClick={() => setContactCandidate(activeProfile)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-xl text-xs hover:bg-purple-200 transition"
                  >
                    💬 Send Message
                  </button>
                </div>

                <button
                  onClick={() => handleDownloadResume(activeProfile)}
                  className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition shadow-md flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (2 Tokens)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT CANDIDATE DIRECT MESSAGE MODAL */}
      {contactCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-sm text-gray-900">Message Candidate</h3>
              </div>
              <button
                onClick={() => setContactCandidate(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-purple-900 font-semibold">
              To: <span className="font-extrabold">{contactCandidate.name}</span> ({contactCandidate.email})
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Hi! We reviewed your profile on Clyptus ATS and would love to invite you for an initial interview..."
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-xs font-medium text-gray-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContactCandidate(null)}
                  className="px-4 py-2 border border-gray-300 font-bold rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
