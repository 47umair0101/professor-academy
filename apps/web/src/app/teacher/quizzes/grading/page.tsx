'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { QuizService } from '@/lib/services/quiz-service';
import {
  FileCheck2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  User,
  Clock,
  BookOpen,
  Send,
  Loader2,
  HelpCircle,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherGradingQueuePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [queue, setQueue] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeAttempt, setActiveAttempt] = React.useState<any | null>(null);

  // Grade Overrides State: { [answerId]: { points: number, feedback: string } }
  const [gradeInputs, setGradeInputs] = React.useState<
    Record<string, { points: number; feedback: string }>
  >({});
  const [submitting, setSubmitting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await QuizService.getTeacherGradingQueue(user.id);
    setQueue(data);

    if (data.length > 0) {
      setActiveAttempt(data[0]);
      // Initialize inputs from data
      const init: Record<string, { points: number; feedback: string }> = {};
      data[0].writtenAnswers.forEach((ans: any) => {
        init[ans.id] = {
          points: ans.pointsAwarded,
          feedback: ans.teacherFeedback || ans.aiFeedback || 'Approved.',
        };
      });
      setGradeInputs(init);
    } else {
      setActiveAttempt(null);
    }
    setLoading(false);
  }, [user?.id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const selectAttempt = (att: any) => {
    setActiveAttempt(att);
    const init: Record<string, { points: number; feedback: string }> = {};
    att.writtenAnswers.forEach((ans: any) => {
      init[ans.id] = {
        points: ans.pointsAwarded,
        feedback: ans.teacherFeedback || ans.aiFeedback || 'Approved.',
      };
    });
    setGradeInputs(init);
  };

  const handleFinalize = async () => {
    if (!activeAttempt || !user?.id) return;

    setSubmitting(true);
    const answersToSubmit = activeAttempt.writtenAnswers.map((ans: any) => ({
      answerId: ans.id,
      points: Number(gradeInputs[ans.id]?.points) || 0,
      feedback: gradeInputs[ans.id]?.feedback || 'Graded by instructor.',
    }));

    const res = await QuizService.finalizeTeacherGrading({
      attemptId: activeAttempt.id,
      teacherId: user.id,
      studentId: activeAttempt.studentId,
      quizTitle: activeAttempt.quizTitle,
      gradedAnswers: answersToSubmit,
    });

    setSubmitting(false);

    if (res.success) {
      alert('Student score finalized and in-app notification sent!');
      loadData();
    } else {
      alert(res.error || 'Failed to finalize marks');
    }
  };

  return (
    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/teacher/quizzes"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-slate-900">
                  Written Q/A Hybrid Grading Queue
                </h1>
                <p className="text-[11px] text-slate-500">
                  Review student descriptive responses, verify Gemini AI evaluations, and finalize scores.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl">
                {queue.length} Pending Submission{queue.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500 space-y-2">
              <Loader2 className="h-8 w-8 text-brand-indigo animate-spin mx-auto" />
              <p>Loading grading queue...</p>
            </div>
          ) : queue.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-sm max-w-lg mx-auto">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Queue is Clear!</h2>
              <p className="text-xs text-slate-500">
                All student written responses have been graded and audited. New submissions will appear here automatically.
              </p>
              <Link href="/teacher/quizzes">
                <Button variant="secondary" size="md">
                  Back to Assessments
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Submissions List (4 Cols) */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  Pending Submissions ({queue.length})
                </h3>

                <div className="space-y-2.5">
                  {queue.map((att) => {
                    const isSelected = activeAttempt?.id === att.id;

                    return (
                      <div
                        key={att.id}
                        onClick={() => selectAttempt(att)}
                        className={cn(
                          'p-4 rounded-2xl border transition-all cursor-pointer space-y-2',
                          isSelected
                            ? 'bg-white border-brand-indigo shadow-md ring-2 ring-brand-indigo/10'
                            : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-xs'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {att.studentName}
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                            Pending Audit
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium line-clamp-1">
                          {att.quizTitle}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                          <span>{att.submittedAt}</span>
                          <span className="font-bold text-slate-700">
                            {att.writtenAnswers.length} Written Item{att.writtenAnswers.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Written Answer Inspector (8 Cols) */}
              <div className="lg:col-span-8">
                {activeAttempt && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 p-6">
                    {/* Header Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {activeAttempt.studentName} — Written Evaluation
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {activeAttempt.quizTitle} • {activeAttempt.courseTitle}
                        </p>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-slate-400">Current Objective Score: </span>
                        <strong className="text-slate-900">
                          {activeAttempt.totalScore} / {activeAttempt.maxScore}
                        </strong>
                      </div>
                    </div>

                    {/* Written Questions List */}
                    <div className="space-y-6">
                      {activeAttempt.writtenAnswers.map((ans: any, idx: number) => (
                        <div
                          key={ans.id}
                          className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2 py-0.5 rounded">
                                Question {idx + 1}
                              </span>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                {ans.prompt}
                              </h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                              Max: {ans.maxPoints} Pts
                            </span>
                          </div>

                          {/* Official Expected Answer / Rubric */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Expected Keywords & Scientific Rubric:
                            </span>
                            <p className="text-slate-700 italic">"{ans.expectedAnswer}"</p>
                          </div>

                          {/* Student's Actual Written Response */}
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Student's Submitted Answer:
                            </span>
                            <p className="text-slate-900 font-medium whitespace-pre-wrap leading-relaxed">
                              {ans.studentResponse || '(No response entered)'}
                            </p>
                          </div>

                          {/* Gemini AI Assessment Card */}
                          <div className="p-3.5 rounded-xl bg-indigo-50/90 border border-indigo-100 text-xs space-y-1.5">
                            <div className="flex items-center justify-between font-bold text-brand-indigo">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-amber-400" />
                                <span>Gemini AI Recommended Marks: {ans.pointsAwarded} / {ans.maxPoints}</span>
                              </span>
                              <span className="text-[10px] font-mono text-indigo-700">
                                AI Confidence: 90%
                              </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                              {ans.aiFeedback}
                            </p>
                          </div>

                          {/* Faculty Override Controls */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/80 items-end">
                            <div className="sm:col-span-1">
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                Awarded Points
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                min={0}
                                max={ans.maxPoints}
                                value={gradeInputs[ans.id]?.points ?? ans.pointsAwarded}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setGradeInputs((prev) => ({
                                    ...prev,
                                    [ans.id]: {
                                      points: val,
                                      feedback: prev[ans.id]?.feedback || '',
                                    },
                                  }));
                                }}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-xs text-slate-900"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                Teacher Constructive Feedback (Sent to Student)
                              </label>
                              <input
                                type="text"
                                value={gradeInputs[ans.id]?.feedback ?? ans.teacherFeedback ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setGradeInputs((prev) => ({
                                    ...prev,
                                    [ans.id]: {
                                      points: prev[ans.id]?.points ?? ans.pointsAwarded,
                                      feedback: val,
                                    },
                                  }));
                                }}
                                placeholder="Add encouraging feedback or point out missing equations..."
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Finalize Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Approving will immediately calculate final score and deliver an in-app alert to {activeAttempt.studentName}.
                      </p>

                      <button
                        onClick={handleFinalize}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-40"
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <span>Finalize Score & Notify Student</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  );
}
