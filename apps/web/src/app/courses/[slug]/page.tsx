'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { MOCK_COURSES, type CourseData } from '@/lib/data/courses-data';
import {
  Star,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Globe,
  Share2,
  Heart,
  PlayCircle,
  FileText,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Users,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const course = React.useMemo(() => {
    return MOCK_COURSES.find((c) => c.slug === slug) || MOCK_COURSES[0];
  }, [slug]);

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    [course?.sections[0]?.id || 'sec-1']: true,
  });

  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = React.useState<{
    title: string;
    durationMinutes: number;
    videoUrl?: string;
  } | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const openPreview = (lesson?: { title: string; durationMinutes: number; videoUrl?: string }) => {
    if (lesson) {
      setActivePreviewLesson(lesson);
    } else {
      // Find first free preview lesson or default
      const firstPreview = course.sections
        .flatMap((s) => s.lessons)
        .find((l) => l.isFreePreview);
      setActivePreviewLesson(
        firstPreview || {
          title: 'Course Introduction & Syllabus Roadmap',
          durationMinutes: 15,
          videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        }
      );
    }
    setPreviewModalOpen(true);
  };

  const discountPercentage = course.originalPricePkr
    ? Math.round(((course.originalPricePkr - course.pricePkr) / course.originalPricePkr) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Dark Hero Section */}
        <section className="bg-slate-900 text-white border-b border-slate-800 pt-8 pb-12 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-white transition-colors">
                Courses
              </Link>
              <span>/</span>
              <span className="text-slate-300">{course.category}</span>
              <span>/</span>
              <span className="text-indigo-300 truncate max-w-xs">{course.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="indigo" size="sm">
                    {course.category}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {course.level}
                  </Badge>
                  {course.badgeText && (
                    <Badge variant={course.badgeVariant || 'gold'} size="sm">
                      {course.badgeText}
                    </Badge>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    Board: <strong className="text-slate-200">{course.examBoard}</strong>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {course.subtitle}
                </p>

                {/* Ratings & Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <span className="font-bold text-sm text-white">{course.rating}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-slate-400 underline ml-1">
                      ({course.ratingCount.toLocaleString()} ratings)
                    </span>
                  </div>

                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">
                    <strong>{course.instructor.studentsCount.toLocaleString()}</strong> students enrolled
                  </span>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center gap-3 pt-2 text-xs">
                  <img
                    src={course.instructor.avatarUrl}
                    alt={course.instructor.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <p className="text-slate-300">
                      Created by{' '}
                      <span className="font-semibold text-white underline hover:text-indigo-300 cursor-pointer">
                        {course.instructor.name}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">{course.instructor.designation}</p>
                  </div>
                </div>

                {/* Key specs */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{course.durationHours} total hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{course.lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{course.language}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>Certificate Included</span>
                  </div>
                </div>
              </div>

              {/* Right Column Spacer for desktop layout alignment */}
              <div className="hidden lg:block lg:col-span-1" />
            </div>
          </div>
        </section>

        {/* Content Layout: Left Body + Right Sticky Card */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Main Body (2 Columns) */}
            <div className="lg:col-span-2 space-y-10">
              {/* 1. What You'll Learn Box */}
              <div className="border border-slate-200/90 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>What you&apos;ll learn in this course</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. DEDICATED ELIGIBILITY CRITERIA SECTION (PRD Mandate) */}
              <div className="border-2 border-indigo-200/80 rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-indigo-50/60 via-white to-amber-50/30 space-y-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-brand-indigo text-xs font-bold uppercase tracking-wider">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Academic Eligibility & Prerequisites</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Is this course right for you?
                    </h2>
                    <p className="text-xs text-slate-600">
                      We uphold strict syllabus alignment. Review the academic qualifications below before
                      enrolling.
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Min Qualification */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-1.5 shadow-xs">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Award className="h-4 w-4 text-brand-indigo" />
                      <span>Minimum Required Qualification</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {course.eligibilityRequirements.minQualification}
                    </p>
                  </div>

                  {/* Recommended Background */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-1.5 shadow-xs">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      <span>Recommended Foundation</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {course.eligibilityRequirements.recommendedBackground}
                    </p>
                  </div>
                </div>

                {/* Target Students Checklist */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Target Aspirants & Ideal Candidates:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {course.eligibilityRequirements.targetStudents.map((target, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo mt-1.5 shrink-0" />
                        <span className="font-medium">{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-800">Required Study Materials:</span>
                    <p>{course.eligibilityRequirements.prerequisites.join(' • ')}</p>
                  </div>
                </div>
              </div>

              {/* 3. Course Curriculum & Syllabus Accordion */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Course Curriculum & Lectures</h2>
                    <p className="text-xs text-slate-500">
                      {course.sections.length} sections • {course.lessonsCount} lectures •{' '}
                      {course.durationHours} hours total length
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allExpanded = Object.keys(expandedSections).length === course.sections.length;
                      if (allExpanded) {
                        setExpandedSections({});
                      } else {
                        const newExpanded: Record<string, boolean> = {};
                        course.sections.forEach((s) => (newExpanded[s.id] = true));
                        setExpandedSections(newExpanded);
                      }
                    }}
                  >
                    Toggle all sections
                  </Button>
                </div>

                {/* Sections List */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                  {course.sections.map((section) => {
                    const isExpanded = !!expandedSections[section.id];
                    return (
                      <div key={section.id} className="bg-white">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            )}
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {section.title}
                            </span>
                          </div>

                          <span className="text-xs text-slate-500 font-mono">
                            {section.lessons.length} lectures
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="divide-y divide-slate-100 px-5 py-2">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="py-2.5 flex items-center justify-between text-xs text-slate-700 hover:text-slate-900"
                              >
                                <div className="flex items-center gap-2.5">
                                  <PlayCircle className="h-4 w-4 text-slate-400" />
                                  <span className="font-medium">{lesson.title}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {lesson.isFreePreview && (
                                    <button
                                      onClick={() => openPreview(lesson)}
                                      className="text-xs font-bold text-brand-indigo hover:text-brand-indigoHover underline"
                                    >
                                      Preview
                                    </button>
                                  )}
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    {lesson.durationMinutes} min
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Instructor Bio Card */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-4 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">Your Lead Instructor</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={course.instructor.avatarUrl}
                    alt={course.instructor.name}
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-50"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <span>{course.instructor.name}</span>
                      <ShieldCheck className="h-4 w-4 text-brand-indigo" />
                    </h3>
                    <p className="text-xs text-slate-500">{course.instructor.designation}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {course.instructor.rating} Instructor Rating
                      </span>
                      <span>•</span>
                      <span>
                        <strong>{course.instructor.studentsCount.toLocaleString()}</strong> Students
                      </span>
                      <span>•</span>
                      <span>
                        <strong>{course.instructor.coursesCount}</strong> Courses
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {course.instructor.bio}
                </p>
              </div>

              {/* 5. FAQs Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-brand-indigo" />
                  <span>Frequently Asked Questions</span>
                </h2>

                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
                  {course.faqs.map((faq, idx) => (
                    <div key={idx} className="p-5 bg-white space-y-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{faq.question}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Card (1 Column) */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-lg space-y-5 p-5">
                {/* Video Preview Thumbnail with Play Button */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 group cursor-pointer">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <button
                    onClick={() => openPreview()}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2 group-hover:scale-105 transition-transform"
                  >
                    <div className="h-12 w-12 rounded-full bg-brand-indigo text-white flex items-center justify-center shadow-lg group-hover:bg-brand-indigoHover transition-colors">
                      <PlayCircle className="h-6 w-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold tracking-wide drop-shadow-md">
                      Preview Free Lessons
                    </span>
                  </button>
                </div>

                {/* Price Display */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono font-bold text-3xl text-slate-900 tracking-tight">
                      {course.pricePkr === 0 ? 'FREE' : `PKR ${course.pricePkr.toLocaleString()}`}
                    </span>
                    {course.originalPricePkr > 0 && course.pricePkr > 0 && (
                      <span className="font-mono text-sm text-slate-400 line-through">
                        PKR {course.originalPricePkr.toLocaleString()}
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {discountPercentage}% off
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-700 font-medium">
                    🔥 Special 2026 Batch pricing ending soon
                  </p>
                </div>

                {/* Enroll CTA */}
                <div className="space-y-2.5">
                  <Link href={`/login?redirect=/student/dashboard`}>
                    <Button variant="primary" size="lg" className="w-full text-sm font-bold shadow-md">
                      Enroll in Course Now
                    </Button>
                  </Link>

                  <p className="text-center text-[11px] text-slate-500">
                    30-Day Money-Back Guarantee • Instant Access
                  </p>
                </div>

                {/* Local Payment Badges */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-700">
                    Pay securely via Pakistani payment accounts:
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                      Meezan Bank
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                      JazzCash
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                      Easypaisa
                    </span>
                  </div>
                </div>

                {/* Course Inclusions List */}
                <div className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    This course includes:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{course.durationHours} hours on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>15 downloadable chapter past paper guides</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-brand-indigo" />
                      <span>1-on-1 AI Tutor problem solver assistance</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="h-4 w-4 text-slate-400" />
                      <span>Access on Web & Mobile (Expo App)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Official Certificate of Completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Free Video Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={activePreviewLesson?.title || 'Free Lecture Preview'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
            <iframe
              src={activePreviewLesson?.videoUrl || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'}
              title="Lecture Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              Duration: {activePreviewLesson?.durationMinutes} minutes
            </span>
            <span className="text-emerald-600 font-semibold">Free Sample Video</span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-bold text-xs text-slate-900">
                Ready to master the full syllabus with {course.instructor.name}?
              </p>
              <p className="text-[11px] text-slate-600">
                Unlock all {course.lessonsCount} lectures, past papers, quizzes, and certificates.
              </p>
            </div>
            <Link href={`/login?redirect=/student/dashboard`}>
              <Button variant="primary" size="sm">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
