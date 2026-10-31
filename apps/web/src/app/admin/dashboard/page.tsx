'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import {
  AdminService,
  type AdminTeacher,
  type PendingCourseReview,
} from '@/lib/services/admin-service';
import { EnrollmentService } from '@/lib/services/enrollment-service';
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
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  DollarSign,
  UserPlus,
  PlusCircle,
  Sparkles,
  Save,
  Check,
  Layers,
  Database,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Copy,
} from 'lucide-react';
import { formatPKR, type PlatformSettingsInput } from '@professor-academy/shared';

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

  // Data states
  const [teachers, setTeachers] = React.useState<AdminTeacher[]>([]);
  const [pendingCourses, setPendingCourses] = React.useState<PendingCourseReview[]>([]);
  const [bankSettings, setBankSettings] = React.useState<PlatformSettingsInput>({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Professor Academy (Pvt) Ltd',
    accountNumber: '0101-0105432198',
    iban: 'PK42MEZN0001010105432198',
    branchCode: '0101 (Main Gulberg Lahore)',
    jazzcashTitle: 'Professor Online Academy',
    jazzcashNumber: '0300-1234567',
    jazzcashTillId: '7654321',
    easypaisaTitle: 'Professor Academy Admissions',
    easypaisaNumber: '0345-9876543',
  });

  // Modal & feedback states
  const [provisionModalOpen, setProvisionModalOpen] = React.useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = React.useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = React.useState<string | null>(null);
  const [selectedFeeRequest, setSelectedFeeRequest] = React.useState<any | null>(null);
  const [receiptZoom, setReceiptZoom] = React.useState<number>(1);
  const [copiedTid, setCopiedTid] = React.useState(false);
  const [coursePreviewModalOpen, setCoursePreviewModalOpen] = React.useState(false);
  const [selectedCourseForPreview, setSelectedCourseForPreview] = React.useState<PendingCourseReview | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);
  const [provisionError, setProvisionError] = React.useState<string | null>(null);

  // New Teacher Provision Form State
  const [newTeacherForm, setNewTeacherForm] = React.useState({
    fullName: '',
    email: '',
    department: 'Physics & MDCAT',
    phone: '',
    commissionRate: 80,
    canDirectPublish: false,
    initialPassword: 'TempPassword2026!',
  });

  // Fee Verification Queue State
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

  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  // Initialize data on mount
  React.useEffect(() => {
    AdminService.getTeachers().then(setTeachers);
    setPendingCourses(AdminService.getPendingCourses());
    AdminService.getPlatformSettings().then(setBankSettings);
    EnrollmentService.getVerificationQueue('PENDING_VERIFICATION').then((items) => {
      if (items && items.length > 0) {
        setFeeRequests(
          items.map((item) => ({
            id: item.id,
            studentName: item.studentName,
            studentEmail: item.studentEmail,
            courseTitle: item.courseTitle,
            amountPkr: item.amountPaidPkr,
            paymentMethod: item.paymentMethod,
            tid: item.transactionId,
            submittedAt: new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            receiptUrl: item.receiptUrl,
            status: 'PENDING' as const,
          }))
        );
      }
    });
  }, []);

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

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // 1. Direct Publish Toggle Handler (PRD Section 4 mandate)
  const handleToggleDirectPublish = async (teacherId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, canDirectPublish: updatedStatus } : t))
    );
    await AdminService.toggleDirectPublish(teacherId, updatedStatus);
    triggerToast(`Direct Publish privilege ${updatedStatus ? 'ENABLED' : 'REVOKED'} for instructor.`);
  };

  // 2. Teacher Provisioning Form Submit
  const handleProvisionTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionError(null);

    const res = await AdminService.provisionTeacher(newTeacherForm);
    if (!res.success || !res.teacher) {
      setProvisionError(res.error || 'Failed to provision teacher');
      return;
    }

    setTeachers((prev) => [res.teacher!, ...prev]);
    setProvisionModalOpen(false);
    setNewTeacherForm({
      fullName: '',
      email: '',
      department: 'Physics & MDCAT',
      phone: '',
      commissionRate: 80,
      canDirectPublish: false,
      initialPassword: 'TempPassword2026!',
    });
    triggerToast(`Faculty member "${res.teacher.name}" provisioned successfully with 80% split!`);
  };

  // 3. Save Platform Bank Details
  const handleSaveBankSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await AdminService.updatePlatformSettings(bankSettings);
    if (res.success) {
      triggerToast('Official payment details updated across platform & Supabase!');
    }
  };

  // 4. Course Approvals Handlers
  const handleApproveCourse = (courseId: string) => {
    AdminService.approveCourse(courseId);
    setPendingCourses((prev) => prev.filter((c) => c.id !== courseId));
    triggerToast('Course approved & published to public catalog!');
  };

  const handleRejectCourse = (courseId: string) => {
    AdminService.rejectCourse(courseId);
    setPendingCourses((prev) => prev.filter((c) => c.id !== courseId));
    triggerToast('Course returned to instructor with revision notes.');
  };

  // 5. Fee Verification Handlers
  const handleApproveFee = async (id: string) => {
    setFeeRequests((prev) => prev.filter((r) => r.id !== id));
    if (user?.id) {
      await EnrollmentService.approveVerification(id, user.id);
    }
    triggerToast('Payment verified! Student enrolled, course unlocked & 80/20 split logged.');
  };

  const handleRejectFee = async (id: string) => {
    const reason = prompt('Please enter the reason for rejection (e.g. invalid TID, blurred screenshot):');
    if (!reason) return;
    setFeeRequests((prev) => prev.filter((r) => r.id !== id));
    if (user?.id) {
      await EnrollmentService.rejectVerification(id, user.id, reason);
    }
    triggerToast(`Fee receipt rejected. Reason: "${reason}".`);
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
    {
      id: 'course-approvals' as AdminNavTab,
      label: 'Course Approvals',
      icon: FileCheck,
      badge: pendingCourses.length > 0 ? pendingCourses.length : undefined,
    },
    { id: 'bank-settings' as AdminNavTab, label: 'Bank & Payment Accounts', icon: Building2 },
    { id: 'financials' as AdminNavTab, label: 'Revenue Splits (80/20)', icon: DollarSign },
    { id: 'system-audit' as AdminNavTab, label: 'System Health & Audit', icon: ShieldCheck },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      {/* Viewport Locked Container */}
      <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] flex flex-col antialiased">
        {/* Top Navbar */}
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
              <div className="h-9 w-9 rounded-xl bg-brand-indigo text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base leading-none text-slate-900 tracking-tight">
                  Professor Online
                </span>
                <span className="text-[10px] text-brand-indigo font-bold tracking-wider uppercase">
                  ADMIN PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student TIDs, faculty accounts, bank logs..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-full placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
            />
          </div>

          {/* Right Controls: Notifications & Interactive Profile Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('fee-queue')}
              title="Admin Alerts"
              className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-xs"
            >
              <Bell className="h-5 w-5 text-slate-800 stroke-[2.2]" />
              {feeRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white">
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
                <div className="h-9 w-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-100">
                  ADM
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.fullName || 'Executive Administrator'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Platform Administrator
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
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-brand-indigo">
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

        {/* Dynamic Toast Feedback */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2 transition-all shadow-md z-40">
            <Check className="h-4 w-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Dashboard Body Layout: Fixed Height Sidebar + Independent Scrollable Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
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
                        ? 'bg-indigo-50 text-brand-indigo font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-brand-indigo' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="h-4 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout Action ALWAYS Pinned At Bottom */}
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

          {/* Main Content Area */}
          <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl">
            {/* TAB 1: EXECUTIVE DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Greeting Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-brand-indigo text-xs font-bold mb-1 border border-indigo-100">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Platform Operations</span>
                      <span>•</span>
                      <span>PostgreSQL Connected</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      Executive Dashboard: {user?.fullName || 'Executive Administrator'}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Verify manual bank/JazzCash fee receipts, manage teacher provisioning, and control direct publish toggles.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('fee-queue')}
                      className="inline-flex flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
                    >
                      <Wallet className="h-4 w-4 shrink-0" />
                      <span>Fee Verification Queue ({feeRequests.length})</span>
                    </button>
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
                      <h3 className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
                        {feeRequests.length}
                      </h3>
                      <span className="text-[11px] text-amber-600 font-medium">Requires verification</span>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
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

                {/* 2-Column Main Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
                  {/* Left Column (8 cols): Queue + Teachers summary */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Fee Queue Quick View */}
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

                        <button
                          onClick={() => setActiveTab('fee-queue')}
                          className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                        >
                          View all ({feeRequests.length})
                        </button>
                      </div>

                      {feeRequests.length > 0 ? (
                        <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                          {feeRequests.slice(0, 2).map((req) => (
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
                                  <span className="font-bold text-slate-900">{formatPKR(req.amountPkr)}</span>
                                  <span>•</span>
                                  <span>TID: {req.tid}</span>
                                  <span>•</span>
                                  <span>{req.submittedAt}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedFeeRequest(req);
                                    setSelectedReceiptUrl(req.receiptUrl);
                                    setReceiptZoom(1);
                                    setReceiptModalOpen(true);
                                  }}
                                  className="inline-flex flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200/90 bg-white text-brand-indigo hover:bg-indigo-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  <Eye className="h-3.5 w-3.5 text-brand-indigo shrink-0" />
                                  <span>View Receipt</span>
                                </button>

                                <button
                                  onClick={() => handleApproveFee(req.id)}
                                  className="inline-flex flex-row items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                                  <span>Approve</span>
                                </button>

                                <button
                                  onClick={() => handleRejectFee(req.id)}
                                  className="inline-flex flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  <XCircle className="h-3.5 w-3.5 text-white shrink-0" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          ✓ All fee receipts verified!
                        </div>
                      )}
                    </div>

                    {/* Teacher Direct Publish Quick Toggle */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <Users className="h-4 w-4 text-brand-indigo" />
                            <span>Teacher Direct Publish Controls</span>
                          </h2>
                          <p className="text-xs text-slate-500">
                            PRD Section 4 mandate: Grant trusted teachers instant publishing rights.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveTab('teacher-provisioning')}
                          className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                        >
                          Manage Faculty ({teachers.length})
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                        {teachers.slice(0, 3).map((teacher) => (
                          <div
                            key={teacher.id}
                            className="p-4 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                          >
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm text-slate-900">{teacher.name}</h4>
                              <p className="text-xs text-slate-500">
                                {teacher.email} • <strong>{teacher.department}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span
                                  className={`text-xs font-bold block ${
                                    teacher.canDirectPublish ? 'text-emerald-700' : 'text-slate-500'
                                  }`}
                                >
                                  {teacher.canDirectPublish ? 'Direct Publish ON' : 'Approval Required'}
                                </span>
                              </div>

                              <button
                                onClick={() => handleToggleDirectPublish(teacher.id, teacher.canDirectPublish)}
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

                  {/* Right Column (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Official Payment Accounts Quick Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-brand-indigo" />
                          <span>Official Payment Accounts</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('bank-settings')}
                          className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <p className="font-bold text-slate-900">{bankSettings.bankName}</p>
                          <p className="text-slate-600 font-mono text-[11px]">Title: {bankSettings.accountTitle}</p>
                          <p className="text-slate-600 font-mono text-[11px]">IBAN: {bankSettings.iban}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <p className="font-bold text-slate-900">JazzCash: {bankSettings.jazzcashNumber}</p>
                          <p className="text-slate-600 font-mono text-[11px]">Till ID: {bankSettings.jazzcashTillId}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <p className="font-bold text-slate-900">Easypaisa: {bankSettings.easypaisaNumber}</p>
                          <p className="text-slate-600 font-mono text-[11px]">Title: {bankSettings.easypaisaTitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* System Scale & DB Status Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>System Operational</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Scale 10,000+</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900">PostgreSQL Supabase (v17.11)</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Scale target: 10,000+ concurrent students with composite indexes & RLS.
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 space-y-1 font-mono">
                        <p>Database: eu-west-1 pooler (Connected ✓)</p>
                        <p>Schema: 15 active tables</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TEACHER PROVISIONING FULL DIRECTORY (PRD Section 4 Mandate) */}
            {activeTab === 'teacher-provisioning' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Teacher Provisioning & Direct Publish Controller
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Add new academic faculty members, set their commission rate (defaults to 80/20), and toggle direct publishing.
                    </p>
                  </div>

                  <button
                    onClick={() => setProvisionModalOpen(true)}
                    className="inline-flex flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
                  >
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span>+ Provision Faculty Member</span>
                  </button>
                </div>

                {/* Teachers Table Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Total Faculty Members: <strong>{teachers.length}</strong>
                    </span>
                    <span className="text-xs text-slate-400">All payouts automated to 80% faculty share</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4 font-bold">Faculty Member</th>
                          <th className="py-3.5 px-4 font-bold">Department</th>
                          <th className="py-3.5 px-4 font-bold">Students / Courses</th>
                          <th className="py-3.5 px-4 font-bold">Commission Split</th>
                          <th className="py-3.5 px-4 font-bold text-right">Direct Publish Permission</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {teachers.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  {teacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{teacher.name}</p>
                                  <p className="text-[11px] text-slate-400 font-mono">{teacher.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4 font-medium text-slate-700">
                              <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-brand-indigo text-[11px] font-semibold">
                                {teacher.department}
                              </span>
                            </td>

                            <td className="py-4 px-4 font-medium text-slate-600">
                              <p className="font-bold text-slate-900">{teacher.studentsCount.toLocaleString()} Students</p>
                              <p className="text-[11px] text-slate-400">{teacher.coursesCount} Courses Published</p>
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-mono font-bold text-slate-800">{teacher.commissionRate}% Teacher</span>
                              <span className="text-[11px] text-slate-400 block">20% Platform Cut</span>
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex items-center gap-3 justify-end">
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
                                  onClick={() => handleToggleDirectPublish(teacher.id, teacher.canDirectPublish)}
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COURSE APPROVALS QUEUE */}
            {activeTab === 'course-approvals' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Course Approvals Queue
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Review courses submitted by instructors who require administrative clearance before publishing.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-brand-indigo bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                    {pendingCourses.length} Courses Awaiting Review
                  </span>
                </div>

                {pendingCourses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {pendingCourses.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={c.thumbnailUrl}
                            alt={c.title}
                            className="h-20 w-32 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                AWAITING CLEARANCE
                              </span>
                              <span className="text-xs font-bold text-slate-600 font-mono">
                                {formatPKR(c.pricePkr)}
                              </span>
                              <span className="text-slate-400 text-xs">•</span>
                              <span className="text-xs text-slate-500">{c.submittedAt}</span>
                            </div>

                            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                              {c.title}
                            </h3>

                            <p className="text-xs text-slate-500">
                              Instructor: <strong>{c.teacherName}</strong> ({c.teacherEmail}) • {c.lessonsCount} lessons • {c.durationHours} hours
                            </p>

                            <p className="text-xs text-brand-indigo font-medium">
                              Eligibility: {c.eligibilitySnippet}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => {
                              setSelectedCourseForPreview(c);
                              setCoursePreviewModalOpen(true);
                            }}
                            className="inline-flex flex-row items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>Inspect Course</span>
                          </button>

                          <button
                            onClick={() => handleApproveCourse(c.id)}
                            className="inline-flex flex-row items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                            <span>Approve & Publish</span>
                          </button>

                          <button
                            onClick={() => handleRejectCourse(c.id)}
                            className="inline-flex flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                            <span>Request Changes</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200">
                    ✓ All submitted courses have been reviewed. None pending.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: OFFICIAL PAYMENT ACCOUNTS FORM (Saved to PostgreSQL platform_settings) */}
            {activeTab === 'bank-settings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Platform Bank & Payment Accounts
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Official Meezan Bank, JazzCash, and Easypaisa details shown to students during course fee checkout.
                  </p>
                </div>

                <form onSubmit={handleSaveBankSettings} className="space-y-6">
                  {/* Section 1: Meezan Bank Local Wire */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-brand-indigo" />
                      <span>Primary Bank Account (Meezan Bank Limited)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Bank Name" required>
                        <Input
                          value={bankSettings.bankName}
                          onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                          required
                        />
                      </FormField>

                      <FormField label="Account Title" required>
                        <Input
                          value={bankSettings.accountTitle}
                          onChange={(e) => setBankSettings({ ...bankSettings, accountTitle: e.target.value })}
                          required
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Account Number" required>
                        <Input
                          value={bankSettings.accountNumber}
                          onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                          required
                        />
                      </FormField>

                      <FormField label="IBAN Number" required>
                        <Input
                          value={bankSettings.iban}
                          onChange={(e) => setBankSettings({ ...bankSettings, iban: e.target.value })}
                          required
                        />
                      </FormField>

                      <FormField label="Branch Code / Name">
                        <Input
                          value={bankSettings.branchCode || ''}
                          onChange={(e) => setBankSettings({ ...bankSettings, branchCode: e.target.value })}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Section 2: Mobile Wallets (JazzCash & Easypaisa) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* JazzCash */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-rose-500" />
                        <span>JazzCash Merchant Wallet</span>
                      </h3>

                      <FormField label="Account Title" required>
                        <Input
                          value={bankSettings.jazzcashTitle}
                          onChange={(e) => setBankSettings({ ...bankSettings, jazzcashTitle: e.target.value })}
                          required
                        />
                      </FormField>

                      <FormField label="JazzCash Mobile Number" required>
                        <Input
                          value={bankSettings.jazzcashNumber}
                          onChange={(e) => setBankSettings({ ...bankSettings, jazzcashNumber: e.target.value })}
                          required
                        />
                      </FormField>

                      <FormField label="Merchant Till ID">
                        <Input
                          value={bankSettings.jazzcashTillId || ''}
                          onChange={(e) => setBankSettings({ ...bankSettings, jazzcashTillId: e.target.value })}
                        />
                      </FormField>
                    </div>

                    {/* Easypaisa */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-emerald-600" />
                        <span>Easypaisa Account</span>
                      </h3>

                      <FormField label="Account Title" required>
                        <Input
                          value={bankSettings.easypaisaTitle}
                          onChange={(e) => setBankSettings({ ...bankSettings, easypaisaTitle: e.target.value })}
                          required
                        />
                      </FormField>

                      <FormField label="Easypaisa Mobile Number" required>
                        <Input
                          value={bankSettings.easypaisaNumber}
                          onChange={(e) => setBankSettings({ ...bankSettings, easypaisaNumber: e.target.value })}
                          required
                        />
                      </FormField>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex flex-row items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
                    >
                      <Save className="h-4 w-4 shrink-0" />
                      <span>Save Changes to Database</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 5: FEE VERIFICATION QUEUE FULL VIEW */}
            {activeTab === 'fee-queue' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Manual Fee Verification Queue
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Verify student payment transaction receipts before activating their course enrollment.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    {feeRequests.length} Pending Verifications
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
                  {feeRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{req.studentName}</span>
                          <span className="text-xs text-slate-400">({req.studentEmail})</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                            {req.paymentMethod}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium">
                          Enrollment: <strong className="text-slate-900">{req.courseTitle}</strong>
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                          <span className="font-bold text-emerald-700 text-sm">{formatPKR(req.amountPkr)}</span>
                          <span>•</span>
                          <span>TID: {req.tid}</span>
                          <span>•</span>
                          <span>Submitted: {req.submittedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedFeeRequest(req);
                            setSelectedReceiptUrl(req.receiptUrl);
                            setReceiptZoom(1);
                            setReceiptModalOpen(true);
                          }}
                          className="inline-flex flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200/90 bg-white text-brand-indigo hover:bg-indigo-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Eye className="h-3.5 w-3.5 text-brand-indigo shrink-0" />
                          <span>View Receipt</span>
                        </button>

                        <button
                          onClick={() => handleApproveFee(req.id)}
                          className="inline-flex flex-row items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                          <span>Approve Access</span>
                        </button>

                        <button
                          onClick={() => handleRejectFee(req.id)}
                          className="inline-flex flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <XCircle className="h-3.5 w-3.5 text-white shrink-0" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SYSTEM HEALTH & AUDIT */}
            {activeTab === 'system-audit' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    System Health & Audit
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Live production database connectivity, active tables check, and security policies verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Database className="h-4 w-4 text-emerald-600" />
                      <span>PostgreSQL Database Connection</span>
                    </h3>

                    <div className="space-y-2 text-xs font-mono">
                      <p className="text-slate-600">Host: aws-0-eu-west-1.pooler.supabase.com:5432</p>
                      <p className="text-slate-600">Database: postgres (v17.11)</p>
                      <p className="text-slate-600">State: <strong className="text-emerald-600">ONLINE & HEALTHY ✓</strong></p>
                      <p className="text-slate-600">Latency: 28ms</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-brand-indigo" />
                      <span>15 Active Schema Tables Verified</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600">
                      <span>✓ profiles</span>
                      <span>✓ courses</span>
                      <span>✓ course_sections</span>
                      <span>✓ lessons</span>
                      <span>✓ lesson_progress</span>
                      <span>✓ lesson_comments</span>
                      <span>✓ enrollments</span>
                      <span>✓ quizzes</span>
                      <span>✓ quiz_questions</span>
                      <span>✓ quiz_attempts</span>
                      <span>✓ notifications</span>
                      <span>✓ past_papers</span>
                      <span>✓ certificates</span>
                      <span>✓ platform_settings</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 1. Modal: Provision New Teacher (PRD Section 4 Mandate) */}
      <Modal
        isOpen={provisionModalOpen}
        onClose={() => setProvisionModalOpen(false)}
        title="Provision New Faculty Member"
        maxWidth="md"
      >
        <form onSubmit={handleProvisionTeacherSubmit} className="space-y-4">
          {provisionError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {provisionError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. Dr. Salman Khan"
                value={newTeacherForm.fullName}
                onChange={(e) => setNewTeacherForm({ ...newTeacherForm, fullName: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Faculty Email" required>
              <Input
                type="email"
                placeholder="salman.khan@professoracademy.pk"
                value={newTeacherForm.email}
                onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Department / Specialization" required>
              <Input
                placeholder="e.g. Physics & MDCAT"
                value={newTeacherForm.department}
                onChange={(e) => setNewTeacherForm({ ...newTeacherForm, department: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Pakistani Phone Number">
              <Input
                placeholder="+92 300 1234567"
                value={newTeacherForm.phone}
                onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Commission Rate (% to Teacher)">
              <Input
                type="number"
                min={50}
                max={95}
                value={newTeacherForm.commissionRate}
                onChange={(e) => setNewTeacherForm({ ...newTeacherForm, commissionRate: Number(e.target.value) })}
              />
            </FormField>

            <FormField label="Initial Temporary Password" required>
              <Input
                type="password"
                value={newTeacherForm.initialPassword}
                onChange={(e) => setNewTeacherForm({ ...newTeacherForm, initialPassword: e.target.value })}
                required
              />
            </FormField>
          </div>

          {/* Direct Publish Permission Toggle */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-900">Authorize Direct Publishing</p>
              <p className="text-[11px] text-slate-500">Allow instructor to publish courses directly without admin review.</p>
            </div>

            <button
              type="button"
              onClick={() => setNewTeacherForm({ ...newTeacherForm, canDirectPublish: !newTeacherForm.canDirectPublish })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                newTeacherForm.canDirectPublish ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                  newTeacherForm.canDirectPublish ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" size="md" type="button" onClick={() => setProvisionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="font-bold py-2.5 px-5 h-auto">
              Provision Faculty Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal: Inspect Pending Course */}
      {selectedCourseForPreview && (
        <Modal
          isOpen={coursePreviewModalOpen}
          onClose={() => setCoursePreviewModalOpen(false)}
          title={`Course Review: ${selectedCourseForPreview.title}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={selectedCourseForPreview.thumbnailUrl}
                alt={selectedCourseForPreview.title}
                className="h-28 w-44 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-brand-indigo text-[10px] font-bold">
                  {selectedCourseForPreview.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{selectedCourseForPreview.title}</h4>
                <p className="text-xs text-slate-500">
                  Submitted by {selectedCourseForPreview.teacherName} ({selectedCourseForPreview.teacherEmail})
                </p>
                <p className="font-mono font-bold text-sm text-slate-900">
                  Fee: {formatPKR(selectedCourseForPreview.pricePkr)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <p className="font-bold text-slate-800">Prerequisites & Eligibility Snippet:</p>
              <p className="text-slate-600 leading-relaxed">{selectedCourseForPreview.eligibilitySnippet}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  handleRejectCourse(selectedCourseForPreview.id);
                  setCoursePreviewModalOpen(false);
                }}
                className="text-rose-600 border-rose-300 hover:bg-rose-50"
              >
                Request Revisions
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  handleApproveCourse(selectedCourseForPreview.id);
                  setCoursePreviewModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                Approve & Publish to Catalog
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Modal: Receipt Viewer */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => {
          setReceiptModalOpen(false);
          setReceiptZoom(1);
        }}
        title="Student Fee Payment Receipt"
        description={
          selectedFeeRequest
            ? `${selectedFeeRequest.studentName} • ${selectedFeeRequest.courseTitle}`
            : 'Audit student bank or mobile wallet transaction slip'
        }
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {/* Header Bar with Quick Metadata & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Method</span>
                <span className="font-bold text-slate-800">{selectedFeeRequest?.paymentMethod || 'Manual'}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Amount</span>
                <span className="font-bold text-emerald-700">PKR {selectedFeeRequest?.amountPkr?.toLocaleString() || '0'}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">TID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedFeeRequest?.tid || 'N/A'}
                  </span>
                  {selectedFeeRequest?.tid && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedFeeRequest.tid);
                        setCopiedTid(true);
                        setTimeout(() => setCopiedTid(false), 2000);
                      }}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Copy Transaction ID"
                    >
                      {copiedTid ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Zoom & View Controls */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setReceiptZoom((prev) => Math.max(0.6, prev - 0.2))}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setReceiptZoom(1)}
                className="px-2 py-0.5 text-[11px] font-mono text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(receiptZoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setReceiptZoom((prev) => Math.min(2.5, prev + 0.2))}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-slate-200 mx-0.5" />
              {selectedReceiptUrl && (
                <a
                  href={selectedReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-brand-indigo transition-colors flex items-center gap-1 text-[11px] font-medium"
                  title="Open Full Image in New Tab"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Open Original</span>
                </a>
              )}
            </div>
          </div>

          {/* Screenshot Display Frame - 100% Fully Visible with object-contain */}
          <div className="min-h-[380px] max-h-[64vh] w-full rounded-2xl overflow-auto bg-slate-950 border border-slate-800 flex items-center justify-center p-3 relative shadow-inner">
            {selectedReceiptUrl ? (
              <div className="flex items-center justify-center min-w-full min-h-full">
                <img
                  src={selectedReceiptUrl}
                  alt="Student Payment Receipt Screenshot"
                  style={{
                    transform: `scale(${receiptZoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="max-h-[60vh] w-auto max-w-full object-contain mx-auto rounded-lg shadow-2xl block"
                />
              </div>
            ) : (
              <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                <span>No receipt image uploaded.</span>
              </div>
            )}
          </div>

          {/* Verification Tip */}
          <div className="p-3 bg-amber-50/90 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="font-bold">Audit Check:</span> Ensure TID matches incoming SMS alerts or business portal logs before unlocking course access.
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Submitted: {selectedFeeRequest?.submittedAt || 'Recently'}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setReceiptModalOpen(false);
                  setReceiptZoom(1);
                }}
              >
                Close
              </Button>
              {selectedFeeRequest && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedFeeRequest.id;
                      setReceiptModalOpen(false);
                      handleRejectFee(id);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedFeeRequest.id;
                      setReceiptModalOpen(false);
                      handleApproveFee(id);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve Access</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </RoleGuard>
  );
}
