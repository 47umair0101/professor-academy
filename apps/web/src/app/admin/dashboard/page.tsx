'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  FileCheck,
  Users,
  Settings,
  Wallet,
  Building2,
  Smartphone,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  Sliders,
  DollarSign,
  AlertCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { formatPKR } from '@professor-academy/shared';

type AdminNavTab =
  | 'dashboard'
  | 'fee-queue'
  | 'teacher-provisioning'
  | 'course-approvals'
  | 'student-directory'
  | 'bank-settings'
  | 'financials'
  | 'system-audit';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<AdminNavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = React.useState<string | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = React.useState(false);

  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  // Click outside listener for profile dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Teacher Direct Publish State (PRD Section 4 mandate)
  const [teachers, setTeachers] = React.useState([
    {
      id: 't-1',
      name: 'Prof. Dr. Arshad Mahmood',
      email: 'teacher@professoracademy.pk',
      department: 'Physics',
      coursesCount: 4,
      studentsCount: 14200,
      canDirectPublish: true,
      commissionRate: 80,
    },
    {
      id: 't-2',
      name: 'Dr. Fatima Tariq',
      email: 'fatima.tariq@professoracademy.pk',
      department: 'Chemistry',
      coursesCount: 3,
      studentsCount: 11200,
      canDirectPublish: true,
      commissionRate: 80,
    },
    {
      id: 't-3',
      name: 'Engr. Usman Qureshi',
      email: 'usman.qureshi@professoracademy.pk',
      department: 'Mathematics',
      coursesCount: 2,
      studentsCount: 9400,
      canDirectPublish: false,
      commissionRate: 80,
    },
  ]);

  // Fee Verification Queue State (PRD Section 6 mandate)
  const [feeRequests, setFeeRequests] = React.useState([
    {
      id: 'fe-1',
      studentName: 'Zainab Bibi',
      studentEmail: 'zainab.bibi@gmail.com',
      courseTitle: 'MDCAT Physics Masterclass (2026)',
      amountPkr: 4500,
      paymentMethod: 'JazzCash',
      tid: 'JC-9823412093',
      submittedAt: '12 mins ago',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      status: 'PENDING' as const,
    },
    {
      id: 'fe-2',
      studentName: 'Usman Ali',
      studentEmail: 'usman.ali@yahoo.com',
      courseTitle: 'FSc Chemistry Part-1',
      amountPkr: 3800,
      paymentMethod: 'Easypaisa',
      tid: 'EP-4412098811',
      submittedAt: '45 mins ago',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      status: 'PENDING' as const,
    },
    {
      id: 'fe-3',
      studentName: 'Ahmad Raza',
      studentEmail: 'ahmad.raza@gmail.com',
      courseTitle: 'ECAT Advanced Mathematics',
      amountPkr: 4200,
      paymentMethod: 'Bank Transfer (Meezan)',
      tid: 'MEZN-88390112',
      submittedAt: '2 hours ago',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      status: 'PENDING' as const,
    },
  ]);

  const toggleTeacherDirectPublish = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, canDirectPublish: !t.canDirectPublish } : t))
    );
  };

  const handleApproveFee = (id: string) => {
    setFeeRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectFee = (id: string) => {
    setFeeRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const navItems = [
    { id: 'dashboard' as AdminNavTab, label: 'Executive Dashboard', icon: LayoutDashboard },
    {
      id: 'fee-queue' as AdminNavTab,
      label: 'Fee Verification Queue',
      icon: Wallet,
      badge: feeRequests.length > 0 ? feeRequests.length : undefined,
    },
    { id: 'teacher-provisioning' as AdminNavTab, label: 'Teacher Provisioning', icon: Users },
    { id: 'course-approvals' as AdminNavTab, label: 'Course Approvals', icon: FileCheck },
    { id: 'student-directory' as AdminNavTab, label: 'Student Directory', icon: GraduationCap },
    { id: 'bank-settings' as AdminNavTab, label: 'Bank & Payment Accounts', icon: Building2 },
    { id: 'financials' as AdminNavTab, label: 'Revenue Splits (80/20)', icon: DollarSign },
    { id: 'system-audit' as AdminNavTab, label: 'System Health & Audit', icon: ShieldCheck },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      {/* Viewport Locked Container: Prevents entire page scrolling & keeps Sidebar + Header pinned */}
      <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] flex flex-col antialiased">
        {/* Top Navbar (Fixed 64px Height) */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Academy Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-5 w-5 stroke-[2.2] text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base leading-none text-slate-900 tracking-tight">
                  Professor Online
                </span>
                <span className="text-[10px] text-rose-600 font-bold tracking-wider uppercase">
                  ADMIN SUPERUSER CENTER
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student TIDs, teacher accounts, bank logs..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-full placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
            />
          </div>

          {/* Right Controls: Notifications & Interactive Profile Dropdown */}
          <div className="flex items-center gap-3">
            <button
              title="Admin Alerts"
              className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-xs"
            >
              <Bell className="h-5 w-5 text-slate-800 stroke-[2.2]" />
              {feeRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white">
                  {feeRequests.length}
                </span>
              )}
            </button>

            {/* Admin Profile Pill */}
            <div className="relative pl-1 border-l border-slate-200" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none"
              >
                <div className="h-9 w-9 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-slate-200">
                  ADM
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.fullName || 'Super Administrator'}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold uppercase">
                    Portal Governance
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180 text-brand-indigo' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.fullName || 'Super Admin'}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {user?.email || 'admin@professoracademy.pk'}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-700">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Full Superuser Privileges</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('bank-settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>Payment & Bank Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('system-audit');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>System Configuration</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-semibold transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Layout: Fixed Height Sidebar + Independent Scrollable Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Fixed Width & Pinned Height */}
          <aside
            className={`
              fixed lg:static inset-y-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200/90
              flex flex-col justify-between shrink-0 transform transition-transform duration-200 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Scrollable Nav Items Region */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="h-4 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout Action ALWAYS Pinned At Bottom of the Viewport Sidebar */}
            <div className="p-3 border-t border-slate-100 bg-white shrink-0">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area: Scrolls Independently While Sidebar and Header Stay Completely Pinned */}
          <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl">
            {/* Greeting Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-1 border border-rose-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Platform Superuser Operations</span>
                  <span>•</span>
                  <span>PostgreSQL Connected</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Executive Dashboard: {user?.fullName || 'Super Administrator'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Verify manual bank/JazzCash fee receipts, manage teacher provisioning, and control direct publish toggles.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('fee-queue')}
                  className="font-bold text-xs shadow-sm"
                >
                  <Wallet className="h-4 w-4 mr-1.5" />
                  <span>Fee Verification Queue ({feeRequests.length})</span>
                </Button>
              </div>
            </div>

            {/* 4 Quick Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Gross Platform Volume */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Gross Sales Volume</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono">
                    PKR 2,450,000
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-medium">↑ +22% this batch</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              {/* Card 2: Platform Cut (20%) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Platform Revenue (20%)</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono">
                    PKR 490,000
                  </h3>
                  <span className="text-[11px] text-slate-400">Net platform income</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              {/* Card 3: Pending Fee Receipts */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Pending Fee Receipts</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
                    {feeRequests.length}
                  </h3>
                  <span className="text-[11px] text-rose-600 font-medium">Requires verification</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </div>

              {/* Card 4: Verified Faculty Members */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Active Teachers</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    {teachers.length}
                  </h3>
                  <span className="text-[11px] text-slate-400">80% revenue split</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* 2-Column Main Section (Left ~65%, Right ~35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
              {/* LEFT COLUMN: 8 Columns */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Pending Fee Verification Queue (Module 4 & 6 Mandate) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-brand-indigo" />
                        <span>Manual Fee Verification Queue</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pakistani student fee receipts submitted via Meezan Bank, JazzCash, and Easypaisa.
                      </p>
                    </div>

                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                      {feeRequests.length} Pending
                    </span>
                  </div>

                  {feeRequests.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                      {feeRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{req.studentName}</span>
                              <span className="text-[11px] text-slate-400">({req.studentEmail})</span>
                              <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                                {req.paymentMethod}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 font-medium">
                              Course: <span className="text-slate-800">{req.courseTitle}</span>
                            </p>

                            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                              <span className="font-bold text-slate-900">
                                {formatPKR(req.amountPkr)}
                              </span>
                              <span>•</span>
                              <span>TID: {req.tid}</span>
                              <span>•</span>
                              <span>{req.submittedAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReceiptUrl(req.receiptUrl);
                                setReceiptModalOpen(true);
                              }}
                              className="text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              <span>View Receipt</span>
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApproveFee(req.id)}
                              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              <span>Approve</span>
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectFee(req.id)}
                              className="text-xs"
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      ✓ All fee receipts verified! No pending items in the queue.
                    </div>
                  )}
                </div>

                {/* 2. Teacher Provisioning & Direct Publish Toggle (PRD Section 4 Mandate) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Users className="h-4 w-4 text-brand-indigo" />
                        <span>Teacher Provisioning & Direct Publish Toggles</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Control whether teacher courses publish instantly or require admin approval.
                      </p>
                    </div>

                    <Button variant="secondary" size="sm" className="text-xs font-semibold">
                      <span>+ Provision Teacher</span>
                    </Button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="p-4 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-slate-900">{teacher.name}</h4>
                          <p className="text-xs text-slate-500">
                            {teacher.email} • Department: <strong>{teacher.department}</strong>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {teacher.coursesCount} Courses • {teacher.studentsCount.toLocaleString()} Students •{' '}
                            {teacher.commissionRate}% Commission Rate
                          </p>
                        </div>

                        {/* Interactive Direct Publish Switch */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span
                              className={`text-xs font-bold block ${
                                teacher.canDirectPublish ? 'text-emerald-700' : 'text-slate-500'
                              }`}
                            >
                              {teacher.canDirectPublish ? 'Direct Publish ON' : 'Approval Required'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {teacher.canDirectPublish ? 'Skips Review' : 'Enforces Review'}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleTeacherDirectPublish(teacher.id)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              teacher.canDirectPublish ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                                teacher.canDirectPublish ? 'left-6.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 4 Columns */}
              <div className="lg:col-span-4 space-y-6">
                {/* Platform Payment Details Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-brand-indigo" />
                    <span>Official Payment Accounts (PKR)</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-amber-600" />
                        <span>Meezan Bank Limited</span>
                      </p>
                      <p className="text-slate-600 font-mono text-[11px]">Title: Professor Academy</p>
                      <p className="text-slate-600 font-mono text-[11px]">
                        IBAN: PK42MEZN0001010105432198
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-rose-500" />
                        <span>JazzCash Merchant</span>
                      </p>
                      <p className="text-slate-600 font-mono text-[11px]">Account: 0300-1234567</p>
                      <p className="text-slate-600 font-mono text-[11px]">Till ID: 7654321</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Easypaisa Account</span>
                      </p>
                      <p className="text-slate-600 font-mono text-[11px]">Account: 0345-9876543</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Edit Payment Accounts
                  </Button>
                </div>

                {/* System Scale & DB Status Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      System Operational
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">PostgreSQL Supabase (v17.11)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Scale target: 10,000+ concurrent students with composite indexes & RLS.
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-2 space-y-1 font-mono">
                    <p>Database: eu-west-1 pooler (Connected)</p>
                    <p>Tables: 15 active schema tables</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Receipt Viewer Modal */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Student Fee Payment Receipt"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {selectedReceiptUrl && (
              <img
                src={selectedReceiptUrl}
                alt="Payment Receipt"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl">
            Verify transaction ID (TID) against the merchant SMS statement before approving access.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setReceiptModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </RoleGuard>
  );
}
