import * as React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Smartphone, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300 text-xs">
      {/* Top Banner: Verification & Payment Support */}
      <div className="border-b border-slate-800 py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs">
                Official Pakistani Board & Entrance Exam Curriculum
              </p>
              <p className="text-[11px] text-slate-400">
                Mapped to FBISE, Punjab & Sindh BISE, Cambridge International, and MDCAT / ECAT.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 text-[11px]">Accepted Local Fees (PKR):</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium">
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              Meezan & Bank Transfer
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium">
              <Smartphone className="h-3.5 w-3.5 text-rose-400" />
              JazzCash
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium">
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              Easypaisa
            </span>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
            Academics & Tests
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">
                MDCAT Preparation
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">
                ECAT & NET Math
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">
                FSc Pre-Medical
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">
                FSc Pre-Engineering
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
            Resources & Vault
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/past-papers" className="hover:text-white transition-colors">
                Past Papers Vault (PDF)
              </Link>
            </li>
            <li>
              <Link href="/design-preview" className="hover:text-white transition-colors">
                UI & Design Showcase
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About the Academy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Faculty Admissions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
            Governance
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Academic Honor Code
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-white transition-colors">
                Fee Verification Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
            Professor Academy
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Pakistan&apos;s premier LMS designed with 100% free-first scalable architecture.
          </p>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Helpline: +92 (300) 123-4567</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-brand-indigo text-white flex items-center justify-center font-bold text-[10px]">
            P
          </div>
          <span className="font-medium text-slate-300">Professor Academy</span>
        </div>
        <p>© {new Date().getFullYear()} Professor Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};
