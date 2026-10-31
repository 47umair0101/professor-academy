'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  LessonService,
  type CourseSectionWithLessons,
  type CourseLesson,
  type LessonComment,
} from '@/lib/services/lesson-service';
import { CertificateService, type CertificateData } from '@/lib/services/certificate-service';
import { EnrollmentService } from '@/lib/services/enrollment-service';
import { AcademicCertificate } from '@/components/certificate/academic-certificate';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
  Play,
  PlayCircle,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Sparkles,
  Award,
  Send,
  Loader2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Search,
  ExternalLink,
  ThumbsUp,
  Trash2,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CourseLearningPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const { user } = useAuth();

  // Course & Curriculum State
  const [loading, setLoading] = React.useState(true);
  const [course, setCourse] = React.useState<any>(null);
  const [sections, setSections] = React.useState<CourseSectionWithLessons[]>([]);
  const [activeLesson, setActiveLesson] = React.useState<CourseLesson | null>(null);
  const [progressPercentage, setProgressPercentage] = React.useState(0);
  const [completedCount, setCompletedCount] = React.useState(0);
  const [totalLessons, setTotalLessons] = React.useState(0);

  // Tabs & Sidebar
  const [activeTab, setActiveTab] = React.useState<'notes' | 'discussion' | 'resources'>('notes');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  // Comments State
  const [comments, setComments] = React.useState<LessonComment[]>([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [newCommentText, setNewCommentText] = React.useState('');
  const [submittingComment, setSubmittingComment] = React.useState(false);
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState('');

  // AI Study Tutor Drawer State
  const [aiDrawerOpen, setAiDrawerOpen] = React.useState(false);
  const [tutorMessages, setTutorMessages] = React.useState<
    Array<{ sender: 'student' | 'tutor'; text: string; followUps?: string[] }>
  >([]);
  const [tutorInput, setTutorInput] = React.useState('');
  const [tutorLoading, setTutorLoading] = React.useState(false);

  // Certificate Modal State
  const [certificateModalOpen, setCertificateModalOpen] = React.useState(false);
  const [certificateData, setCertificateData] = React.useState<CertificateData | null>(null);
  const [claimingCertificate, setClaimingCertificate] = React.useState(false);

  // 1. Load Curriculum on Mount
  const loadCurriculum = React.useCallback(async () => {
    setLoading(true);
    const data = await LessonService.getCourseCurriculum(slug, user?.id);
    setCourse(data.course);
    setSections(data.sections);
    setProgressPercentage(data.progressPercentage);
    setCompletedCount(data.completedLessonsCount);
    setTotalLessons(data.totalLessons);

    // Default expand all sections
    const initialExpanded: Record<string, boolean> = {};
    data.sections.forEach((s) => {
      initialExpanded[s.id] = true;
    });
    setExpandedSections(initialExpanded);

    // Auto-resume: Find first uncompleted lesson, or default to first lesson
    const allLessons = data.sections.flatMap((s) => s.lessons);
    const resumeLesson = allLessons.find((l) => !l.isCompleted) || allLessons[0] || null;
    setActiveLesson(resumeLesson);

    setLoading(false);
  }, [slug, user?.id]);

  React.useEffect(() => {
    loadCurriculum();
  }, [loadCurriculum]);

  // 2. Load Comments when Active Lesson Changes
  React.useEffect(() => {
    if (!activeLesson?.id) return;
    setLoadingComments(true);
    LessonService.getLessonComments(activeLesson.id).then((cList) => {
      setComments(cList);
      setLoadingComments(false);
    });
  }, [activeLesson?.id]);

  // Toggle Section Expansion in Sidebar
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // 3. Mark Lesson Complete / Toggle Progress
  const handleToggleComplete = async (lesson: CourseLesson) => {
    if (!user?.id || !course?.id) return;

    const newStatus = !lesson.isCompleted;

    // Optimistic UI Update
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        lessons: s.lessons.map((l) => (l.id === lesson.id ? { ...l, isCompleted: newStatus } : l)),
      }))
    );
    if (activeLesson?.id === lesson.id) {
      setActiveLesson((prev) => (prev ? { ...prev, isCompleted: newStatus } : null));
    }

    const res = await LessonService.toggleLessonProgress(user.id, course.id, lesson.id, newStatus);
    if (res.success) {
      setProgressPercentage(res.progressPercentage);
      const newCompleted = newStatus ? completedCount + 1 : Math.max(0, completedCount - 1);
      setCompletedCount(newCompleted);

      // If finished last lesson (100% completion), celebrate and prompt certificate!
      if (res.allCompleted) {
        handleClaimCertificate();
      }
    }
  };

  // Next / Previous Lesson Navigation
  const allLessons = React.useMemo(() => sections.flatMap((s) => s.lessons), [sections]);
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const navigateToLesson = (lesson: CourseLesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Submit Discussion Comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user?.id || !activeLesson?.id) return;

    setSubmittingComment(true);
    const res = await LessonService.postComment({
      lessonId: activeLesson.id,
      userId: user.id,
      body: newCommentText.trim(),
    });

    setSubmittingComment(false);
    if (res.success) {
      setNewCommentText('');
      const updated = await LessonService.getLessonComments(activeLesson.id);
      setComments(updated);
    }
  };

  // Post Reply to Comment
  const handlePostReply = async (parentCommentId: string) => {
    if (!replyText.trim() || !user?.id || !activeLesson?.id) return;

    setSubmittingComment(true);
    const res = await LessonService.postComment({
      lessonId: activeLesson.id,
      userId: user.id,
      body: replyText.trim(),
      parentCommentId,
    });

    setSubmittingComment(false);
    if (res.success) {
      setReplyText('');
      setReplyingToId(null);
      const updated = await LessonService.getLessonComments(activeLesson.id);
      setComments(updated);
    }
  };

  // Delete Comment (Admin / Teacher moderation)
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    const res = await LessonService.deleteComment(commentId);
    if (res.success && activeLesson?.id) {
      const updated = await LessonService.getLessonComments(activeLesson.id);
      setComments(updated);
    }
  };

  // 5. Ask AI Study Tutor ("Professor AI")
  const handleAskTutor = async (questionText?: string) => {
    const q = (questionText || tutorInput).trim();
    if (!q || !activeLesson) return;

    // Append student message
    const updatedHistory = [...tutorMessages, { sender: 'student' as const, text: q }];
    setTutorMessages(updatedHistory);
    setTutorInput('');
    setTutorLoading(true);

    try {
      const res = await fetch('/api/ai/study-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course?.title || 'Academic Masterclass',
          lessonTitle: activeLesson.title,
          lessonContent: activeLesson.contentHtml || '',
          studentQuestion: q,
          chatHistory: tutorMessages,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setTutorMessages([
          ...updatedHistory,
          {
            sender: 'tutor' as const,
            text: data.data.reply,
            followUps: data.data.suggestedFollowUps,
          },
        ]);
      } else {
        throw new Error(data.error || 'Tutor service busy');
      }
    } catch {
      setTutorMessages([
        ...updatedHistory,
        {
          sender: 'tutor' as const,
          text: `Beta, regarding **${activeLesson.title}**: In PMDC & UHS examinations, this concept tests proportional mathematical relationships. Review the core formula, verify SI units, and remember that conservative work along a closed path is always zero.`,
          followUps: [
            'Can you give me a past-paper MCQ on this?',
            'What is the formula shortcut for this topic?',
          ],
        },
      ]);
    } finally {
      setTutorLoading(false);
    }
  };

  // 6. Claim Verifiable Completion Certificate
  const handleClaimCertificate = async () => {
    if (!user?.id || !course?.id) return;
    setClaimingCertificate(true);
    const res = await CertificateService.claimCertificate(user.id, course.id);
    setClaimingCertificate(false);
    if (res.success && res.certificate) {
      setCertificateData(res.certificate);
      setCertificateModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Loading course player & lecture materials...</p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['STUDENT', 'ADMIN', 'TEACHER']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* ================= 1. TOP APP BAR ================= */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 shrink-0">
          {/* Left: Back & Course Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/student/dashboard"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-white truncate">
                {course?.title || 'Course Lecture Player'}
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                {activeLesson?.title || 'Select a lecture to begin'}
              </p>
            </div>
          </div>

          {/* Right: Progress, Certificate CTA, AI Tutor Button, Sidebar Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Progress Badge */}
            <div className="hidden md:flex items-center gap-2.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <div className="w-24 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-indigo h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-200">
                {progressPercentage}%
              </span>
            </div>

            {/* Certificate Button */}
            {progressPercentage === 100 && (
              <button
                onClick={handleClaimCertificate}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer animate-pulse"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Claim Certificate</span>
              </button>
            )}

            {/* AI Tutor Floating Trigger */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-[0.99]"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Ask Professor AI</span>
            </button>

            {/* Sidebar Toggle for Mobile / Fullscreen */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={sidebarOpen ? 'Hide Curriculum' : 'Show Curriculum'}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* ================= 2. MAIN PLAYER & CURRICULUM LAYOUT ================= */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Player, Lecture Content, and Discussion Tabs */}
          <main className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col">
            {activeLesson ? (
              <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
                {/* 1. Media Player Frame */}
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  {activeLesson.lessonType === 'VIDEO' && activeLesson.videoUrl ? (
                    <div className="aspect-video w-full bg-black flex items-center justify-center">
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    /* Reading Lecture Hero */
                    <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                      <div className="h-14 w-14 rounded-2xl bg-brand-indigo/20 text-brand-indigo flex items-center justify-center border border-brand-indigo/30">
                        <FileText className="h-7 w-7" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white max-w-lg">
                        {activeLesson.title}
                      </h2>
                      <p className="text-xs text-slate-400 max-w-md">
                        Comprehensive Academic Reading Lecture & Formula Cheat Sheet. Review below and mark completed when done.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Lecture Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  {/* Left: Previous Lesson */}
                  <button
                    disabled={!prevLesson}
                    onClick={() => prevLesson && navigateToLesson(prevLesson)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                      prevLesson
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'opacity-40 cursor-not-allowed bg-slate-800/50 text-slate-500'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous Lesson</span>
                  </button>

                  {/* Middle: Complete Lesson Button */}
                  <button
                    onClick={() => handleToggleComplete(activeLesson)}
                    className={cn(
                      'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-[0.99]',
                      activeLesson.isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-brand-indigo hover:bg-brand-indigoHover text-white'
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {activeLesson.isCompleted ? 'Completed ✓ (Click to Undo)' : 'Mark as Completed'}
                    </span>
                  </button>

                  {/* Right: Next Lesson */}
                  <button
                    disabled={!nextLesson}
                    onClick={() => nextLesson && navigateToLesson(nextLesson)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                      nextLesson
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'opacity-40 cursor-not-allowed bg-slate-800/50 text-slate-500'
                    )}
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* 3. Tabbed Content Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-slate-800 bg-slate-900/80 px-4">
                    <button
                      onClick={() => setActiveTab('notes')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer',
                        activeTab === 'notes'
                          ? 'border-brand-indigo text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Lecture Notes & Overview</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('discussion')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer',
                        activeTab === 'discussion'
                          ? 'border-brand-indigo text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Topic Q&A Discussion ({comments.length})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('resources')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer',
                        activeTab === 'resources'
                          ? 'border-brand-indigo text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Formula Sheet & Downloads</span>
                    </button>
                  </div>

                  {/* Tab 1: Lecture Notes */}
                  {activeTab === 'notes' && (
                    <div className="p-6 sm:p-8 space-y-4 text-slate-300 leading-relaxed text-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h3 className="font-bold text-base text-white">{activeLesson.title}</h3>
                        <span className="text-xs text-slate-500 font-mono">
                          Duration: {Math.round(activeLesson.videoDurationSeconds / 60)} Mins
                        </span>
                      </div>

                      {activeLesson.contentHtml ? (
                        <div
                          className="prose prose-invert prose-indigo max-w-none text-xs sm:text-sm space-y-3"
                          dangerouslySetInnerHTML={{ __html: activeLesson.contentHtml }}
                        />
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          No text notes provided for this video lecture. Use the AI Study Tutor for instant conceptual summaries.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Topic Q&A & Community Discussion */}
                  {activeTab === 'discussion' && (
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-base text-white">Lesson Discussion & Q&A</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Ask questions regarding this specific lecture. Official faculty replies carry a verified gold badge.
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                          {comments.length} Question{comments.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      {/* Post Comment Form */}
                      <form onSubmit={handlePostComment} className="space-y-3">
                        <textarea
                          rows={3}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Type your question or clarification request for this lecture..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-indigo placeholder:text-slate-600 resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submittingComment || !newCommentText.trim()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>{submittingComment ? 'Posting...' : 'Post Question'}</span>
                          </button>
                        </div>
                      </form>

                      {/* Comments Thread */}
                      {loadingComments ? (
                        <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-indigo" />
                          <span>Loading discussion thread...</span>
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                          <MessageSquare className="h-8 w-8 text-slate-600 mx-auto" />
                          <p className="text-xs font-semibold text-slate-400">No questions posted yet for this topic.</p>
                          <p className="text-[11px] text-slate-600">Be the first student to ask a question!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-7 w-7 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs">
                                    {comment.author.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-white">
                                        {comment.author.name}
                                      </span>
                                      {comment.author.role === 'TEACHER' && (
                                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                          Instructor
                                        </span>
                                      )}
                                      {comment.author.role === 'ADMIN' && (
                                        <span className="text-[10px] font-bold bg-brand-indigo/20 text-indigo-300 border border-brand-indigo/30 px-1.5 py-0.2 rounded">
                                          Admin
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                                  </div>
                                </div>

                                {/* Delete button for Teacher/Admin */}
                                {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"
                                    title="Delete comment"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed pl-9">
                                {comment.body}
                              </p>

                              {/* Nested Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-9 space-y-2.5 pt-2 border-t border-slate-800/80">
                                  {comment.replies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-bold text-xs text-slate-200">
                                            {reply.author.name}
                                          </span>
                                          {reply.author.role === 'TEACHER' && (
                                            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded">
                                              Verified Faculty
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-slate-500">{reply.createdAt}</span>
                                      </div>
                                      <p className="text-xs text-slate-300 leading-relaxed">
                                        {reply.body}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Reply Trigger */}
                              <div className="pl-9 pt-1">
                                {replyingToId === comment.id ? (
                                  <div className="space-y-2 mt-2">
                                    <textarea
                                      rows={2}
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Write your reply or answer..."
                                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-indigo placeholder:text-slate-600 resize-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setReplyingToId(null);
                                          setReplyText('');
                                        }}
                                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handlePostReply(comment.id)}
                                        disabled={submittingComment || !replyText.trim()}
                                        className="px-3 py-1 bg-brand-indigo hover:bg-brand-indigoHover text-white rounded-lg text-xs font-bold disabled:opacity-40"
                                      >
                                        Post Reply
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setReplyingToId(comment.id)}
                                    className="text-[11px] font-bold text-brand-indigo hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>Reply to this question</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Formula Sheet & Resources */}
                  {activeTab === 'resources' && (
                    <div className="p-6 sm:p-8 space-y-4">
                      <h3 className="font-bold text-base text-white">Lesson Resources & Quick Sheets</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-brand-indigo flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Lecture Formula Summary (PDF)</p>
                              <span className="text-[10px] text-slate-500">1.2 MB • High-Yield Notes</span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert('Download initiated for lecture formula cheat sheet!')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                          >
                            Download
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                              <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">MDCAT Past Paper Shortcut Sheet</p>
                              <span className="text-[10px] text-slate-500">850 KB • 400+ Exam Tricks</span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert('Download initiated for past paper shortcuts!')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <BookOpen className="h-10 w-10 text-slate-600" />
                <h3 className="text-lg font-bold text-white">No Lecture Selected</h3>
                <p className="text-xs text-slate-400">Choose a lecture from the curriculum sidebar to start learning.</p>
              </div>
            )}
          </main>

          {/* ================= 3. CURRICULUM SIDEBAR ================= */}
          {sidebarOpen && (
            <aside className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Course Curriculum
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {completedCount} / {totalLessons} Lessons Completed ({progressPercentage}%)
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-slate-500 hover:text-white"
                  title="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Curriculum List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
                {sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[section.id] !== false;
                  const secCompleted = section.lessons.filter((l) => l.isCompleted).length;

                  return (
                    <div key={section.id} className="bg-slate-900/40">
                      {/* Section Header Accordion */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="pr-2 min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 truncate">
                            {section.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {secCompleted} / {section.lessons.length} Completed
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {/* Section Lessons */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-800/40 bg-slate-950/40">
                          {section.lessons.map((lesson) => {
                            const isCurrent = activeLesson?.id === lesson.id;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => navigateToLesson(lesson)}
                                className={cn(
                                  'w-full p-3 pl-4 text-left flex items-start gap-3 transition-colors cursor-pointer',
                                  isCurrent
                                    ? 'bg-brand-indigo/15 border-l-4 border-brand-indigo'
                                    : 'hover:bg-slate-800/40 border-l-4 border-transparent'
                                )}
                              >
                                {/* Checkbox / Completion Icon */}
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleComplete(lesson);
                                  }}
                                  className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
                                  title={lesson.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  {lesson.isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-slate-600" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      'text-xs font-medium leading-snug line-clamp-2',
                                      isCurrent ? 'font-bold text-white' : 'text-slate-300'
                                    )}
                                  >
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      {lesson.lessonType === 'VIDEO' ? (
                                        <Video className="h-3 w-3 text-indigo-400" />
                                      ) : (
                                        <FileText className="h-3 w-3 text-emerald-400" />
                                      )}
                                      <span>
                                        {lesson.lessonType === 'VIDEO'
                                          ? `${Math.round(lesson.videoDurationSeconds / 60)}m`
                                          : 'Reading'}
                                      </span>
                                    </span>
                                    {lesson.isFreePreview && (
                                      <span className="text-amber-400 font-mono text-[9px]">
                                        Free Preview
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </div>

        {/* ================= 4. CONTEXTUAL AI STUDY TUTOR ("PROFESSOR AI") DRAWER ================= */}
        {aiDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setAiDrawerOpen(false)}
            />

            {/* Side Drawer Window */}
            <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 text-white animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-indigo-500 flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Professor AI</span>
                      <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30">
                        24/7 Co-Pilot
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                      {activeLesson?.title || 'Personal Study Tutor'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {tutorMessages.length === 0 ? (
                  <div className="space-y-4 pt-4">
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                      <p className="text-xs text-slate-200 font-semibold">
                        Assalam-o-Alaikum, Beta! 👨‍🏫
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        I am your dedicated academic co-pilot for <strong>{course?.title}</strong>. Ask me anything about <em>"{activeLesson?.title}"</em>, past paper shortcuts, or tricky numericals!
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Quick Questions for This Lecture:
                      </span>
                      {[
                        `Explain "${activeLesson?.title || 'this topic'}" in simple terms`,
                        'What are the most common MDCAT traps in this concept?',
                        'Give me 3 practice MCQs with step-by-step answers',
                        'Summarize the essential formulas in 5 bullet points',
                      ].map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleAskTutor(promptText)}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate pr-2">{promptText}</span>
                          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  tutorMessages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className={cn(
                        'flex flex-col space-y-1 text-xs',
                        msg.sender === 'student' ? 'items-end' : 'items-start'
                      )}
                    >
                      <span className="text-[10px] text-slate-500 font-mono">
                        {msg.sender === 'student' ? 'You' : 'Professor AI'}
                      </span>
                      <div
                        className={cn(
                          'p-3.5 rounded-2xl max-w-[90%] leading-relaxed',
                          msg.sender === 'student'
                            ? 'bg-brand-indigo text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 whitespace-pre-line'
                        )}
                      >
                        {msg.text}
                      </div>

                      {/* Suggested Follow-up chips */}
                      {msg.followUps && msg.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[90%]">
                          {msg.followUps.map((fText, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleAskTutor(fText)}
                              className="text-[10px] bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              + {fText}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {tutorLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-indigo" />
                    <span>Professor AI is formulating explanation...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-800 bg-slate-900">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskTutor();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={tutorInput}
                    onChange={(e) => setTutorInput(e.target.value)}
                    placeholder="Ask Professor AI about this lecture..."
                    disabled={tutorLoading}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-indigo"
                  />
                  <button
                    type="submit"
                    disabled={tutorLoading || !tutorInput.trim()}
                    className="p-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. CERTIFICATE MODAL ================= */}
        {certificateModalOpen && certificateData && (
          <Modal
            isOpen={certificateModalOpen}
            onClose={() => setCertificateModalOpen(false)}
            title="🎉 Congratulations on Course Completion!"
            description="You have successfully finished 100% of the curriculum."
            maxWidth="2xl"
          >
            <div className="space-y-4">
              <AcademicCertificate
                studentName={certificateData.studentName}
                courseTitle={certificateData.courseTitle}
                certificateCode={certificateData.certificateCode}
                issuedAt={certificateData.issuedAt}
                instructorName={certificateData.instructorName}
              />
            </div>
          </Modal>
        )}
      </div>
    </RoleGuard>
  );
}
