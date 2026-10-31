import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  ShieldCheck,
  Building2,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { formatPKR } from '@professor-academy/shared';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-academic-cream">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24 border-b border-academic-border bg-white">
          <div className="max-w-academic mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="gold" hasDot>
                  Pakistan&apos;s Leading Academic Portal
                </Badge>
                <Link href="/design-preview">
                  <Badge variant="navy" className="hover:bg-academic-navy hover:text-white transition-colors cursor-pointer">
                    Preview Design System →
                  </Badge>
                </Link>
              </div>

              <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-academic-navy tracking-tight leading-[1.15]">
                Master Your Board & Entrance Exams with Proven Faculty.
              </h1>

              <p className="font-body text-base sm:text-lg text-academic-slate leading-relaxed">
                Professor Academy brings prestigious collegiate education to your screen.
                Structured video courses, high-yield rich text articles, past paper archives,
                and Gemini AI powered tutoring for Matric, FSc, O/A-Levels, MDCAT, and ECAT candidates.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/design-preview">
                  <Button size="lg" variant="gold" leftIcon={<Sparkles className="h-5 w-5" />}>
                    Explore Design Showcase (/design-preview)
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Browse Academic Catalog
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-academic-border/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-academic-slate">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-academic-status-success shrink-0" />
                  <span>100% Verified Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-academic-status-success shrink-0" />
                  <span>FBISE & Provincial Boards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-academic-status-success shrink-0" />
                  <span>JazzCash / Bank Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-academic-status-success shrink-0" />
                  <span>Free-First Modern Tech</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section className="py-16 max-w-academic mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-academic-gold font-semibold">
                Architecture Preview
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-academic-navy mt-1">
                Explore The Professor Academy Modules
              </h2>
            </div>
            <Link href="/design-preview">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Go to Design System Showcase
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-white rounded-academic border border-academic-border p-6 shadow-subtle hover:shadow-cardHover transition-all space-y-4">
              <div className="h-10 w-10 rounded-academic bg-academic-navy text-academic-gold flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-academic-navy">
                Design System & Tokens
              </h3>
              <p className="text-xs text-academic-slate leading-relaxed">
                Anti-&ldquo;vibe-coded&rdquo; styling across Web and Mobile. Academic Navy (#1A2451),
                Heritage Gold (#C59B27), Warm Cream (#FAF9F6), and Poppins typography.
              </p>
              <Link href="/design-preview" className="inline-block text-xs font-semibold text-academic-gold hover:underline">
                Inspect UI Components & Tokens →
              </Link>
            </div>

            {/* Box 2 */}
            <div className="bg-white rounded-academic border border-academic-border p-6 shadow-subtle hover:shadow-cardHover transition-all space-y-4">
              <div className="h-10 w-10 rounded-academic bg-academic-gold text-white flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-academic-navy">
                Courses & Eligibility Criteria
              </h3>
              <p className="text-xs text-academic-slate leading-relaxed">
                Clear prerequisites and syllabus breakdown so students know exactly if the course
                fits their background before initiating manual fee transfer.
              </p>
              <Link href="/courses" className="inline-block text-xs font-semibold text-academic-gold hover:underline">
                Course Catalog (Module 3) →
              </Link>
            </div>

            {/* Box 3 */}
            <div className="bg-white rounded-academic border border-academic-border p-6 shadow-subtle hover:shadow-cardHover transition-all space-y-4">
              <div className="h-10 w-10 rounded-academic bg-academic-navy text-academic-gold flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-academic-navy">
                Past Papers Vault
              </h3>
              <p className="text-xs text-academic-slate leading-relaxed">
                Direct PDF repository filtered by Exam Body (FBISE, BISE Lahore, Cambridge),
                year, and subject with fast search and instant viewing.
              </p>
              <Link href="/past-papers" className="inline-block text-xs font-semibold text-academic-gold hover:underline">
                Past Papers Vault (Module 3) →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
