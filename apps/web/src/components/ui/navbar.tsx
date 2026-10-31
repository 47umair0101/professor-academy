'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Search,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Command,
  BookOpen,
  FileText,
} from 'lucide-react';
import type { UserRole } from '@professor-academy/shared';

import { useAuth } from '@/lib/auth/auth-context';

export interface NavbarProps {
  currentRole?: UserRole | null;
  onRoleSwitch?: (role: UserRole | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleSwitch }) => {
  const { user, role: authRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const effectiveRole = currentRole !== undefined ? currentRole : authRole;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Modern Brand Logo & Catalog link */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-brand-indigo text-white flex items-center justify-center shadow-subtle group-hover:bg-brand-indigoHover transition-colors">
              <GraduationCap className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none text-slate-900 tracking-tight">
                Professor<span className="text-brand-indigo font-normal">Academy</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Pakistan Academic Portal
              </span>
            </div>
          </Link>

          <Link
            href="/courses"
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-indigo px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Courses</span>
          </Link>

          <Link
            href="/past-papers"
            className={cn(
              'hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
              pathname === '/past-papers'
                ? 'text-brand-indigo bg-indigo-50/60'
                : 'text-slate-600 hover:text-brand-indigo hover:bg-slate-50'
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Past Papers</span>
          </Link>
        </div>

        {/* Center: Sleek Modern Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg items-center relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search MDCAT, ECAT, Past Papers, or Teachers..."
            className="w-full h-9 pl-9 pr-14 text-xs bg-slate-50 border border-slate-200/90 rounded-lg placeholder:text-slate-400 focus:bg-white focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 focus:outline-none transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* Right Section: UI Showcase, Role Simulator & Auth */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/design-preview"
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors',
              pathname === '/design-preview'
                ? 'text-brand-indigo bg-indigo-50 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
            <span>UI Showcase</span>
          </Link>

          {/* Quick Role Simulator Pill */}
          {onRoleSwitch && (
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => onRoleSwitch(null)}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all',
                  currentRole === null
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('STUDENT')}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all',
                  currentRole === 'STUDENT'
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('TEACHER')}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all',
                  currentRole === 'TEACHER'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('ADMIN')}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all',
                  currentRole === 'ADMIN'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                Admin
              </button>
            </div>
          )}

          {effectiveRole ? (
            <div className="flex items-center gap-2">
              <Link href={`/${effectiveRole.toLowerCase()}/dashboard`}>
                <Button size="sm" variant="primary">
                  {effectiveRole} Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Enroll Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-1 text-xs font-semibold text-slate-700">
            <Link href="/courses" className="py-2 px-2 hover:bg-slate-50 rounded-lg">
              Course Catalog
            </Link>
            <Link href="/past-papers" className="py-2 px-2 hover:bg-slate-50 rounded-lg">
              Past Papers Vault
            </Link>
            <Link href="/design-preview" className="py-2 px-2 hover:bg-slate-50 rounded-lg">
              UI Showcase
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login">
              <Button variant="secondary" className="w-full" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="w-full" size="sm">
                Enroll Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
