'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Modal } from '@/components/ui/modal';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { VideoPreviewPlayer } from '@/components/teacher/video-preview-player';
import {
  TeacherCourseService,
  type FullCoursePayload,
} from '@/lib/services/teacher-course-service';
import {
  type SectionItemInput,
  type LessonItemInput,
  formatPKR,
} from '@professor-academy/shared';
import {
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Video,
  FileText,
  Eye,
  Layers,
  HelpCircle,
  Clock,
  Send,
  Loader2,
  Bot,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Medical / MDCAT',
  'Engineering / ECAT',
  'FSc Intermediate (Part 1 & 2)',
  'Civil Services / CSS & PMS',
  'Lecturership / PPSC & KPPSC',
  'Matric / Secondary Education',
  'General Academic & Skills',
];

const THUMBNAIL_PRESETS = [
  {
    label: 'MDCAT Physics Masterclass',
    tag: 'Medical Entrance & UHS Prep',
    url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'ECAT Advanced Engineering',
    tag: 'Engineering Math & Calculus',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Organic Chemistry Lab',
    tag: 'FSc Pre-Medical Part 1 & 2',
    url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Cambridge Biology & Genetics',
    tag: 'A-Level / NUMS Medical Test',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Civil Services / CSS & PMS',
    tag: 'Competitive Examinations',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
];

export default function NewCoursePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Wizard active step
  const [activeStep, setActiveStep] = React.useState<'meta' | 'curriculum' | 'review'>('meta');

  // Course Meta State
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [category, setCategory] = React.useState(CATEGORIES[0]);
  const [shortDescription, setShortDescription] = React.useState('');
  const [fullDescription, setFullDescription] = React.useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = React.useState('');
  const [pricePkr, setPricePkr] = React.useState<number>(4500);
  const [thumbnailUrl, setThumbnailUrl] = React.useState(
    'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80'
  );
  const [thumbnailTab, setThumbnailTab] = React.useState<'upload' | 'presets' | 'url'>('upload');
  const [thumbnailFileName, setThumbnailFileName] = React.useState<string | null>(null);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = React.useState(false);
  const thumbnailFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleThumbnailFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, or SVG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB.');
      return;
    }
    setThumbnailFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setThumbnailUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingThumbnail(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleThumbnailFileUpload(file);
    }
  };

  // Curriculum Sections State
  const [sections, setSections] = React.useState<SectionItemInput[]>([
    {
      title: 'Section 1: Conceptual Foundations & Terminology',
      sortOrder: 1,
      lessons: [
        {
          title: 'Lecture 1.1: Core Definitions & Formula Overview',
          lessonType: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoDurationSeconds: 1200,
          isFreePreview: true,
          contentHtml: '<p>Welcome to this foundational lecture. Review the formulas below before solving numerical examples.</p>',
          sortOrder: 1,
        },
        {
          title: 'Reading Note 1.2: High-Yield Exam Shortcut Sheet',
          lessonType: 'TEXT',
          videoUrl: '',
          videoDurationSeconds: 0,
          isFreePreview: false,
          contentHtml: '<h3>Important Takeaways</h3><p>Ensure you review past papers from 2018 to 2024 for recurrent questions on this specific theorem.</p>',
          sortOrder: 2,
        },
      ],
    },
  ]);

  // Selected Lesson for Active Editing
  const [selectedSectionIdx, setSelectedSectionIdx] = React.useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = React.useState(0);

  // Direct publish permission state
  const [canDirectPublish, setCanDirectPublish] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [createdResult, setCreatedResult] = React.useState<{ courseId: string; status: string; slug: string } | null>(null);

  // AI Co-Pilot Modal State
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [aiMode, setAiMode] = React.useState<'SYLLABUS' | 'MCQS' | 'POLISH'>('SYLLABUS');
  const [aiTopic, setAiTopic] = React.useState('');
  const [aiExamTarget, setAiExamTarget] = React.useState('MDCAT / UHS Medical Entrance Test');
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiGeneratedCurriculum, setAiGeneratedCurriculum] = React.useState<any | null>(null);
  const [aiGeneratedMCQs, setAiGeneratedMCQs] = React.useState<any[] | null>(null);

  // Auto-generate slug from title
  React.useEffect(() => {
    if (title && !slug) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }, [title]);

  // Check direct publish permissions
  React.useEffect(() => {
    if (user?.id) {
      TeacherCourseService.canTeacherDirectPublish(user.id).then((allowed) => {
        setCanDirectPublish(allowed);
      });
    }
  }, [user]);

  // 80/20 revenue calculation
  const teacherShare = Math.round(pricePkr * 0.8);
  const platformShare = pricePkr - teacherShare;

  // Active Lesson Pointer
  const activeSection = sections[selectedSectionIdx] || sections[0];
  const activeLesson = activeSection?.lessons[selectedLessonIdx] || activeSection?.lessons[0];

  // Helper to update active lesson
  const updateActiveLesson = (fields: Partial<LessonItemInput>) => {
    setSections((prev) => {
      const copy = [...prev];
      if (!copy[selectedSectionIdx]) return copy;
      const lessonCopy = [...copy[selectedSectionIdx].lessons];
      if (!lessonCopy[selectedLessonIdx]) return copy;
      lessonCopy[selectedLessonIdx] = {
        ...lessonCopy[selectedLessonIdx],
        ...fields,
      };
      copy[selectedSectionIdx] = {
        ...copy[selectedSectionIdx],
        lessons: lessonCopy,
      };
      return copy;
    });
  };

  // Add new section
  const handleAddSection = () => {
    const newSec: SectionItemInput = {
      title: `Section ${sections.length + 1}: New Curriculum Unit`,
      sortOrder: sections.length + 1,
      lessons: [
        {
          title: `Lecture ${sections.length + 1}.1: Introduction to Unit`,
          lessonType: 'VIDEO',
          videoUrl: '',
          videoDurationSeconds: 1500,
          isFreePreview: false,
          contentHtml: '<p>Comprehensive lecture notes and derivations.</p>',
          sortOrder: 1,
        },
      ],
    };
    setSections([...sections, newSec]);
    setSelectedSectionIdx(sections.length);
    setSelectedLessonIdx(0);
  };

  // Add lesson to active section
  const handleAddLesson = (type: 'VIDEO' | 'TEXT') => {
    setSections((prev) => {
      const copy = [...prev];
      if (!copy[selectedSectionIdx]) return copy;
      const currentLessons = copy[selectedSectionIdx].lessons || [];
      const newLesson: LessonItemInput = {
        title: `${type === 'VIDEO' ? 'Lecture' : 'Reading Note'} ${selectedSectionIdx + 1}.${currentLessons.length + 1}: New Topic`,
        lessonType: type,
        videoUrl: '',
        videoDurationSeconds: type === 'VIDEO' ? 1800 : 0,
        isFreePreview: false,
        contentHtml: '<p>Detailed concepts, derivations, and practice tips.</p>',
        sortOrder: currentLessons.length + 1,
      };
      copy[selectedSectionIdx] = {
        ...copy[selectedSectionIdx],
        lessons: [...currentLessons, newLesson],
      };
      return copy;
    });
    setSelectedLessonIdx(activeSection.lessons.length);
  };

  // Delete section
  const handleDeleteSection = (sIdx: number) => {
    if (sections.length <= 1) {
      alert('A course must have at least one curriculum section.');
      return;
    }
    const next = sections.filter((_, idx) => idx !== sIdx);
    setSections(next);
    setSelectedSectionIdx(0);
    setSelectedLessonIdx(0);
  };

  // Delete lesson
  const handleDeleteLesson = (sIdx: number, lIdx: number) => {
    setSections((prev) => {
      const copy = [...prev];
      if (!copy[sIdx]) return copy;
      if (copy[sIdx].lessons.length <= 1) {
        alert('Each section must have at least one lecture or reading note.');
        return copy;
      }
      copy[sIdx] = {
        ...copy[sIdx],
        lessons: copy[sIdx].lessons.filter((_, idx) => idx !== lIdx),
      };
      return copy;
    });
    setSelectedLessonIdx(0);
  };

  // Trigger Gemini AI Co-Pilot
  const handleRunAICoPilot = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic for the AI Co-Pilot.');
      return;
    }

    setAiLoading(true);
    setAiGeneratedCurriculum(null);
    setAiGeneratedMCQs(null);

    try {
      const res = await fetch('/api/ai/course-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: aiMode,
          topic: aiTopic,
          examTarget: aiExamTarget,
          itemCount: 5,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to call AI Co-Pilot');
      }

      if (aiMode === 'SYLLABUS') {
        setAiGeneratedCurriculum(data.data);
      } else if (aiMode === 'MCQS') {
        setAiGeneratedMCQs(data.data);
      }
    } catch (err: any) {
      alert('Error from AI Co-Pilot: ' + (err.message || 'Network error'));
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Curriculum to Course
  const handleApplyAICurriculum = () => {
    if (!aiGeneratedCurriculum) return;

    if (aiGeneratedCurriculum.suggestedShortDescription && !shortDescription) {
      setShortDescription(aiGeneratedCurriculum.suggestedShortDescription);
    }
    if (aiGeneratedCurriculum.recommendedEligibility && !eligibilityCriteria) {
      setEligibilityCriteria(aiGeneratedCurriculum.recommendedEligibility);
    }
    if (aiGeneratedCurriculum.sections && aiGeneratedCurriculum.sections.length > 0) {
      setSections(aiGeneratedCurriculum.sections);
      setSelectedSectionIdx(0);
      setSelectedLessonIdx(0);
    }

    setAiModalOpen(false);
  };

  // Insert AI MCQs into Active Lesson HTML
  const handleInsertAIMCQsIntoLesson = () => {
    if (!aiGeneratedMCQs || aiGeneratedMCQs.length === 0) return;

    let mcqHtml = `<h3>📝 High-Yield Practice MCQs (${aiTopic})</h3>`;
    aiGeneratedMCQs.forEach((m, idx) => {
      mcqHtml += `
        <div class="mcq-box" style="margin: 16px 0; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <p><strong>Q${idx + 1}: ${m.question}</strong></p>
          <ul style="list-style-type: none; padding-left: 0; margin: 8px 0;">
            <li><strong>A)</strong> ${m.options.A}</li>
            <li><strong>B)</strong> ${m.options.B}</li>
            <li><strong>C)</strong> ${m.options.C}</li>
            <li><strong>D)</strong> ${m.options.D}</li>
          </ul>
          <blockquote style="margin-top: 8px; border-left: 3px solid #10b981; padding-left: 10px; color: #047857; font-size: 13px;">
            <strong>Correct Answer: [Option ${m.correctOption}]</strong><br/>
            ${m.explanation}
          </blockquote>
        </div>
      `;
    });

    const currentHtml = activeLesson?.contentHtml || '';
    updateActiveLesson({ contentHtml: currentHtml + mcqHtml });
    setAiModalOpen(false);
  };

  // Save / Publish Course
  const handleSaveCourse = async (action: 'DRAFT' | 'SUBMIT_FOR_REVIEW' | 'DIRECT_PUBLISH') => {
    if (!title.trim()) {
      alert('Please enter a course title.');
      setActiveStep('meta');
      return;
    }
    if (!shortDescription.trim()) {
      alert('Please enter a short description.');
      setActiveStep('meta');
      return;
    }
    if (sections.length === 0) {
      alert('Please include at least one curriculum section.');
      setActiveStep('curriculum');
      return;
    }

    setIsSubmitting(true);

    const payload: FullCoursePayload = {
      course: {
        title,
        slug: slug || undefined,
        category,
        shortDescription,
        fullDescription: fullDescription || shortDescription,
        eligibilityCriteria: eligibilityCriteria || 'Recommended for Intermediate / Entry Test students.',
        pricePkr: Number(pricePkr),
        thumbnailUrl,
      },
      sections,
      publishAction: action,
    };

    try {
      const res = await TeacherCourseService.saveCourse(payload, user?.id || 'demo-teacher');
      setCreatedResult(res);
      setSuccessModalOpen(true);
    } catch (err: any) {
      alert('Failed to save course: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Top Sticky Header */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/teacher/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>

            <span className="h-4 w-px bg-slate-200 shrink-0" />

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {title ? title : 'Untitled Course Curriculum'}
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                {category} • {sections.length} Sections • {sections.reduce((acc, s) => acc + s.lessons.length, 0)} Lectures
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Assistant Pill */}
            <button
              onClick={() => {
                setAiTopic(title || 'MDCAT Physics Mechanics');
                setAiModalOpen(true);
              }}
              className="inline-flex flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-brand-indigo hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 text-brand-indigo shrink-0" />
              <span className="hidden sm:inline">Gemini AI Co-Pilot</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={() => handleSaveCourse('DRAFT')}
              disabled={isSubmitting}
              className="inline-flex flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="hidden md:inline">Save Draft</span>
            </button>

            {/* Publish or Submit for Review Button */}
            {canDirectPublish ? (
              <button
                onClick={() => handleSaveCourse('DIRECT_PUBLISH')}
                disabled={isSubmitting}
                className="inline-flex flex-row items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                )}
                <span>Direct Publish</span>
              </button>
            ) : (
              <button
                onClick={() => handleSaveCourse('SUBMIT_FOR_REVIEW')}
                disabled={isSubmitting}
                className="inline-flex flex-row items-center gap-2 px-5 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <Send className="h-4 w-4 shrink-0" />
                )}
                <span>Submit for Review</span>
              </button>
            )}
          </div>
        </header>

        {/* Step Navigation Tabs Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveStep('meta')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeStep === 'meta'
                  ? 'bg-brand-indigo text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1. Course Overview & Pricing
            </button>
            <button
              onClick={() => setActiveStep('curriculum')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeStep === 'curriculum'
                  ? 'bg-brand-indigo text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              2. Curriculum & Lesson Builder
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span>Commission: 80% Instructor / 20% Platform</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              {canDirectPublish ? (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Direct Publishing Active
                </span>
              ) : (
                <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Requires Admin Review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* ================= STEP 1: COURSE OVERVIEW & PRICING ================= */}
          {activeStep === 'meta' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form Details (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                  <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span>Course Metadata & Classification</span>
                    <span className="text-xs font-normal text-slate-400">Step 1 of 2</span>
                  </h2>

                  <FormField label="Course Title" required hint="e.g. MDCAT Physics Masterclass: 2026 High-Yield Prep & Past Paper Shortcuts">
                    <Input
                      placeholder="Course title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Academic Category" required>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="URL Slug" hint="Auto-generated URL identifier">
                      <Input
                        placeholder="e.g. mdcat-physics-masterclass"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Short Marketing Summary"
                    required
                    hint="A concise 1-2 sentence hook for course cards and Google search snippets"
                  >
                    <textarea
                      rows={2}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Comprehensive video masterclass covering all 2026 syllabus derivations, numerical problem shortcuts, and chapter-wise MCQs..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                    />
                  </FormField>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Full Course Syllabus & Detailed Overview
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAiTopic(title || 'MDCAT / ECAT Comprehensive Course');
                          setAiMode('SYLLABUS');
                          setAiModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:text-brand-indigoHover transition-colors cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Draft Syllabus with Gemini AI</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Explain in detail what students will learn, lecture schedules, past-paper breakdown, and insert high-yield formulas or diagrams.
                    </p>
                    <RichTextEditor
                      content={fullDescription}
                      onChange={setFullDescription}
                      placeholder="Detail the complete course syllabus, lecture schedule, exam breakdown, and recommended reference books..."
                      onOpenAiAssistant={() => {
                        setAiTopic(title || 'MDCAT / ECAT Comprehensive Course');
                        setAiMode('SYLLABUS');
                        setAiModalOpen(true);
                      }}
                    />
                  </div>
                </div>

                {/* Eligibility Criteria ("Is this course right for me?") */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-brand-indigo" />
                        <span>Eligibility Criteria (&quot;Is this course right for me?&quot;)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Clarify prerequisites so only qualified students enroll. Reduces refund requests and fee disputes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setEligibilityCriteria(
                          `• Target: Students appearing in MDCAT 2026 or FSc Pre-Medical Part-2.\n• Prerequisites: Basic comprehension of high-school algebra, trigonometry, and units.\n• Who should NOT enroll: Students looking for general science or non-medical syllabus.`
                        )
                      }
                      className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                    >
                      Insert Template
                    </button>
                  </div>

                  <FormField label="Prerequisites & Target Student Profile" required>
                    <textarea
                      rows={4}
                      value={eligibilityCriteria}
                      onChange={(e) => setEligibilityCriteria(e.target.value)}
                      placeholder="• Recommended for FSc Part 1 & 2 students aiming for UHS / NUMS / PMC entrance tests.&#10;• Requires understanding of basic vectors and kinematics formulas."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                    />
                  </FormField>
                </div>
              </div>

              {/* Right Column: Pricing & Cover Photo (1 Col) */}
              <div className="space-y-6">
                {/* 80/20 Revenue Split Calculator Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span>Course Fee (PKR)</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      80% Faculty Share
                    </span>
                  </h3>

                  <FormField label="Total Student Fee (PKR)" required hint="Set 0 for a free community course">
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">PKR</span>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        value={pricePkr}
                        onChange={(e) => setPricePkr(Number(e.target.value))}
                        className="pl-12 font-mono font-bold text-slate-900"
                        required
                      />
                    </div>
                  </FormField>

                  {/* Revenue Distribution Breakdown */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Per-Enrollment Payout Breakdown
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Your Net Earnings (80%):</span>
                      <span className="font-bold font-mono text-emerald-700 text-sm">
                        {formatPKR(teacherShare)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Platform Maintenance (20%):</span>
                      <span className="font-bold font-mono text-slate-500 text-xs">
                        {formatPKR(platformShare)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400">
                      Payouts are automatically logged in PKR upon Admin verification of the student&apos;s bank / JazzCash receipt.
                    </div>
                  </div>
                </div>

                {/* Course Cover / Thumbnail Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-brand-indigo" />
                      <span>Course Thumbnail Banner</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      16:9 Standard
                    </span>
                  </div>

                  {/* 16:9 Live Preview Display */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() =>
                        setThumbnailUrl(
                          'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80'
                        )
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                      Live Student Card Preview
                    </div>
                    {thumbnailFileName && (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-800 truncate shadow-xs flex items-center justify-between">
                        <span className="truncate">📎 {thumbnailFileName}</span>
                        <span className="text-[10px] text-emerald-600 font-bold shrink-0 ml-2">Ready</span>
                      </div>
                    )}
                  </div>

                  {/* Mode Navigation Tabs */}
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setThumbnailTab('upload')}
                      className={cn(
                        'flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                        thumbnailTab === 'upload'
                          ? 'bg-white text-brand-indigo shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailTab('presets')}
                      className={cn(
                        'flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                        thumbnailTab === 'presets'
                          ? 'bg-white text-brand-indigo shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Presets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailTab('url')}
                      className={cn(
                        'flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                        thumbnailTab === 'url'
                          ? 'bg-white text-brand-indigo shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>Direct URL</span>
                    </button>
                  </div>

                  {/* TAB 1: FILE UPLOAD (DRAG & DROP / DEVICE BROWSE) */}
                  {thumbnailTab === 'upload' && (
                    <div className="space-y-3">
                      <input
                        ref={thumbnailFileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleThumbnailFileUpload(file);
                        }}
                      />

                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingThumbnail(true);
                        }}
                        onDragLeave={() => setIsDraggingThumbnail(false)}
                        onDrop={handleThumbnailDrop}
                        onClick={() => thumbnailFileInputRef.current?.click()}
                        className={cn(
                          'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 bg-slate-50/70',
                          isDraggingThumbnail
                            ? 'border-brand-indigo bg-indigo-50/50 scale-[1.01]'
                            : 'border-slate-300 hover:border-brand-indigo/60 hover:bg-slate-50'
                        )}
                      >
                        <div className="p-3 bg-brand-indigo/10 rounded-full text-brand-indigo">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-brand-indigo hover:underline">
                            Click to upload image
                          </span>{' '}
                          <span className="text-slate-600">or drag and drop here</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          PNG, JPG, or WebP (max 10MB). High resolution (1280x720 recommended).
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => thumbnailFileInputRef.current?.click()}
                          className="font-bold text-brand-indigo hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Choose file from device</span>
                        </button>
                        {thumbnailFileName && (
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnailFileName(null);
                              setThumbnailUrl(
                                'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80'
                              );
                            }}
                            className="font-semibold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reset to default</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CURATED ACADEMIC PRESETS */}
                  {thumbnailTab === 'presets' && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">
                        Choose a high-definition academic cover from our curated Pakistani syllabus library:
                      </p>
                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                        {THUMBNAIL_PRESETS.map((preset) => {
                          const isSelected = thumbnailUrl === preset.url;
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                setThumbnailUrl(preset.url);
                                setThumbnailFileName(preset.label);
                              }}
                              className={cn(
                                'flex items-center gap-3 p-2 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden',
                                isSelected
                                  ? 'border-brand-indigo bg-indigo-50/70 ring-2 ring-brand-indigo/20'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              )}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                className="w-14 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {preset.label}
                                </p>
                                <span className="text-[10px] text-slate-500 block truncate">
                                  {preset.tag}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="p-1 bg-brand-indigo text-white rounded-full shrink-0">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DIRECT WEB URL */}
                  {thumbnailTab === 'url' && (
                    <FormField
                      label="Direct Image URL"
                      hint="Paste an HTTPS link from Unsplash, Cloudinary, AWS S3, or your web server"
                    >
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        value={thumbnailUrl}
                        onChange={(e) => {
                          setThumbnailUrl(e.target.value);
                          setThumbnailFileName(null);
                        }}
                      />
                    </FormField>
                  )}
                </div>

                {/* Next Step Button */}
                <button
                  type="button"
                  onClick={() => setActiveStep('curriculum')}
                  className="w-full py-3 px-5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Curriculum Builder</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CURRICULUM & LESSON BUILDER ================= */}
          {activeStep === 'curriculum' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar: Sections & Lectures Tree (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-brand-indigo" />
                      <span>Curriculum Outline</span>
                    </h3>

                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-brand-indigo hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  {/* Section List Accordions */}
                  <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                    {sections.map((sec, sIdx) => {
                      const isSecActive = selectedSectionIdx === sIdx;
                      return (
                        <div
                          key={sIdx}
                          className={`rounded-xl border transition-all ${
                            isSecActive
                              ? 'border-brand-indigo/60 bg-indigo-50/20'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          {/* Section Header */}
                          <div className="p-3 flex items-center justify-between gap-2 border-b border-slate-100">
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSections((prev) => {
                                  const copy = [...prev];
                                  copy[sIdx].title = val;
                                  return copy;
                                });
                              }}
                              className="font-bold text-xs text-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-indigo rounded px-1 flex-1 min-w-0"
                            />

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(sIdx)}
                                title="Delete Section"
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Lessons inside Section */}
                          <div className="p-1.5 space-y-1">
                            {sec.lessons.map((les, lIdx) => {
                              const isLesActive =
                                selectedSectionIdx === sIdx && selectedLessonIdx === lIdx;
                              return (
                                <button
                                  key={lIdx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSectionIdx(sIdx);
                                    setSelectedLessonIdx(lIdx);
                                  }}
                                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-2 text-xs transition-all cursor-pointer ${
                                    isLesActive
                                      ? 'bg-brand-indigo text-white font-bold shadow-xs'
                                      : 'hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {les.lessonType === 'VIDEO' ? (
                                      <Video className="h-3.5 w-3.5 shrink-0" />
                                    ) : (
                                      <FileText className="h-3.5 w-3.5 shrink-0" />
                                    )}
                                    <span className="truncate">{les.title}</span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {les.isFreePreview && (
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                          isLesActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                      >
                                        FREE
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}

                            {/* Add Lesson to this section button */}
                            <div className="pt-1.5 flex items-center gap-1.5 justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSectionIdx(sIdx);
                                  handleAddLesson('VIDEO');
                                }}
                                className="text-[11px] font-semibold text-brand-indigo hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>+ Video Lecture</span>
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSectionIdx(sIdx);
                                  handleAddLesson('TEXT');
                                }}
                                className="text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>+ Reading Note</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Outline Quick Suggestion Button */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-brand-indigo font-bold">
                    <Sparkles className="h-4 w-4" />
                    <span>Gemini AI Curriculum Assistant</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Don&apos;t want to enter every lecture manually? Type your topic and exam target to automatically generate a standard curriculum structure with one click.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAiTopic(title || 'Thermodynamics & Heat Transfer');
                      setAiMode('SYLLABUS');
                      setAiModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-brand-indigo text-white font-bold text-xs hover:bg-brand-indigoHover transition-colors cursor-pointer shadow-xs"
                  >
                    ✨ Auto-Generate Outline with AI
                  </button>
                </div>
              </div>

              {/* Right Column: Active Lesson Detailed Editor (8 Cols) */}
              <div className="lg:col-span-8 space-y-5">
                {activeLesson ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                    {/* Header of Active Lesson */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
                          Editing {activeLesson.lessonType === 'VIDEO' ? 'Video Lecture' : 'Reading Article'}
                        </span>
                        <input
                          type="text"
                          value={activeLesson.title}
                          onChange={(e) => updateActiveLesson({ title: e.target.value })}
                          className="font-bold text-lg sm:text-xl text-slate-900 w-full focus:outline-none focus:ring-1 focus:ring-brand-indigo rounded px-1 mt-0.5"
                          placeholder="Lecture Title..."
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Free Preview Toggle */}
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeLesson.isFreePreview}
                            onChange={(e) =>
                              updateActiveLesson({ isFreePreview: e.target.checked })
                            }
                            className="rounded text-brand-indigo focus:ring-brand-indigo"
                          />
                          <span>Free Sample Preview</span>
                        </label>

                        {/* Delete this lesson */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteLesson(selectedSectionIdx, selectedLessonIdx)
                          }
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Lesson"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Type Tabs: VIDEO or TEXT */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <button
                        type="button"
                        onClick={() => updateActiveLesson({ lessonType: 'VIDEO' })}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeLesson.lessonType === 'VIDEO'
                            ? 'bg-brand-indigo text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Video Lecture</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateActiveLesson({ lessonType: 'TEXT' })}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeLesson.lessonType === 'TEXT'
                            ? 'bg-brand-indigo text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Written Article / Formula Notes</span>
                      </button>
                    </div>

                    {/* IF VIDEO LESSON: Show Video URL & Embedded Player */}
                    {activeLesson.lessonType === 'VIDEO' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <FormField
                              label="Video Stream URL (YouTube Unlisted / MP4)"
                              required
                              hint="Paste your unlisted YouTube link (100% free unlimited video hosting)"
                            >
                              <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={activeLesson.videoUrl || ''}
                                onChange={(e) =>
                                  updateActiveLesson({ videoUrl: e.target.value })
                                }
                              />
                            </FormField>
                          </div>

                          <div>
                            <FormField
                              label="Duration (Seconds)"
                              hint="e.g. 1800 for 30 minutes"
                            >
                              <Input
                                type="number"
                                min={0}
                                step={60}
                                value={activeLesson.videoDurationSeconds || 0}
                                onChange={(e) =>
                                  updateActiveLesson({
                                    videoDurationSeconds: Number(e.target.value),
                                  })
                                }
                              />
                            </FormField>
                          </div>
                        </div>

                        {/* Live Player Preview */}
                        <div>
                          <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5 text-brand-indigo" />
                            <span>Student Video Player Embed Preview</span>
                          </p>
                          <VideoPreviewPlayer
                            url={activeLesson.videoUrl}
                            title={activeLesson.title}
                            durationSeconds={activeLesson.videoDurationSeconds}
                          />
                        </div>
                      </div>
                    )}

                    {/* TIPTAP RICH TEXT EDITOR: Available for both Video summary and Text Notes */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          {activeLesson.lessonType === 'VIDEO'
                            ? 'Supplementary Lecture Notes, Derivations & Formulas'
                            : 'Full Written Lecture Notes & Article Content'}
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setAiTopic(activeLesson.title);
                            setAiMode('MCQS');
                            setAiModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Generate 5 Practice MCQs with AI</span>
                        </button>
                      </div>

                      <RichTextEditor
                        content={activeLesson.contentHtml || ''}
                        onChange={(html) => updateActiveLesson({ contentHtml: html })}
                        onOpenAiAssistant={() => {
                          setAiTopic(activeLesson.title);
                          setAiMode('MCQS');
                          setAiModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                    Select a lecture from the left outline to edit.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* ================= MODAL: GEMINI AI TEACHING CO-PILOT ================= */}
        <Modal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="Google Gemini AI Teaching Co-Pilot"
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* AI Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAiMode('SYLLABUS')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  aiMode === 'SYLLABUS'
                    ? 'border-brand-indigo bg-indigo-50/70 text-brand-indigo font-bold ring-1 ring-brand-indigo'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Layers className="h-4 w-4 mb-1" />
                <div className="text-xs font-bold">1. Curriculum Builder</div>
                <div className="text-[10px] text-slate-500 font-normal">Generate 4 sections with lectures</div>
              </button>

              <button
                type="button"
                onClick={() => setAiMode('MCQS')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  aiMode === 'MCQS'
                    ? 'border-brand-indigo bg-indigo-50/70 text-brand-indigo font-bold ring-1 ring-brand-indigo'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HelpCircle className="h-4 w-4 mb-1" />
                <div className="text-xs font-bold">2. Exam MCQs Generator</div>
                <div className="text-[10px] text-slate-500 font-normal">5 high-yield MCQs with rationale</div>
              </button>

              <button
                type="button"
                onClick={() => setAiMode('POLISH')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  aiMode === 'POLISH'
                    ? 'border-brand-indigo bg-indigo-50/70 text-brand-indigo font-bold ring-1 ring-brand-indigo'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Sparkles className="h-4 w-4 mb-1" />
                <div className="text-xs font-bold">3. Note Polisher</div>
                <div className="text-[10px] text-slate-500 font-normal">Format with academic tips</div>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <FormField label="Academic Subject / Topic" required>
                <Input
                  placeholder="e.g. Thermodynamics, Circular Motion, English Grammar for KPPSC..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                />
              </FormField>

              <FormField label="Target Pakistani Examination Board">
                <select
                  value={aiExamTarget}
                  onChange={(e) => setAiExamTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                >
                  <option value="MDCAT / UHS Medical Entrance Test">MDCAT / UHS Medical Entrance Test</option>
                  <option value="ECAT / UET Engineering Entrance Exam">ECAT / UET Engineering Entrance Exam</option>
                  <option value="FSc Intermediate (FBISE / BISE Punjab)">FSc Intermediate (FBISE / BISE Punjab)</option>
                  <option value="KPPSC / PPSC Subject Specialist & Lecturer">KPPSC / PPSC Subject Specialist & Lecturer</option>
                  <option value="CSS / PMS Competitive Examination">CSS / PMS Competitive Examination</option>
                </select>
              </FormField>

              <button
                type="button"
                onClick={handleRunAICoPilot}
                disabled={aiLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Gemini is generating structured academic content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Content with Gemini AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Results Preview */}
            {aiGeneratedCurriculum && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">
                    Generated Curriculum ({aiGeneratedCurriculum.sections?.length || 0} Sections)
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Ready to Apply
                  </span>
                </div>

                <div className="space-y-2">
                  {aiGeneratedCurriculum.sections?.map((s: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                      <p className="font-bold text-slate-800">{s.title}</p>
                      <ul className="list-disc list-inside text-slate-500 mt-1 pl-1 text-[11px]">
                        {s.lessons?.map((l: any, lIdx: number) => (
                          <li key={lIdx}>{l.title}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleApplyAICurriculum}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    ✓ Apply This Curriculum to Course
                  </button>
                </div>
              </div>
            )}

            {aiGeneratedMCQs && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">
                    Generated Practice MCQs ({aiGeneratedMCQs.length})
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    5 High-Yield Questions
                  </span>
                </div>

                <div className="space-y-2.5">
                  {aiGeneratedMCQs.map((m: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                      <p className="font-bold text-slate-800">
                        Q{idx + 1}: {m.question}
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        Correct: <strong>Option {m.correctOption}</strong> — {m.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleInsertAIMCQsIntoLesson}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    ✓ Insert MCQs into Current Lecture Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* ================= MODAL: COURSE CREATED SUCCESS ================= */}
        <Modal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          title={
            createdResult?.status === 'PUBLISHED'
              ? '🎉 Course Published Successfully!'
              : '📤 Course Submitted for Review'
          }
          maxWidth="md"
        >
          <div className="space-y-4 text-center p-2">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="font-bold text-base text-slate-900">
              {createdResult?.status === 'PUBLISHED'
                ? 'Your course is now live in the Public Academy Catalog!'
                : 'Your curriculum has been queued for Administrator verification.'}
            </h3>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {createdResult?.status === 'PUBLISHED'
                ? 'Students can now browse the curriculum, watch free sample lectures, and enroll via JazzCash / Bank transfer.'
                : 'Since direct publishing requires executive clearance, your syllabus will be reviewed in the Admin Course Approvals Queue.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/teacher/dashboard')}
                className="w-full sm:w-auto"
              >
                Go to Teacher Dashboard
              </Button>

              {createdResult?.slug && (
                <Link href={`/courses/${createdResult.slug}`} className="w-full sm:w-auto">
                  <Button variant="primary" size="md" className="w-full sm:w-auto font-bold">
                    <span>View Public Page</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </RoleGuard>
  );
}
