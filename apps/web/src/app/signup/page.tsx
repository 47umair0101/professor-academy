'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthBrandHeader, AuthIllustrationCard } from '@/components/auth/auth-illustration';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { COURSE_CATEGORIES } from '@professor-academy/shared';

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [program, setProgram] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your Pakistani phone number');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your city');
      return;
    }
    if (!program) {
      setErrorMsg('Please select your target academic program');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!agreed) {
      setErrorMsg('You must agree to the terms and privacy policy to continue');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await signup({
        fullName,
        email,
        phone,
        city,
        program,
        password,
      });

      if (!res.success && res.error) {
        setErrorMsg(res.error);
      }
    } catch {
      setErrorMsg('Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Side: Floating Sign Up Form Card */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          <AuthBrandHeader />

          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-7 sm:p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Create your account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Join Professor Online Academy in less than a minute.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Muhammad Ali"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-10 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full h-10 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* City & Program Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore"
                    className="w-full h-10 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Select Program
                  </label>
                  <div className="relative">
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full h-10 px-3.5 pr-8 text-sm rounded-lg border border-slate-200 bg-white appearance-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      required
                    >
                      <option value="">Choose a program</option>
                      {COURSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      terms and conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Hero Text & Illustration */}
        <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Start learning today.
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              A single account gives you access to notes, videos, live classes and quizzes.
            </p>
          </div>

          <AuthIllustrationCard />
        </div>
      </div>
    </div>
  );
}
