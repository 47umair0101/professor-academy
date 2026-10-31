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
  CalendarCheck,
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
} from 'lucide-react';

type NavTab =
  | 'dashboard'
  | 'my-learning'
  | 'video-courses'
  | 'text-courses'
  | 'live-classes'
  | 'weekend-quiz'
  | 'mock-tests'
  | 'past-papers'
  | 'fee-details'
  | 'notifications'
  | 'profile'
  | 'support';

type NotificationCategory = 'All' | 'Academic' | 'Fees' | 'Quizzes' | 'Classes';

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<NavTab>('dashboard');
  const [notificationFilter, setNotificationFilter] = React.useState<NotificationCategory>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = React.useState(3);

  // Notifications Mock Data matching design screenshot
  const [notifications, setNotifications] = React.useState([
    {
      id: 'n-1',
      title: 'New lecture uploaded: Renaissance Deep Dive',
      category: 'Academic' as const,
      time: '2 hours ago',
      isNew: true,
      icon: Video,
      iconBg: 'bg-indigo-50 text-brand-indigo',
    },
    {
      id: 'n-2',
      title: 'Reminder: Weekend Quiz Week 12 starts Saturday',
      category: 'Quizzes' as const,
      time: '5 hours ago',
      isNew: true,
      icon: ClipboardCheck,
      iconBg: 'bg-indigo-50 text-brand-indigo',
    },
    {
      id: 'n-3',
      title: 'Fee due reminder: Rs 15,000 due on 01 Jan',
      category: 'Fees' as const,
      time: 'Yesterday',
      isNew: true,
      icon: Wallet,
      iconBg: 'bg-indigo-50 text-brand-indigo',
    },
    {
      id: 'n-4',
      title: 'Live class reminder: English Literature at 7 PM',
      category: 'Classes' as const,
      time: 'Yesterday',
      isNew: false,
      icon: Radio,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'n-5',
      title: 'New past paper added: KPPSC Lecturer English 2024',
      category: 'Academic' as const,
      time: '3 days ago',
      isNew: false,
      icon: FileText,
      iconBg: 'bg-slate-100 text-slate-600',
    },
  ]);

  const filteredNotifications = React.useMemo(() => {
    if (notificationFilter === 'All') return notifications;
    return notifications.filter((n) => n.category === notificationFilter);
  }, [notifications, notificationFilter]);

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
    setUnreadNotificationsCount(0);
  };

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-learning' as NavTab, label: 'My Learning', icon: BookOpen },
    { id: 'video-courses' as NavTab, label: 'Video Courses', icon: Video },
    { id: 'text-courses' as NavTab, label: 'Text Courses / Notes', icon: FileText },
    { id: 'live-classes' as NavTab, label: 'Live Classes', icon: Radio },
    { id: 'weekend-quiz' as NavTab, label: 'Weekend Quiz', icon: CalendarCheck },
    { id: 'mock-tests' as NavTab, label: 'Mock Tests', icon: ClipboardCheck },
    { id: 'past-papers' as NavTab, label: 'Past Papers', icon: FileText, href: '/past-papers' },
    { id: 'fee-details' as NavTab, label: 'Fee Details', icon: Wallet },
    {
      id: 'notifications' as NavTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { id: 'profile' as NavTab, label: 'My Profile', icon: User },
    { id: 'support' as NavTab, label: 'Support', icon: LifeBuoy },
  ];

  return (
    <RoleGuard allowedRoles={['STUDENT']}>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
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
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  ACADEMY
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, notes, quizzes..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-full placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
            />
          </div>

          {/* Right Controls: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Button */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-9 w-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.fullName
                  ? user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'MA'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.fullName || 'Muhammad Ali'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium capitalize">
                  {user?.role?.toLowerCase() || 'Student'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Dashboard Body Layout: Sidebar + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside
            className={`
              fixed lg:static inset-y-16 left-0 z-20 w-64 bg-white border-r border-slate-200/90
              flex flex-col justify-between py-4 px-3 transform transition-transform duration-200 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Nav Links */}
            <div className="space-y-1 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span>{item.label}</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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

            {/* Logout Action at Bottom */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-colors"
              >
                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl">
            {/* VIEW 1: NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Stay up to date with your academy.</p>
                  </div>

                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-bold text-brand-indigo hover:text-brand-indigoHover self-start sm:self-auto hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Filter Tabs Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {(['All', 'Academic', 'Fees', 'Quizzes', 'Classes'] as NotificationCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setNotificationFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          notificationFilter === cat
                            ? 'bg-brand-indigo text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                {/* Notifications List Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className="p-4 sm:p-5 flex items-start sm:items-center gap-4 hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Circular Icon */}
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {notif.title}
                              </h4>
                              {notif.isNew && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold tracking-wider">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {notif.time} • <span className="font-medium text-slate-600">{notif.category}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      No notifications in this category.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: MAIN DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Greeting Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      Welcome back, {user?.fullName?.split(' ')[0] || 'Muhammad'}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Continue your preparation and stay ahead.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('my-learning')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Go to My Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* 4 Quick Stat Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Active Programs */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Active Programs</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">3</h3>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Card 2: Learning Progress */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Learning Progress</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">68%</h3>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Card 3: Upcoming Quiz */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Upcoming Quiz</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">2 days</h3>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Card 4: Pending Fee */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Pending Fee</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono">
                        Rs 5,000
                      </h3>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Wallet className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* 2-Column Main Section (Left ~65%, Right ~35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT COLUMN: 8 Columns */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Continue Learning Section */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-base text-slate-900">Continue Learning</h2>
                        <button
                          onClick={() => setActiveTab('my-learning')}
                          className="text-xs font-bold text-brand-indigo hover:underline"
                        >
                          View all
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Course 1 */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <h3 className="font-bold text-sm text-slate-900">KPPSC Lecturer Prep</h3>
                            <p className="text-xs text-slate-500">English Literature — Renaissance</p>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-brand-indigo h-1.5 rounded-full" style={{ width: '72%' }} />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold font-mono text-slate-600">72%</span>
                            <Button variant="secondary" size="sm" className="font-semibold text-xs">
                              Continue
                            </Button>
                          </div>
                        </div>

                        {/* Course 2 */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <h3 className="font-bold text-sm text-slate-900">SST General</h3>
                            <p className="text-xs text-slate-500">Pakistan Studies — Ideology</p>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-brand-indigo h-1.5 rounded-full" style={{ width: '45%' }} />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold font-mono text-slate-600">45%</span>
                            <Button variant="secondary" size="sm" className="font-semibold text-xs">
                              Continue
                            </Button>
                          </div>
                        </div>

                        {/* Course 3 */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <h3 className="font-bold text-sm text-slate-900">Lecturership Notes</h3>
                            <p className="text-xs text-slate-500">Linguistics — Phonetics</p>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-brand-indigo h-1.5 rounded-full" style={{ width: '30%' }} />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold font-mono text-slate-600">30%</span>
                            <Button variant="secondary" size="sm" className="font-semibold text-xs">
                              Continue
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Live Classes Section */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-base text-slate-900">Upcoming Live Classes</h2>
                        <button
                          onClick={() => setActiveTab('live-classes')}
                          className="text-xs font-bold text-brand-indigo hover:underline"
                        >
                          See schedule
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Class 1 */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                              <Radio className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm text-slate-900">English Literature</h4>
                              <p className="text-xs text-slate-500">
                                Prof. Kashif Iqbal • Sat, 12 Dec • 7:00 PM
                              </p>
                            </div>
                          </div>

                          <Button variant="primary" size="sm" className="text-xs font-bold">
                            Join Class
                          </Button>
                        </div>

                        {/* Class 2 */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                              <Radio className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm text-slate-900">Pakistan Studies</h4>
                              <p className="text-xs text-slate-500">
                                Ma&apos;am Saria Riaz • Sun, 13 Dec • 5:00 PM
                              </p>
                            </div>
                          </div>

                          <Button variant="primary" size="sm" className="text-xs font-bold">
                            Join Class
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: 4 Columns */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Weekend Quiz Featured Card */}
                    <div className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-sm space-y-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        Weekend Quiz
                      </span>

                      <h3 className="font-bold text-base text-slate-900 leading-snug">
                        Week 12 — General Knowledge
                      </h3>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-b border-slate-100 py-2.5">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Questions</span>
                          <strong className="text-slate-800 text-sm">50</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Time left</span>
                          <strong className="text-slate-800 text-sm">1d 4h</strong>
                        </div>
                      </div>

                      <Button variant="primary" size="md" className="w-full text-xs font-bold shadow-xs">
                        Start Quiz
                      </Button>
                    </div>

                    {/* Latest Announcements Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-brand-indigo" />
                        <span>Latest Announcements</span>
                      </h3>

                      <div className="space-y-3 text-xs divide-y divide-slate-100">
                        <div className="pt-1.5 first:pt-0">
                          <p className="font-semibold text-slate-800 leading-tight">
                            New past papers uploaded for KPPSC 2024
                          </p>
                          <span className="text-[11px] text-slate-400">2 hours ago</span>
                        </div>

                        <div className="pt-2">
                          <p className="font-semibold text-slate-800 leading-tight">
                            Weekend Quiz #12 is live now
                          </p>
                          <span className="text-[11px] text-slate-400">Yesterday</span>
                        </div>

                        <div className="pt-2">
                          <p className="font-semibold text-slate-800 leading-tight">
                            Fee submission window extended by 3 days
                          </p>
                          <span className="text-[11px] text-slate-400">2 days ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-indigo" />
                        <span>Recent Activity</span>
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              Completed lesson: Renaissance Period
                            </p>
                            <span className="text-[11px] text-slate-400">Today, 10:32 AM</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="h-6 w-6 rounded-full bg-indigo-50 text-brand-indigo flex items-center justify-center shrink-0 mt-0.5">
                            <ClipboardCheck className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              Attempted Quiz — Week 11 (Score 42/50)
                            </p>
                            <span className="text-[11px] text-slate-400">Yesterday, 8:00 PM</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="h-6 w-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Radio className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              Joined live class: English Literature
                            </p>
                            <span className="text-[11px] text-slate-400">3 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Resource Banner */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 text-center space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-brand-indigo flex items-center justify-center mx-auto shadow-xs">
                        <FileText className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700">
                        Explore more resources in the library.
                      </p>
                      <Link href="/past-papers" className="block">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Browse Past Papers
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: OTHER TABS PLACEHOLDER (e.g. My Learning, Live Classes) */}
            {activeTab !== 'dashboard' && activeTab !== 'notifications' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 capitalize">
                  {activeTab.replace('-', ' ')}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  This section connects with Module 7 & 8 (Student Course Player, Live Quiz Engine, and Fee Verification Queue).
                </p>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
