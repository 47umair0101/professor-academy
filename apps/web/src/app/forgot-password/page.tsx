'use client';

import * as React from 'react';
import Link from 'next/link';
import { AuthBrandHeader, AuthIllustrationCard } from '@/components/auth/auth-illustration';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Side: Brand & Hero Illustration */}
        <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
          <AuthBrandHeader />

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Reset your academic account password.
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Enter your registered email and we&apos;ll send you instructions to regain access.
            </p>
          </div>

          <AuthIllustrationCard />
        </div>

        {/* Right Side: Reset Form Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-7 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Forgot password?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered academic email address.
              </p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-sm text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Password Reset Email Sent</span>
                </div>
                <p className="leading-relaxed">
                  We have dispatched a secure password reset link to <span className="font-semibold">{email}</span>. Please check your inbox and spam folder.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.pk"
                    className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <div className="text-center pt-2 border-t border-slate-100 text-xs">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
