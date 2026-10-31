'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth, SEED_ACCOUNTS } from '@/lib/auth/auth-context';
import { AuthBrandHeader, AuthIllustrationCard } from '@/components/auth/auth-illustration';
import { ShieldCheck, Sparkles } from 'lucide-react';
import type { UserRole } from '@professor-academy/shared';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('STUDENT');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await login(emailOrPhone, password);
      if (!res.success && res.error) {
        setErrorMsg(res.error);
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (role: UserRole) => {
    setSelectedRole(role);
    const acc = SEED_ACCOUNTS[role];
    setEmailOrPhone(acc.email);
    setPassword('Password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Side: Brand & Hero Illustration */}
        <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
          <AuthBrandHeader />

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Welcome back to your preparation journey.
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Continue your courses, take weekend quizzes and track your growth.
            </p>
          </div>

          <AuthIllustrationCard />
        </div>

        {/* Right Side: Clean White Floating Auth Card */}
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          {/* Quick Demo Credentials Bar for Easy Evaluation */}
          <div className="w-full mb-3 flex items-center justify-between bg-white border border-slate-200/90 rounded-xl p-2 px-3 text-xs shadow-subtle">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
              1-Click Demo:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('STUDENT')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('TEACHER')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedRole === 'TEACHER'
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ADMIN')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Main Login Card */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-card p-7 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedRole === 'STUDENT'
                  ? 'Student Login'
                  : selectedRole === 'TEACHER'
                  ? 'Teacher Console Login'
                  : 'Admin Portal Login'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your details to access your dashboard.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              {/* Remember me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-indigo focus:ring-brand-indigo"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-brand-indigo font-semibold hover:text-brand-indigoHover hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Primary Action Button (Matches Homepage Royal Indigo) */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full h-11 rounded-lg bg-brand-indigo hover:bg-brand-indigoHover active:bg-[#3730A3] text-white font-semibold text-sm transition-all shadow-subtle hover:shadow-card disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? 'Authenticating...' : 'Login'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              New student?{' '}
              <Link href="/signup" className="text-brand-indigo font-semibold hover:text-brand-indigoHover hover:underline">
                Create an account
              </Link>
            </div>
          </div>

          {/* Secure Trust Notice */}
          <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-400 font-medium">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <span>Secure login — your data stays private.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
