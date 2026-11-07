'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Settings,
  ShieldCheck,
  Loader2,
  Award,
  Play,
} from 'lucide-react';
import { EnrollmentService } from '@/lib/services/enrollment-service';
import { LessonService } from '@/lib/services/lesson-service';
import { NotificationService } from '@/lib/services/notification-service';
import { QuizService } from '@/lib/services/quiz-service';
import { StudentProfileView } from '@/components/student/student-profile-view';

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
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState<NavTab>('dashboard');
  const [notificationFilter, setNotificationFilter] = React.useState<NotificationCategory>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = React.useState(3);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

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

  // Enrolled Courses & Progress State (Module 7)
  const [enrolledCourses, setEnrolledCourses] = React.useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState(true);
  const [dbNotifications, setDbNotifications] = React.useState<any[]>([]);
  const [liveQuizzes, setLiveQuizzes] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user?.id) return;
    NotificationService.getUserNotifications(user.id).then((items) => {
      setDbNotifications(items);
      const unread = items.filter((n) => !n.isRead).length;
      if (unread > 0) setUnreadNotificationsCount(unread);
    });
    QuizService.getAllPublishedQuizzes(user.id).then(setLiveQuizzes);
  }, [user?.id]);

  React.useEffect(() => {
    if (!user?.id) return;
    setLoadingCourses(true);
    EnrollmentService.getStudentEnrollmentHistory(user.id).then(async (history) => {
      const active = history.filter((h) => h.enrollment.status === 'ACTIVE');
      if (active.length > 0) {
        const enriched = await Promise.all(
          active.map(async (item) => {
            const cur = await LessonService.getCourseCurriculum(item.course.id, user.id);
            const allLessons = cur.sections.flatMap((s) => s.lessons);
            const nextL = allLessons.find((l) => !l.isCompleted) || allLessons[0];
            return {
              id: item.course.id,
              title: item.course.title,
              slug: item.course.slug,
              category: item.course.category,
              thumbnailUrl: (item.course as any).thumbnailUrl || item.course.thumbnail_url,
              progressPercentage: cur.progressPercentage,
              completedCount: cur.completedLessonsCount,
              totalLessons: cur.totalLessons,
              nextLessonTitle: nextL?.title || 'Lecture 1',
            };
          })
        );
        setEnrolledCourses(enriched);
      } else {
        // Fallback default course with rich curriculum
        setEnrolledCourses([
          {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'MDCAT Physics: Complete High-Yield Prep & Past Paper Shortcuts (2026)',
            slug: 'mdcat-physics-masterclass',
            category: 'MDCAT Prep',
            thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
            progressPercentage: 33,
            completedCount: 2,
            totalLessons: 6,
            nextLessonTitle: '1.3 Work-Energy Theorem in Variable Force Systems',
          },
        ]);
      }
      setLoadingCourses(false);
    });
  }, [user?.id]);

  // Notifications Mock Data
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
    if (dbNotifications && dbNotifications.length > 0) {
      const mapped = dbNotifications.map((n) => {
        const catMap: Record<string, NotificationCategory> = {
          ACADEMIC: 'Academic',
          QUIZ: 'Quizzes',
          FEE: 'Fees',
          CLASS: 'Classes',
          GENERAL: 'Academic',
        };
        const iconMap: Record<string, { icon: any; iconBg: string }> = {
          ACADEMIC: { icon: Video, iconBg: 'bg-indigo-50 text-brand-indigo' },
          QUIZ: { icon: ClipboardCheck, iconBg: 'bg-indigo-50 text-brand-indigo' },
          FEE: { icon: Wallet, iconBg: 'bg-amber-50 text-amber-600' },
          CLASS: { icon: Radio, iconBg: 'bg-sky-50 text-sky-600' },
          GENERAL: { icon: Sparkles, iconBg: 'bg-purple-50 text-purple-600' },
        };
        const cat = catMap[n.type] || 'Academic';
        const ic = iconMap[n.type] || { icon: Bell, iconBg: 'bg-slate-100 text-slate-600' };
        return {
          id: n.id,
          title: n.title,
          message: n.message,
          category: cat,
          time: n.createdAt,
          isNew: !n.isRead,
          linkUrl: n.linkUrl,
          icon: ic.icon,
          iconBg: ic.iconBg,
        };
      });

      if (notificationFilter === 'All') return mapped;
      return mapped.filter((n) => n.category === notificationFilter);
    }

    if (notificationFilter === 'All') return notifications;
    return notifications.filter((n) => n.category === notificationFilter);
  }, [dbNotifications, notifications, notificationFilter]);

  const markAllNotificationsAsRead = async () => {
    if (user?.id) {
      await NotificationService.markAllAsRead(user.id);
    }
    setDbNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
    setUnreadNotificationsCount(0);
  };

  const handleNotificationClick = async (notif: any) => {
    if (notif.isNew) {
      await NotificationService.markAsRead(notif.id);
      setDbNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    }
    if (notif.linkUrl) {
      router.push(notif.linkUrl);
    }
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
    { id: 'fee-details' as NavTab, label: 'Fee Details', icon: Wallet, href: '/student/fees' },
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

          {/* Right Controls: Highly Visible Notifications Button & Interactive Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Highly Visible Notification Button */}
            <button
              onClick={() => {
                setActiveTab('notifications');
                setProfileDropdownOpen(false);
              }}
              title="Notifications"
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
                <div className="h-9 w-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-100 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user?.fullName || 'Student'} className="h-full w-full object-cover" />
                  ) : user?.fullName ? (
                    user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  ) : (
                    'HF'
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.fullName || 'Hamza Farooq'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize">
                    {user?.role?.toLowerCase() || 'Student'}
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
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.fullName || 'Hamza Farooq'}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {user?.email || 'student@professoracademy.pk'}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-brand-indigo">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified Student Account</span>
                    </div>
                  </div>

                  {/* Dropdown Navigation Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('my-learning');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      <span>My Enrolled Courses</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center justify-between font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="h-4 w-4 text-slate-400" />
                        <span>Notifications</span>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <span className="h-4 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        router.push('/student/fees');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <Wallet className="h-4 w-4 text-slate-400" />
                      <span>Fee Verification Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('support');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-indigo flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <LifeBuoy className="h-4 w-4 text-slate-400" />
                      <span>Academic Support</span>
                    </button>
                  </div>

                  {/* Sign Out Action in Dropdown */}
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

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                    className="text-xs font-bold text-brand-indigo hover:text-brand-indigoHover self-start sm:self-auto hover:underline cursor-pointer"
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
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
                    filteredNotifications.map((notif: any) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className="p-4 sm:p-5 flex items-start sm:items-center gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
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
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-indigo transition-colors truncate">
                                {notif.title}
                              </h4>
                              {notif.isNew && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold tracking-wider">
                                  NEW
                                </span>
                              )}
                            </div>
                            {notif.message && (
                              <p className="text-xs text-slate-600 line-clamp-1">
                                {notif.message}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-400">
                              {notif.time} • <span className="font-medium text-slate-600">{notif.category}</span>
                            </p>
                          </div>

                          {notif.linkUrl && (
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-brand-indigo transition-colors shrink-0 hidden sm:block" />
                          )}
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
              <div className="space-y-6 pb-8">
                {/* Greeting Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      Welcome back, {user?.fullName?.split(' ')[0] || 'Hamza'}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Continue your preparation and stay ahead.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('my-learning')}
                    className="inline-flex flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
                  >
                    <span>Go to My Learning</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
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
                          className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                        >
                          View all
                        </button>
                      </div>

                      <div className="space-y-3">
                        {loadingCourses ? (
                          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-brand-indigo" />
                            <span>Loading active courses...</span>
                          </div>
                        ) : enrolledCourses.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                            <p>You have no active courses yet.</p>
                            <Link href="/courses">
                              <Button variant="primary" size="sm">Browse Courses</Button>
                            </Link>
                          </div>
                        ) : (
                          enrolledCourses.map((c) => (
                            <div
                              key={c.id}
                              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-brand-indigo bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                    {c.category}
                                  </span>
                                  {c.progressPercentage === 100 && (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                      <Award className="h-3 w-3" />
                                      <span>Completed</span>
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 truncate">
                                  {c.title}
                                </h3>
                                <p className="text-xs text-slate-500 truncate">
                                  Next: {c.nextLessonTitle}
                                </p>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-brand-indigo h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${c.progressPercentage}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs font-bold font-mono text-slate-600">
                                  {c.progressPercentage}%
                                </span>
                                <Link href={`/student/courses/${c.slug}/learn`}>
                                  <Button variant="secondary" size="md" className="font-semibold text-xs flex items-center gap-1.5">
                                    <Play className="h-3 w-3 fill-current" />
                                    <span>Continue</span>
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Upcoming Live Classes Section */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-base text-slate-900">Upcoming Live Classes</h2>
                        <button
                          onClick={() => setActiveTab('live-classes')}
                          className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
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

                          <Button variant="primary" size="md" className="text-xs font-bold">
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

                          <Button variant="primary" size="md" className="text-xs font-bold">
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
                        <Button variant="outline" size="md" className="w-full text-xs font-semibold">
                          Browse Past Papers
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: MY LEARNING / ENROLLED COURSES (Module 7) */}
            {(activeTab === 'my-learning' || activeTab === 'video-courses') && (
              <div className="space-y-6 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      My Learning Vault
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Your active enrolled courses, lecture progress, and completion certificates.
                    </p>
                  </div>
                  <Link href="/courses">
                    <Button variant="secondary" size="md" className="text-xs font-bold">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Browse More Courses</span>
                    </Button>
                  </Link>
                </div>

                {loadingCourses ? (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
                    <span>Loading your enrolled courses...</span>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-brand-indigo flex items-center justify-center mx-auto">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">No Enrolled Courses Yet</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Enroll in our verified entry-test masterclasses or past-paper courses to start learning with our expert faculty.
                    </p>
                    <Link href="/courses">
                      <Button variant="primary" size="md">
                        <span>Explore Course Catalog</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="relative aspect-video bg-slate-900 overflow-hidden">
                          <img
                            src={c.thumbnailUrl}
                            alt={c.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[10px] font-bold bg-slate-950/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                              {c.category}
                            </span>
                          </div>
                          {c.progressPercentage === 100 && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                <Award className="h-3 w-3" />
                                <span>Mastered</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                              {c.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              Up next: {c.nextLessonTitle}
                            </p>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div>
                              <div className="flex justify-between items-center text-xs font-mono mb-1">
                                <span className="text-slate-500">Progress</span>
                                <span className="font-bold text-slate-800">
                                  {c.completedCount} / {c.totalLessons} Lessons ({c.progressPercentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-brand-indigo h-full transition-all duration-300"
                                  style={{ width: `${c.progressPercentage}%` }}
                                />
                              </div>
                            </div>

                            <Link href={`/student/courses/${c.slug}/learn`} className="block">
                              <Button variant="primary" size="md" className="w-full font-bold text-xs flex items-center justify-center gap-2">
                                <Play className="h-3.5 w-3.5 fill-current" />
                                <span>
                                  {c.progressPercentage === 100 ? 'Review Lectures' : 'Continue Learning'}
                                </span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW: WEEKEND QUIZZES & MOCK TESTS TAB */}
            {(activeTab === 'weekend-quiz' || activeTab === 'mock-tests') && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      {activeTab === 'weekend-quiz' ? 'Weekend Quizzes & Timed Assessments' : 'MDCAT & ECAT Full Mock Tests'}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Assess your high-yield concepts with instant auto-grading and Hybrid AI written evaluation.
                    </p>
                  </div>
                  <Badge variant="indigo" className="border-indigo-200 bg-indigo-50/50 text-brand-indigo font-bold text-xs py-1.5 px-3 self-start sm:self-auto">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-brand-indigo fill-current" />
                    AI Rationales Enabled
                  </Badge>
                </div>

                {/* Quizzes Grid */}
                {liveQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveQuizzes.map((quiz) => {
                      const attempt = quiz.studentAttempt;
                      const hasCompleted = attempt?.grading_status === 'COMPLETED';
                      const isPendingGrading = attempt?.grading_status === 'PENDING_GRADING';

                      return (
                        <div
                          key={quiz.id}
                          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                        >
                          <div className="p-6 space-y-4">
                            {/* Course / Tag Badge */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-brand-indigo uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                                {quiz.courseTitle || 'MDCAT Physics'}
                              </span>
                              {quiz.hasExpiry && quiz.expiresAt && (
                                <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Exp: {new Date(quiz.expiresAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {/* Title & Description */}
                            <div>
                              <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-indigo transition-colors line-clamp-2">
                                {quiz.title}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                {quiz.description || 'Comprehensive timed assessment testing conceptual clarity, past-paper shortcuts, and hybrid written answers.'}
                              </p>
                            </div>

                            {/* Meta Specs */}
                            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                <span>{quiz.timeLimitMinutes} Mins Duration</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Award className="h-3.5 w-3.5 text-slate-400" />
                                <span>{quiz.passingPercentage}% Pass Mark</span>
                              </div>
                            </div>

                            {/* Student Result Banner (If already attempted) */}
                            {hasCompleted && (
                              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-bold text-emerald-800">
                                    {attempt.is_passed ? 'Passed 🎉' : 'Needs Review'}
                                  </p>
                                  <p className="text-[10px] text-emerald-600">
                                    Score: {attempt.total_score} pts ({attempt.percentage}%)
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded shadow-xs">
                                  {attempt.percentage}%
                                </span>
                              </div>
                            )}

                            {isPendingGrading && (
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-bold text-amber-800">
                                    Under Review ⏳
                                  </p>
                                  <p className="text-[10px] text-amber-600">
                                    Teacher is finalizing written Q/A
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-1 rounded shadow-xs">
                                  Pending
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Button Footer */}
                          <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                            {hasCompleted ? (
                              <Link href={`/student/quizzes/${quiz.id}`} className="block w-full">
                                <Button
                                  variant="secondary"
                                  size="md"
                                  className="w-full font-bold text-xs flex items-center justify-center gap-2"
                                >
                                  <span>Review Rationales</span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            ) : isPendingGrading ? (
                              <Link href={`/student/quizzes/${quiz.id}`} className="block w-full">
                                <Button
                                  variant="secondary"
                                  size="md"
                                  className="w-full font-bold text-xs flex items-center justify-center gap-2"
                                >
                                  <span>View Submission</span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            ) : (
                              <Link href={`/student/quizzes/${quiz.id}`} className="block w-full">
                                <Button
                                  variant="primary"
                                  size="md"
                                  className="w-full font-bold text-xs flex items-center justify-center gap-2"
                                >
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                  <span>Start Assessment</span>
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center mx-auto">
                      <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">
                      No Scheduled Assessments Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Your instructors will schedule weekly conceptual quizzes and mock exam papers here. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: STUDENT PROFILE & SECURITY TAB */}
            {activeTab === 'profile' && user && (
              <StudentProfileView
                user={user}
                onProfileUpdated={(updated) => updateUser(updated)}
                enrolledCount={enrolledCourses.length}
                completedCount={enrolledCourses.reduce((acc, c) => acc + (c.completedCount || 0), 0)}
              />
            )}

            {/* VIEW 3: OTHER TABS PLACEHOLDER (e.g. My Learning, Live Classes, Fee Details) */}
            {activeTab !== 'dashboard' && activeTab !== 'notifications' && activeTab !== 'my-learning' && activeTab !== 'video-courses' && activeTab !== 'weekend-quiz' && activeTab !== 'mock-tests' && activeTab !== 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 capitalize">
                  {activeTab.replace('-', ' ')}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  This section connects with Module 6, 7 & 8 (Fee Verification Queue, Student Course Player, and Live Quiz Engine).
                </p>
                <Button variant="secondary" size="md" onClick={() => setActiveTab('dashboard')}>
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
