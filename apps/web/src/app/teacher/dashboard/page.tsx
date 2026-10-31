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
  Users,
  BookOpen,
  DollarSign,
  PlusCircle,
  LogOut,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatPKR } from '@professor-academy/shared';

export default function TeacherDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <RoleGuard allowedRoles={['TEACHER']}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentRole="TEACHER" />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="indigo" hasDot>
                  TEACHER CONSOLE
                </Badge>
                <span className="text-xs text-slate-400 font-medium">
                  Faculty Account • 80% Payout Split
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Instructor Console: {user?.fullName || 'Faculty Member'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Department: <span className="font-semibold text-slate-700">{user?.program || 'Physics Department'}</span> • {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" leftIcon={<PlusCircle className="h-4 w-4" />}>
                Create New Course
              </Button>
              <Button variant="secondary" size="md" onClick={logout} leftIcon={<LogOut className="h-4 w-4" />}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Teacher KPIs (Mandated by PRD Section 6 & 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Active Courses</span>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">3 Courses</div>
              <p className="text-[11px] text-slate-400">1 draft in review</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Enrolled Students</span>
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">428 Students</div>
              <p className="text-[11px] text-emerald-600 font-medium">+34 this week</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Gross Course Sales</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatPKR(285000)}</div>
              <p className="text-[11px] text-slate-400">Total verified student fees</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Teacher Share (80%)</span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-700">{formatPKR(228000)}</div>
              <p className="text-[11px] text-slate-400">Platform share (20%): {formatPKR(57000)}</p>
            </div>
          </div>

          {/* Module 2 Notice */}
          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-900 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span>Teacher Role Authentication Active</span>
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Course creation with YouTube unlisted embeds, Tiptap rich-text articles, and Gemini AI image generation are scheduled for Module 5.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
