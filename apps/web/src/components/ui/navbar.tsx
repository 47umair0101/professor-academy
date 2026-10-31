'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Badge } from './badge';
import {
  GraduationCap,
  Menu,
  X,
  BookOpen,
  FileText,
  Sparkles,
  UserCheck,
  Shield,
  LogIn,
} from 'lucide-react';
import type { UserRole } from '@professor-academy/shared';

export interface NavbarProps {
  currentRole?: UserRole | null;
  onRoleSwitch?: (role: UserRole | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = null, onRoleSwitch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Courses', href: '/courses', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Past Papers', href: '/past-papers', icon: <FileText className="h-4 w-4" /> },
    { label: 'Design System', href: '/design-preview', icon: <Sparkles className="h-4 w-4" /> },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-academic-border bg-white/95 backdrop-blur-md">
      {/* Top Banner Notice (Academic Honor Code) */}
      <div className="bg-academic-navy text-white text-[11px] py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-academic-gold animate-pulse" />
        <span>Admission Open for Matric, Inter, MDCAT & ECAT Session 2026</span>
        <span className="hidden md:inline text-academic-gold font-mono">• 100% Verified Faculty</span>
      </div>

      <div className="max-w-academic mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Crest & Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-academic bg-academic-navy text-academic-gold flex items-center justify-center shadow-subtle group-hover:bg-academic-navy-deep transition-colors">
            <GraduationCap className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg leading-tight text-academic-navy tracking-tight">
              Professor Academy
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-academic-gold">
              Pakistan Academic Portal
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-academic text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'text-academic-navy bg-academic-cream-subtle font-semibold'
                    : 'text-academic-slate hover:text-academic-charcoal hover:bg-academic-cream/60'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Quick Role Simulator / Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Interactive Role Simulator Pill for Testing / Demonstration */}
          {onRoleSwitch && (
            <div className="flex items-center gap-1.5 bg-academic-cream px-2 py-1 rounded-full border border-academic-border text-xs">
              <span className="text-[10px] uppercase font-bold text-academic-slate px-1">Role:</span>
              <button
                type="button"
                onClick={() => onRoleSwitch(null)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium transition-all',
                  currentRole === null
                    ? 'bg-academic-navy text-white shadow-sm'
                    : 'text-academic-slate hover:text-academic-charcoal'
                )}
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('STUDENT')}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium transition-all',
                  currentRole === 'STUDENT'
                    ? 'bg-academic-gold text-white shadow-sm'
                    : 'text-academic-slate hover:text-academic-charcoal'
                )}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('TEACHER')}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium transition-all',
                  currentRole === 'TEACHER'
                    ? 'bg-academic-roseGold text-white shadow-sm'
                    : 'text-academic-slate hover:text-academic-charcoal'
                )}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => onRoleSwitch('ADMIN')}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium transition-all',
                  currentRole === 'ADMIN'
                    ? 'bg-academic-status-danger text-white shadow-sm'
                    : 'text-academic-slate hover:text-academic-charcoal'
                )}
              >
                Admin
              </button>
            </div>
          )}

          {/* Active Role or Auth CTAs */}
          {currentRole ? (
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  currentRole === 'ADMIN'
                    ? 'danger'
                    : currentRole === 'TEACHER'
                    ? 'rose'
                    : 'gold'
                }
                hasDot
              >
                {currentRole} ACTIVE
              </Badge>
              <Link href={`/${currentRole.toLowerCase()}/dashboard`}>
                <Button size="sm" variant="primary">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" leftIcon={<LogIn className="h-4 w-4" />}>
                  Sign In
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
          className="md:hidden p-2 rounded-academic text-academic-slate hover:bg-academic-cream-subtle"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-academic-border bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-academic text-sm font-medium text-academic-charcoal hover:bg-academic-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-academic-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Enroll Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
