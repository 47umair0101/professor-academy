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
  ShieldAlert,
  Users,
  CreditCard,
  BookOpen,
  Settings,
  LogOut,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { formatPKR } from '@professor-academy/shared';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentRole="ADMIN" />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="danger" hasDot>
                  ADMIN SUPERUSER CENTER
                </Badge>
                <span className="text-xs text-slate-400 font-medium">
                  Executive Operations
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Portal Operations: {user?.fullName || 'Super Administrator'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Governance & Verification Controller • {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="md" leftIcon={<Settings className="h-4 w-4" />}>
                Platform Governance
              </Button>
              <Button variant="secondary" size="md" onClick={logout} leftIcon={<LogOut className="h-4 w-4" />}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Admin KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Fee Verifications In Queue</span>
                <CreditCard className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">7 Pending</div>
              <p className="text-[11px] text-amber-600 font-medium">Awaiting receipt OCR review</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Active Students</span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">1,842 Active</div>
              <p className="text-[11px] text-slate-400">Scale target: 10,000+ users</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Published Courses</span>
                <BookOpen className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">24 Courses</div>
              <p className="text-[11px] text-slate-400">Direct publishing currently OFF</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Platform Revenue (20%)</span>
                <FileCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-700">{formatPKR(312000)}</div>
              <p className="text-[11px] text-slate-400">Total gross: {formatPKR(1560000)}</p>
            </div>
          </div>

          {/* Module 2 Notice */}
          <div className="p-6 rounded-2xl bg-red-50/70 border border-red-200 text-red-900 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-red-600" />
              <span>Admin Superuser Authentication Active</span>
            </h3>
            <p className="text-xs text-red-800 leading-relaxed">
              Teacher provisioning, direct-publish governance toggles, and fee verification queues are scheduled for Module 4 & 6.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
