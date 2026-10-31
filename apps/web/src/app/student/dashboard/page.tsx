'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  LogOut,
  FileText,
  CreditCard,
  User,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <RoleGuard allowedRoles={['STUDENT']}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentRole="STUDENT" />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="indigo" hasDot>
                  STUDENT PORTAL
                </Badge>
                <span className="text-xs text-slate-400 font-medium">
                  {user?.city ? `City: ${user.city}` : 'Pakistan'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, {user?.fullName || 'Student'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Registered Program: <span className="font-semibold text-slate-700">{user?.program || 'MDCAT Preparation'}</span> • {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/courses">
                <Button variant="primary" size="md">
                  Browse Courses
                </Button>
              </Link>
              <Button variant="secondary" size="md" onClick={logout} leftIcon={<LogOut className="h-4 w-4" />}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Enrolled Courses</span>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">2 Active</div>
              <p className="text-[11px] text-slate-400">1 awaiting fee verification</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Completed Lessons</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">18 / 42</div>
              <p className="text-[11px] text-emerald-600 font-medium">42.8% overall progress</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Quizzes Attempted</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">4 Tests</div>
              <p className="text-[11px] text-slate-400">Average score: 84.5%</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Certificates</span>
                <Award className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">0 Issued</div>
              <p className="text-[11px] text-slate-400">Complete 100% course to unlock</p>
            </div>
          </div>

          {/* Module 2 Auth Handshake Notice */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>Role-Based Authentication Verified</span>
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              You are currently signed in as a <span className="font-semibold">STUDENT</span>. Your session is securely stored.
              Student course learning players, topic discussions, and quiz taking are slated for Module 7 & 8.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
