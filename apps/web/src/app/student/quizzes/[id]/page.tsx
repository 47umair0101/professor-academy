'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  QuizService,
  type QuizDetails,
  type QuizAttemptResult,
} from '@/lib/services/quiz-service';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Loader2,
  Award,
  BookOpen,
  Send,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function StudentQuizPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = (params?.id as string) || '';
  const { user } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [quiz, setQuiz] = React.useState<QuizDetails | null>(null);

  // Quiz Play States: 'BRIEFING' | 'IN_PROGRESS' | 'COMPLETED'
  const [playState, setPlayState] = React.useState<'BRIEFING' | 'IN_PROGRESS' | 'COMPLETED'>('BRIEFING');
  const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [startedAt, setStartedAt] = React.useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = React.useState<number>(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [attemptResult, setAttemptResult] = React.useState<QuizAttemptResult | null>(null);

  // 1. Load Quiz Details
  React.useEffect(() => {
    if (!quizId) return;
    setLoading(true);
    QuizService.getQuizDetails(quizId).then((data) => {
      setQuiz(data);
      if (data) {
        setSecondsRemaining(data.timeLimitMinutes * 60);
      }
      setLoading(false);
    });
  }, [quizId]);

  // 2. Countdown Timer
  React.useEffect(() => {
    if (playState !== 'IN_PROGRESS') return;

    if (secondsRemaining <= 0) {
      // Auto-submit when time expires!
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [playState, secondsRemaining]);

  // Start Quiz
  const handleStartQuiz = () => {
    setStartedAt(new Date().toISOString());
    setPlayState('IN_PROGRESS');
    setActiveQuestionIndex(0);
  };

  // Set Answer for a question
  const setQuestionAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (!user?.id || !quiz) return;
    setSubmitting(true);

    const res = await QuizService.submitQuizAttempt({
      quizId: quiz.id,
      studentId: user.id,
      answers,
      startedAt: startedAt || new Date().toISOString(),
    });

    setSubmitting(false);

    if (res.success && res.result) {
      setAttemptResult(res.result);
      setPlayState('COMPLETED');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(res.error || 'Failed to submit quiz attempt.');
    }
  };

  // Timer formatting
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm font-semibold">Loading timed assessment...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Assessment Unavailable</h2>
          <p className="text-xs text-slate-500">
            This quiz does not exist or has not been published by the instructor yet.
          </p>
          <Link href="/student/dashboard">
            <Button variant="secondary" size="md">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[activeQuestionIndex];
  const isLastQuestion = activeQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;

  return (
    <RoleGuard allowedRoles={['STUDENT', 'ADMIN', 'TEACHER']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* ================= 1. PRE-QUIZ BRIEFING VIEW ================= */}
        {playState === 'BRIEFING' && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-indigo bg-indigo-500/10 px-3 py-1 rounded-full w-max border border-indigo-500/20">
                <span>{quiz.courseTitle}</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {quiz.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {quiz.description || 'Test your conceptual mastery under exam conditions.'}
                </p>
              </div>

              {/* Assessment Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-slate-800 text-center">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Time Limit</span>
                  <strong className="text-sm sm:text-base font-mono text-white block mt-0.5">
                    {quiz.timeLimitMinutes} Mins
                  </strong>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Items</span>
                  <strong className="text-sm sm:text-base font-mono text-white block mt-0.5">
                    {questions.length} Questions
                  </strong>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Passing Score</span>
                  <strong className="text-sm sm:text-base font-mono text-emerald-400 block mt-0.5">
                    {quiz.passingPercentage}%
                  </strong>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Attempts</span>
                  <strong className="text-sm sm:text-base font-mono text-white block mt-0.5">
                    {quiz.attemptsAllowed} Max
                  </strong>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Exam Integrity & Hybrid Evaluation Rules:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li>Objective questions (MCQs, True/False) are scored instantly with step-by-step rationales.</li>
                  <li>Written descriptive questions are audited by <strong>Gemini AI</strong> against official syllabus rubrics.</li>
                  <li>The countdown timer cannot be paused once initiated. If time runs out, answers submit automatically.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/student/dashboard"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Link>

                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-indigo hover:bg-brand-indigoHover text-white font-bold text-sm shadow-xl transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Clock className="h-4 w-4" />
                  <span>Start Assessment Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. LIVE TIMED QUIZ PLAYER VIEW ================= */}
        {playState === 'IN_PROGRESS' && (
          <div className="flex-1 flex flex-col">
            {/* Top Sticky Timer & Submission Bar */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
              <div className="min-w-0 pr-4">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate">
                  {quiz.title}
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  Question {activeQuestionIndex + 1} of {questions.length} • ({answeredCount} Answered)
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Live Countdown Display */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm border transition-colors',
                    secondsRemaining < 300
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-amber-300 border-slate-700'
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>

                <button
                  disabled={submitting}
                  onClick={handleSubmitQuiz}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">Finish & Submit</span>
                </button>
              </div>
            </header>

            {/* Main Question Surface */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Question Navigation Ribbon */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline">
                  Jump to Item:
                </span>
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id!] !== undefined && answers[q.id!] !== '';
                  const isCurrent = idx === activeQuestionIndex;

                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={cn(
                        'h-8 w-8 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center',
                        isCurrent
                          ? 'bg-brand-indigo text-white ring-2 ring-white/20 shadow-md'
                          : isAnswered
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Card */}
              {currentQuestion && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-brand-indigo text-white font-mono font-bold text-xs flex items-center justify-center">
                        {activeQuestionIndex + 1}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {currentQuestion.questionType.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {currentQuestion.points} Mark{currentQuestion.points === 1 ? '' : 's'}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {currentQuestion.prompt}
                  </h3>

                  {/* Single Choice Radio Option Cards */}
                  {currentQuestion.questionType === 'SINGLE_CHOICE' && currentQuestion.options && (
                    <div className="space-y-2.5 pt-2">
                      {Object.entries(currentQuestion.options).map(([optKey, optText]) => {
                        const isSelected = answers[currentQuestion.id!] === optKey;

                        return (
                          <div
                            key={optKey}
                            onClick={() => setQuestionAnswer(currentQuestion.id!, optKey)}
                            className={cn(
                              'p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3',
                              isSelected
                                ? 'bg-brand-indigo/20 border-brand-indigo text-white shadow-sm'
                                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                            )}
                          >
                            <div
                              className={cn(
                                'h-6 w-6 rounded-full border flex items-center justify-center font-mono font-bold text-xs shrink-0',
                                isSelected
                                  ? 'border-brand-indigo bg-brand-indigo text-white'
                                  : 'border-slate-600 text-slate-400'
                              )}
                            >
                              {optKey}
                            </div>
                            <span className="text-xs sm:text-sm font-medium leading-normal">
                              {String(optText)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True / False Binary Selection */}
                  {currentQuestion.questionType === 'TRUE_FALSE' && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {['True', 'False'].map((val) => {
                        const isSelected = answers[currentQuestion.id!] === val;

                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setQuestionAnswer(currentQuestion.id!, val)}
                            className={cn(
                              'p-5 rounded-2xl border font-bold text-sm transition-all cursor-pointer',
                              isSelected
                                ? val === 'True'
                                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md'
                                  : 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-md'
                                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800'
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill in the Blanks Input */}
                  {currentQuestion.questionType === 'FILL_BLANK' && (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-400 block font-medium">
                        Type the exact scientific term or numerical value:
                      </label>
                      <input
                        type="text"
                        value={answers[currentQuestion.id!] || ''}
                        onChange={(e) => setQuestionAnswer(currentQuestion.id!, e.target.value)}
                        placeholder="Your answer here..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-indigo"
                      />
                    </div>
                  )}

                  {/* Written Q/A Descriptive Textarea */}
                  {currentQuestion.questionType === 'WRITTEN_QA' && (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-400 block font-medium">
                        Write your comprehensive answer (evaluated by Gemini AI against official rubric):
                      </label>
                      <textarea
                        rows={5}
                        value={answers[currentQuestion.id!] || ''}
                        onChange={(e) => setQuestionAnswer(currentQuestion.id!, e.target.value)}
                        placeholder="State relevant equations, boundary conditions, and conceptual explanations..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-indigo resize-none leading-relaxed"
                      />
                      <span className="text-[10px] text-slate-500 font-mono block text-right">
                        {(answers[currentQuestion.id!] || '').length} Characters
                      </span>
                    </div>
                  )}

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>

                    {isLastQuestion ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-[0.99]"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        <span>Submit Assessment</span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setActiveQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-xs font-bold text-white transition-all shadow-md active:scale-[0.99]"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}

        {/* ================= 3. POST-QUIZ RESULTS & REVIEW VIEW ================= */}
        {playState === 'COMPLETED' && attemptResult && (
          <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Celebration / Status Card */}
            <div
              className={cn(
                'rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-2xl border',
                attemptResult.isPassed
                  ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/40'
                  : 'bg-gradient-to-b from-amber-950/80 to-slate-900 border-amber-500/40'
              )}
            >
              <div
                className={cn(
                  'h-16 w-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg',
                  attemptResult.isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-slate-950'
                )}
              >
                {attemptResult.isPassed ? (
                  <Award className="h-9 w-9 stroke-[2.2]" />
                ) : (
                  <AlertCircle className="h-9 w-9 stroke-[2.2]" />
                )}
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                {attemptResult.isPassed ? 'Assessment Mastered!' : 'Diagnostic Review Ready'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {attemptResult.isPassed
                  ? `Congratulations! You scored above the ${quiz.passingPercentage}% benchmark.`
                  : `You scored ${attemptResult.percentage}%. Review the step-by-step rationales below to master tricky pitfalls.`}
              </p>

              {/* Score Metric Badges */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4 text-center">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Points</span>
                  <strong className="text-base sm:text-xl font-mono text-white mt-0.5 block">
                    {attemptResult.totalScore} / {attemptResult.maxScore}
                  </strong>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Percentage</span>
                  <strong
                    className={cn(
                      'text-base sm:text-xl font-mono mt-0.5 block',
                      attemptResult.isPassed ? 'text-emerald-400' : 'text-amber-400'
                    )}
                  >
                    {attemptResult.percentage}%
                  </strong>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Grading Status</span>
                  <strong className="text-[11px] font-mono text-indigo-300 mt-1 block">
                    {attemptResult.gradingStatus === 'PENDING_GRADING' ? 'Faculty Audit' : 'Completed ✓'}
                  </strong>
                </div>
              </div>

              {attemptResult.gradingStatus === 'PENDING_GRADING' && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-xs text-indigo-200 max-w-md mx-auto">
                  💡 Descriptive written questions have received preliminary AI points and are awaiting final review in the Teacher Grading Queue.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-3">
                <Link href="/student/dashboard">
                  <Button variant="secondary" size="md">
                    Return to Dashboard
                  </Button>
                </Link>
                <Link href={`/student/courses/${quiz.courseId}/learn`}>
                  <Button variant="primary" size="md">
                    Continue Course Lectures
                  </Button>
                </Link>
              </div>
            </div>

            {/* Detailed Questions Review */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-indigo" />
                <span>Question-by-Question Audit & Step-by-Step Rationales</span>
              </h3>

              <div className="space-y-4">
                {attemptResult.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {ans.questionType.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          Marks: {ans.pointsAwarded} / {ans.maxPoints}
                        </span>
                        {ans.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : ans.questionType === 'WRITTEN_QA' ? (
                          <Sparkles className="h-4 w-4 text-amber-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                      </div>
                    </div>

                    <p className="font-semibold text-xs sm:text-sm text-white">
                      {ans.questionPrompt}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                          Your Answer:
                        </span>
                        <p className="font-medium text-slate-200 mt-0.5">
                          {ans.studentResponse ? String(ans.studentResponse) : '(Left Blank)'}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                          Expected / Correct Concept:
                        </span>
                        <p className="font-medium text-emerald-400 mt-0.5">
                          {Array.isArray(ans.correctAnswer) ? ans.correctAnswer.join(', ') : String(ans.correctAnswer)}
                        </p>
                      </div>
                    </div>

                    {ans.aiFeedback && (
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Gemini AI Examiner Rationale:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{ans.aiFeedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>
    </RoleGuard>
  );
}
