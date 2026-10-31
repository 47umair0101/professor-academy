import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/ui/course-card';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Video,
  FileText,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const featuredCourses = [
    {
      id: 'c-1',
      slug: 'mdcat-physics-masterclass',
      title: 'MDCAT Physics: Complete High-Yield Prep & Past Paper Shortcuts (2026)',
      instructor: 'Prof. Dr. Arshad Mahmood',
      thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      ratingCount: 4210,
      pricePkr: 4500,
      originalPricePkr: 8000,
      badgeText: 'Bestseller',
      badgeVariant: 'gold' as const,
      category: 'MDCAT Prep',
      eligibilitySnippet: '🎯 FSc Pre-Medical 65%+ or A-Level Physics passed',
    },
    {
      id: 'c-2',
      slug: 'fsc-chemistry-part-1',
      title: 'FSc Pre-Medical Chemistry Part-1: Organic & Inorganic Concepts',
      instructor: 'Dr. Fatima Tariq',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      ratingCount: 1890,
      pricePkr: 3800,
      originalPricePkr: 6000,
      badgeText: 'Top Rated',
      badgeVariant: 'gold' as const,
      category: 'FSc Part-I',
      eligibilitySnippet: '🎯 Matric Science with Chemistry (60%+)',
    },
    {
      id: 'c-3',
      slug: 'ecat-net-advanced-math',
      title: 'ECAT & NUST (NET) Advanced Mathematics: Speed Tricks & Problem Sets',
      instructor: 'Engr. Usman Qureshi',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      ratingCount: 2340,
      pricePkr: 4200,
      originalPricePkr: 7500,
      badgeText: 'Popular',
      badgeVariant: 'indigo' as const,
      category: 'Engineering Prep',
      eligibilitySnippet: '🎯 FSc Pre-Engineering / ICS Math student',
    },
    {
      id: 'c-4',
      slug: 'cambridge-a-level-biology',
      title: 'Cambridge International A-Level Biology (Paper 4 & 5 Special Prep)',
      instructor: 'Amina Rehman (Cambridge Certified)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      ratingCount: 980,
      pricePkr: 6500,
      originalPricePkr: 11000,
      badgeText: 'Certified',
      badgeVariant: 'indigo' as const,
      category: 'Cambridge A-Level',
      eligibilitySnippet: '🎯 O-Level / IGCSE Biology Grade B or above',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white to-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-700 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Session 2026 Admissions Open</span>
                <span className="text-indigo-400">•</span>
                <span className="font-semibold">FBISE & Entrance Exams</span>
              </div>

              <h1 className="font-bold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-[1.15]">
                Master Your Board & Entrance Exams with Proven Faculty.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Structured video courses, high-yield notes, past paper vaults with marking schemes,
                and dedicated eligibility guidance for Matric, FSc, O/A-Levels, MDCAT, and ECAT students.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/courses">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/design-preview">
                  <Button variant="secondary" size="lg">
                    Preview Design System (/design-preview)
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 border-t border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">100% Verified Faculty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">FBISE & Board Mapped</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Direct JazzCash / Bank Pay</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">98.4% Board Pass Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills Bar */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-900 text-white whitespace-nowrap shadow-sm">
              All Programs
            </button>
            <button className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors">
              MDCAT Prep (2026)
            </button>
            <button className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors">
              ECAT & NUST (NET)
            </button>
            <button className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors">
              FSc Pre-Medical
            </button>
            <button className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors">
              FSc Pre-Engineering
            </button>
            <button className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors">
              Past Papers Vault
            </button>
          </div>
        </section>

        {/* Featured Courses Grid */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Recommended by Academic Counselors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Handcrafted courses with clear eligibility requirements so you pick exactly what fits your board.
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand-indigo hover:underline"
            >
              <span>Explore all courses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>

        {/* Key Features Banner (Distinctly Better Than Legacy LMS) */}
        <section className="bg-slate-50 border-t border-b border-slate-200/80 py-14">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-subtle space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">
                Multi-Format Curriculum
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                HD video lectures paired with comprehensive rich-text reading notes, formulas,
                and chapter summaries.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-subtle space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">
                Past Papers Vault
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by Exam Body (FBISE, BISE Lahore, Cambridge), year, and subject with instant
                PDF preview and downloads.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-subtle space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">
                Transparent Local Verification
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No credit card required. Transfer fee via JazzCash, Easypaisa, or any Pakistani Bank
                with quick manual admin verification.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
