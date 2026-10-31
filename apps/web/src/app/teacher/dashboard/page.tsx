'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  Radio,
  ClipboardCheck,
  Wallet,
  Bell,
  User,
  LifeBuoy,
  LogOut,
  Search,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronDown,
  Volume2,
  CheckCircle2,
  Sparkles,
  Menu,
  X,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Users,
  DollarSign,
  PlusCircle,
  MessageSquare,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { formatPKR } from '@professor-academy/shared';

type TeacherNavTab =
  | 'dashboard'
  | 'my-courses'
  | 'curriculum'
  | 'ai-copilot'
  | 'discussions'
  | 'live-classes'
  | 'quizzes'
  | 'earnings'
  | 'profile'
  | 'support';

export default function TeacherDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TeacherNavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [unreadNotificationsCount] = React.useState(2);

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

  const navItems = [
    { id: 'dashboard' as TeacherNavTab, label: 'Teacher Dashboard', icon: LayoutDashboard },
    { id: 'my-courses' as TeacherNavTab, label: 'My Courses', icon: BookOpen },
    { id: 'curriculum' as TeacherNavTab, label: 'Curriculum & Lectures', icon: Video },
    { id: 'ai-copilot' as TeacherNavTab, label: 'Gemini AI Co-Pilot', icon: Sparkles, badge: 'AI' },
    { id: 'discussions' as TeacherNavTab, label: 'Student Q&A', icon: MessageSquare, badge: 5 },
    { id: 'live-classes' as TeacherNavTab, label: 'Live Sessions', icon: Radio },
    { id: 'quizzes' as TeacherNavTab, label: 'Quizzes & Grading', icon: ClipboardCheck },
    { id: 'earnings' as TeacherNavTab, label: 'Earnings & Payouts', icon: DollarSign },
    { id: 'profile' as TeacherNavTab, label: 'Faculty Profile', icon: User },
    { id: 'support' as TeacherNavTab, label: 'Faculty Support', icon: LifeBuoy },
  ];

  return (
    <RoleGuard allowedRoles={['TEACHER']}>
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
              <div className="h-9 w-9 rounded-xl bg-brand-indigo text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base leading-none text-slate-900 tracking-tight">
                  Professor Online
                </span>
                <span className="text-[10px] text-brand-indigo font-bold tracking-wider uppercase">
                  FACULTY PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures, enrolled students, question threads..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-full placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
            />
          </div>

          {/* Right Controls: Highly Visible Notifications Button & Interactive Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              title="Faculty Notifications"
              className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-xs"
            >
              <Bell className="h-5 w-5 text-slate-800 stroke-[2.2]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill with Interactive Dropdown */}
            <div className="relative pl-1 border-l border-slate-200" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none"
              >
                <div className="h-9 w-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-100">
                  {user?.fullName
                    ? user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'AM'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.fullName || 'Prof. Dr. Arshad Mahmood'}
                  </span>
                  <span className="text-[10px] text-brand-indigo font-semibold">
                    Senior Faculty • 80% Cut
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180 text-brand-indigo' : ''
                  }`}
                />
              </button>

              {/* Interactive Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.fullName || 'Prof. Dr. Arshad'}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {user?.email || 'teacher@professoracademy.pk'}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Direct Publish Authorized</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Faculty Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('earnings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span>Payouts & Bank Info</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('support');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <LifeBuoy className="h-4 w-4 text-slate-400" />
                      <span>Admin Faculty Desk</span>
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
                        ? 'bg-indigo-50 text-brand-indigo font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-brand-indigo' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="h-4 px-1.5 rounded-full bg-brand-indigo text-white text-[10px] font-bold flex items-center justify-center">
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
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-brand-indigo text-xs font-bold mb-1">
                  <span>Department of Physics</span>
                  <span>•</span>
                  <span>80% Revenue Share</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Instructor Console: {user?.fullName || 'Prof. Dr. Arshad'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Manage your academic courses, create AI-assisted quizzes, and track enrolled students.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab('my-courses')}
                  className="inline-flex flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
                >
                  <PlusCircle className="h-4 w-4 shrink-0" />
                  <span>+ Create New Course</span>
                </button>
              </div>
            </div>

            {/* 4 Quick Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Enrolled Students */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Total Students</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">1,280</h3>
                  <span className="text-[11px] text-emerald-600 font-medium">↑ +14% this month</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              {/* Card 2: Active Courses */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Active Courses</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">4</h3>
                  <span className="text-[11px] text-slate-400">All published</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>

              {/* Card 3: Net Earnings (80% Cut) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Net Earnings (80%)</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono">
                    PKR 468,000
                  </h3>
                  <span className="text-[11px] text-slate-400">Meezan Bank payout</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              {/* Card 4: Direct Publish Privilege */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Direct Publish</p>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-700 mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Authorized</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Instant publish without review</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* 2-Column Main Section (Left ~65%, Right ~35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
              {/* LEFT COLUMN: 8 Columns */}
              <div className="lg:col-span-8 space-y-6">
                {/* My Active Courses List */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-base text-slate-900">My Published Courses</h2>
                      <p className="text-xs text-slate-500">Curricula managed under your faculty account.</p>
                    </div>

                    <Link href="/courses">
                      <Button variant="outline" size="md" className="text-xs font-semibold">
                        <span>Public Catalog View</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {/* Course 1 */}
                    <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            PUBLISHED
                          </span>
                          <span className="text-xs font-mono text-slate-500">PKR 4,500</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">
                          MDCAT Physics: Complete High-Yield Prep & Past Paper Shortcuts (2026)
                        </h4>
                        <p className="text-xs text-slate-500">
                          4,210 students enrolled • 54 lectures • 38 total hours
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="secondary" size="md" className="text-xs">
                          Edit Curriculum
                        </Button>
                      </div>
                    </div>

                    {/* Course 2 */}
                    <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            PUBLISHED
                          </span>
                          <span className="text-xs font-mono text-slate-500">PKR 3,800</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">
                          FSc Pre-Medical Physics Part-1: Mechanics & Heat
                        </h4>
                        <p className="text-xs text-slate-500">
                          1,150 students enrolled • 42 lectures • 30 total hours
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="secondary" size="md" className="text-xs">
                          Edit Curriculum
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Q&A Threads */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-base text-slate-900">Recent Student Questions (Q&A)</h2>
                      <p className="text-xs text-slate-500">Unanswered doubts from enrolled students.</p>
                    </div>

                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      5 Pending Replies
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Bilal Hassan (MDCAT Physics)</span>
                        <span className="text-slate-400 text-[11px]">15 mins ago</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        &quot;Sir, in Lecture 1.2 projectile shortcut formula, why do we ignore air resistance for max range? Is it applicable for UHS test questions?&quot;
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button variant="primary" size="md" className="text-xs">
                          Reply to Bilal
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 4 Columns */}
              <div className="lg:col-span-4 space-y-6">
                {/* Gemini AI Co-Pilot Card */}
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-5 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-indigo-300" />
                      <span>Gemini AI Co-Pilot</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Module 5</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">Generate High-Yield Content</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Use Google Gemini AI to draft lecture outlines, format board MCQs with explanations, and summarize notes.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-200 flex items-center justify-between transition-colors border border-slate-700">
                      <span>✨ Draft 10 MDCAT Physics MCQs</span>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                    </button>
                    <button className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-200 flex items-center justify-between transition-colors border border-slate-700">
                      <span>✨ Summarize Chapter Formulas</span>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                    </button>
                  </div>
                </div>

                {/* Revenue Breakdown (80/20 Split) Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span>Earnings Distribution (80/20)</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Gross Sales Volume</span>
                      <strong className="text-slate-900 font-mono">PKR 585,000</strong>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-emerald-700 font-semibold">Teacher Payout (80%)</span>
                      <strong className="text-emerald-700 font-mono font-bold">PKR 468,000</strong>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400">Platform Cut (20%)</span>
                      <span className="text-slate-400 font-mono">PKR 117,000</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                    <p className="font-semibold text-slate-800">Disbursement Method:</p>
                    <p>Meezan Bank Ltd (Direct Deposit on 1st of each month).</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
