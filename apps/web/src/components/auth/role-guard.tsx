'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import type { UserRole } from '@professor-academy/shared';
import { ShieldAlert, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Verifying credentials & session...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user || !role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Authentication Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You must be signed in to access this portal area. Please sign in with your student, teacher, or administrator account.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Logged in but wrong role (Unauthorized access attempt)
  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 border border-red-200 mx-auto flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Access Restricted (403)</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You are currently signed in as <span className="font-semibold text-slate-800">{user.email}</span> with the <span className="font-bold text-slate-900">{role}</span> role. This section requires <span className="font-semibold text-brand-indigo">{allowedRoles.join(' or ')}</span> authorization.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push(`/${role.toLowerCase()}/dashboard`)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Go to My {role} Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
