import * as React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Phone, Mail, MapPin, Building2, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-academic-border bg-white text-academic-slate">
      {/* Upper Footer: Academic Credentials & Trust Badges */}
      <div className="border-b border-academic-border bg-academic-cream/50 py-8">
        <div className="max-w-academic mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-academic bg-academic-navy text-academic-gold shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-academic-navy">
                Verified Faculty & Syllabus
              </h4>
              <p className="text-xs text-academic-slate mt-0.5 leading-relaxed">
                Courses rigorously mapped to FBISE, BISE Punjab/Sindh, Cambridge & MDCAT syllabus.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-academic bg-academic-gold text-white shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-academic-navy">
                Transparent Local Payments (PKR)
              </h4>
              <p className="text-xs text-academic-slate mt-0.5 leading-relaxed">
                Direct manual verification via Pakistani Bank Transfer, JazzCash, or Easypaisa. Zero hidden fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-academic bg-academic-navy text-academic-gold shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-academic-navy">
                Dedicated Academic Helpline
              </h4>
              <p className="text-xs text-academic-slate mt-0.5 leading-relaxed font-mono">
                +92 (300) 123-4567 • Mon-Sat (9 AM - 8 PM PKT)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-academic mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-academic bg-academic-navy text-academic-gold flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold text-lg text-academic-navy">
              Professor Academy
            </span>
          </div>
          <p className="text-xs leading-relaxed text-academic-slate max-w-sm">
            Pakistan&apos;s premier multi-platform academic LMS. Equipping Matric, Inter, O/A-Levels,
            and University entrance exam candidates with master lectures, verifiable certificates,
            and an authentic past papers vault.
          </p>

          {/* Payment Method Badges */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-academic-slate block mb-2">
              Accepted Pakistani Payment Methods:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-academic bg-white border border-academic-border text-xs font-semibold text-academic-navy">
                <Building2 className="h-3.5 w-3.5 text-academic-gold" />
                Meezan & All Banks
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-academic bg-[#E11D48]/10 border border-[#E11D48]/30 text-xs font-semibold text-[#BE123C]">
                <Smartphone className="h-3.5 w-3.5" />
                JazzCash
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-academic bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-semibold text-[#047857]">
                <Smartphone className="h-3.5 w-3.5" />
                Easypaisa
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Academics */}
        <div>
          <h4 className="font-heading font-semibold text-sm text-academic-navy mb-3">
            Academics
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses?category=pre-medical" className="hover:text-academic-navy transition-colors">
                MDCAT Preparation
              </Link>
            </li>
            <li>
              <Link href="/courses?category=pre-engineering" className="hover:text-academic-navy transition-colors">
                ECAT & NET Preparation
              </Link>
            </li>
            <li>
              <Link href="/courses?category=fsc-pre-medical" className="hover:text-academic-navy transition-colors">
                FSc Pre-Medical
              </Link>
            </li>
            <li>
              <Link href="/courses?category=fsc-pre-engineering" className="hover:text-academic-navy transition-colors">
                FSc Pre-Engineering
              </Link>
            </li>
            <li>
              <Link href="/past-papers" className="hover:text-academic-navy transition-colors">
                Past Papers Vault
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Portals */}
        <div>
          <h4 className="font-heading font-semibold text-sm text-academic-navy mb-3">
            Portals & Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/login" className="hover:text-academic-navy transition-colors">
                Student Portal
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-academic-navy transition-colors">
                Teacher Console
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-academic-navy transition-colors">
                Admin Center
              </Link>
            </li>
            <li>
              <Link href="/design-preview" className="hover:text-academic-navy transition-colors">
                Design System Preview
              </Link>
            </li>
            <li>
              <Link href="/verify-certificate" className="hover:text-academic-navy transition-colors">
                Verify Certificate
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Office */}
        <div>
          <h4 className="font-heading font-semibold text-sm text-academic-navy mb-3">
            Headquarters
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-academic-gold shrink-0 mt-0.5" />
              <span>G-11 Markaz, Islamabad, Pakistan</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-academic-gold shrink-0" />
              <span>admissions@professoracademy.pk</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-academic-gold shrink-0" />
              <span className="font-mono">+92 (51) 876-5432</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-academic-border py-4 bg-academic-cream/30 text-xs">
        <div className="max-w-academic mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-academic-slate">
          <p>© {new Date().getFullYear()} Professor Academy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:underline">Academic Honor Code</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/refunds" className="hover:underline">Fee Verification Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
