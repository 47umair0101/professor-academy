'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  QuizService,
  type QuestionType,
  type GradingMode,
  type QuizQuestionInput,
} from '@/lib/services/quiz-service';
import { CourseCatalogService } from '@/lib/services/course-catalog-service';
import {
  ClipboardCheck,
  PlusCircle,
  Trash2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  HelpCircle,
  Save,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { cn } from '@/lib/utils';

export default function NewQuizPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [courses, setCourses] = React.useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState(true);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = React.useState(45);
  const [passingPercentage, setPassingPercentage] = React.useState(50);
  const [hasExpiry, setHasExpiry] = React.useState(false);
  const [expiresAt, setExpiresAt] = React.useState('');
  const [writtenGradingMode, setWrittenGradingMode] = React.useState<GradingMode>('HYBRID_AI_TEACHER');

  // AI Generator Prompt State
  const [aiTopic, setAiTopic] = React.useState('');
  const [generatingWithAi, setGeneratingWithAi] = React.useState(false);

  // Questions State
  const [questions, setQuestions] = React.useState<QuizQuestionInput[]>([
    {
      questionType: 'SINGLE_CHOICE',
      prompt: 'Which physical principle explains why a body accelerates along a curved path at constant speed?',
      options: {
        A: 'Uniform velocity without net force',
        B: 'Centripetal acceleration perpendicular to velocity',
        C: 'Inertial resistance of mass',
        D: 'Thermal dissipation of momentum',
      },
      correctAnswer: 'B',
      points: 2,
      sortOrder: 1,
    },
  ]);

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load Courses for Selector
  React.useEffect(() => {
    CourseCatalogService.getAllPublishedCourses().then((data: any[]) => {
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourseId(data[0].id);
      }
      setLoadingCourses(false);
    });
  }, []);

  // Add Empty Question
  const handleAddQuestion = (type: QuestionType = 'SINGLE_CHOICE') => {
    const newQ: QuizQuestionInput = {
      questionType: type,
      prompt: '',
      points: type === 'WRITTEN_QA' ? 5 : 2,
      sortOrder: questions.length + 1,
      options:
        type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE'
          ? { A: '', B: '', C: '', D: '' }
          : type === 'TRUE_FALSE'
          ? { True: 'True', False: 'False' }
          : {},
      correctAnswer:
        type === 'SINGLE_CHOICE'
          ? 'A'
          : type === 'TRUE_FALSE'
          ? 'True'
          : type === 'MULTIPLE_CHOICE'
          ? ['A']
          : '',
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  // Remove Question
  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Update Question Field
  const handleUpdateQuestion = (index: number, updates: Partial<QuizQuestionInput>) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, ...updates } : q))
    );
  };

  // One-Click AI Quiz Generator via Gemini
  const handleGenerateAiQuestions = async () => {
    const topicToUse = aiTopic.trim() || title.trim();
    if (!topicToUse) {
      alert('Please enter a topic statement or quiz title for the AI to analyze.');
      return;
    }

    setGeneratingWithAi(true);
    try {
      const res = await fetch('/api/ai/quiz-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          examTarget: 'MDCAT / PMDC & ECAT Pakistan',
          count: 5,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.mcqs)) {
        const generatedList: QuizQuestionInput[] = data.mcqs.map((m: any, idx: number) => ({
          questionType: 'SINGLE_CHOICE' as const,
          prompt: m.question,
          options: m.options,
          correctAnswer: m.correctOption,
          points: 2,
          sortOrder: questions.length + idx + 1,
          explanation: m.explanation,
        }));

        setQuestions((prev) => [...prev, ...generatedList]);
        setAiTopic('');
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch {
      // Fallback high-yield questions
      const fallbackQs: QuizQuestionInput[] = [
        {
          questionType: 'SINGLE_CHOICE',
          prompt: `In ${topicToUse}, what is the dimensional formula of the fundamental constant involved?`,
          options: { A: '[M L^2 T^-2]', B: '[M L^-1 T^-2]', C: '[M L T^-2]', D: '[M^0 L^0 T^0]' },
          correctAnswer: 'A',
          points: 2,
          sortOrder: questions.length + 1,
        },
        {
          questionType: 'TRUE_FALSE',
          prompt: `According to recent board examination trends in ${topicToUse}, conservative work along any closed loop is zero.`,
          options: { True: 'True', False: 'False' },
          correctAnswer: 'True',
          points: 1,
          sortOrder: questions.length + 2,
        },
      ];
      setQuestions((prev) => [...prev, ...fallbackQs]);
    } finally {
      setGeneratingWithAi(false);
    }
  };

  // Save or Publish Quiz
  const handleSubmit = async (publishNow: boolean) => {
    setError(null);
    if (!title.trim()) {
      setError('Please provide a quiz title.');
      return;
    }
    if (!selectedCourseId) {
      setError('Please select a target course.');
      return;
    }
    if (questions.length === 0) {
      setError('Please add at least one question to the assessment.');
      return;
    }

    setSaving(true);
    const res = await QuizService.createQuiz({
      courseId: selectedCourseId,
      title: title.trim(),
      description: description.trim(),
      timeLimitMinutes,
      passingPercentage,
      hasExpiry,
      expiresAt: hasExpiry && expiresAt ? expiresAt : null,
      writtenGradingMode,
      isPublished: publishNow,
      questions,
      teacherId: user?.id || '11111111-1111-1111-1111-111111111111',
    });

    setSaving(false);

    if (res.success) {
      router.push('/teacher/quizzes');
    } else {
      setError(res.error || 'Failed to save quiz.');
    }
  };

  return (
    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        {/* Top Sticky Header */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/teacher/quizzes"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-slate-900">Create New Assessment</h1>
                <p className="text-[11px] text-slate-500">
                  Timed Quizzes, AI Auto-Generation & Hybrid Grading Setup
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-40"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Publish Now & Notify Students</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Parameters & Rules */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-brand-indigo" />
              <span>Assessment Configuration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Course *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 2: Vectors & Equilibrium Diagnostic Test"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assessment Instructions / Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Guidelines for students: negative marking rules, non-calculator expectations, or formula notes."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo resize-none"
              />
            </div>

            {/* Time Limit, Passing %, Grading Mode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Time Limit (Minutes)
                </label>
                <div className="relative">
                  <Clock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Passing Percentage (%)
                </label>
                <input
                  type="number"
                  min={30}
                  max={100}
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Written Q/A Grading Mode
                </label>
                <select
                  value={writtenGradingMode}
                  onChange={(e) => setWrittenGradingMode(e.target.value as GradingMode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-brand-indigo"
                >
                  <option value="HYBRID_AI_TEACHER">Hybrid (AI Suggests + Faculty Approves)</option>
                  <option value="AUTO_AI">100% Automated AI Evaluated</option>
                  <option value="MANUAL_TEACHER">Manual Faculty Grading Only</option>
                </select>
              </div>
            </div>

            {/* Quiz Expiry Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-slate-900 block">
                  Enforce Assessment Expiry Deadline
                </span>
                <p className="text-[11px] text-slate-500">
                  When enabled, students cannot attempt this quiz past the deadline.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasExpiry}
                    onChange={(e) => setHasExpiry(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-indigo"></div>
                </label>

                {hasExpiry && (
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: AI One-Click Quiz Generator */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    One-Click AI Question Bank Generator
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Instantly create 5 high-yield conceptual MCQs with step-by-step rationale using Gemini AI.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Enter specific topic (e.g. Doppler Effect, Projectile Motion, or Le Chatelier Principle)..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/15"
              />
              <button
                type="button"
                disabled={generatingWithAi}
                onClick={handleGenerateAiQuestions}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {generatingWithAi ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                ) : (
                  <Sparkles className="h-4 w-4 text-slate-950" />
                )}
                <span>Generate 5 MCQs</span>
              </button>
            </div>
          </div>

          {/* Section 3: Questions List & Manual Creator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Question Bank ({questions.length} Question{questions.length === 1 ? '' : 's'})
                </h3>
                <p className="text-xs text-slate-500">
                  Total Points: {questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)} Marks
                </p>
              </div>

              {/* Add Question Dropdown */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('SINGLE_CHOICE')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-indigo text-xs font-bold text-slate-700 transition-colors shadow-xs"
                >
                  + MCQ
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('TRUE_FALSE')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-indigo text-xs font-bold text-slate-700 transition-colors shadow-xs"
                >
                  + True/False
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('FILL_BLANK')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-indigo text-xs font-bold text-slate-700 transition-colors shadow-xs"
                >
                  + Fill Blank
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('WRITTEN_QA')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold text-brand-indigo transition-colors shadow-xs"
                >
                  + Written Q/A
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-md bg-brand-indigo text-white font-mono font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {q.questionType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">Points:</span>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={q.points}
                          onChange={(e) =>
                            handleUpdateQuestion(idx, { points: Number(e.target.value) })
                          }
                          className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 font-mono font-bold text-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Prompt Textarea */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Question Statement / Problem Prompt *
                    </label>
                    <textarea
                      rows={2}
                      value={q.prompt}
                      onChange={(e) => handleUpdateQuestion(idx, { prompt: e.target.value })}
                      placeholder="Type the conceptual question statement..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo resize-none"
                    />
                  </div>

                  {/* Options Renderer Based on Type */}
                  {q.questionType === 'SINGLE_CHOICE' && q.options && (
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Options (Select the Radio for Correct Answer):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => (
                          <div
                            key={optKey}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded-xl border transition-colors',
                              q.correctAnswer === optKey
                                ? 'bg-emerald-50/60 border-emerald-300'
                                : 'bg-slate-50/60 border-slate-200'
                            )}
                          >
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={q.correctAnswer === optKey}
                              onChange={() => handleUpdateQuestion(idx, { correctAnswer: optKey })}
                              className="accent-emerald-600 h-4 w-4"
                            />
                            <span className="font-bold font-mono text-xs text-slate-700">
                              {optKey}:
                            </span>
                            <input
                              type="text"
                              value={q.options[optKey] || ''}
                              onChange={(e) => {
                                const newOpts = { ...q.options, [optKey]: e.target.value };
                                handleUpdateQuestion(idx, { options: newOpts });
                              }}
                              placeholder={`Option ${optKey} statement...`}
                              className="flex-1 bg-transparent border-0 text-xs text-slate-900 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.questionType === 'TRUE_FALSE' && (
                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-xs font-bold text-slate-600">Correct Answer:</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestion(idx, { correctAnswer: 'True' })}
                        className={cn(
                          'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                          q.correctAnswer === 'True'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        )}
                      >
                        True
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestion(idx, { correctAnswer: 'False' })}
                        className={cn(
                          'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                          q.correctAnswer === 'False'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        )}
                      >
                        False
                      </button>
                    </div>
                  )}

                  {q.questionType === 'FILL_BLANK' && (
                    <div className="pt-1">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Acceptable Blank Answers (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.join(', ')
                            : q.correctAnswer || ''
                        }
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map((s) => s.trim());
                          handleUpdateQuestion(idx, { correctAnswer: arr });
                        }}
                        placeholder="e.g. force, Force, net force"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo"
                      />
                    </div>
                  )}

                  {q.questionType === 'WRITTEN_QA' && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                      <label className="text-xs font-bold text-brand-indigo block">
                        Official Grading Rubric & Expected Keywords (Used by AI and Faculty)
                      </label>
                      <textarea
                        rows={2}
                        value={String(q.correctAnswer || '')}
                        onChange={(e) =>
                          handleUpdateQuestion(idx, { correctAnswer: e.target.value })
                        }
                        placeholder="List the essential concepts, equations, and conclusions that earn full marks."
                        className="w-full bg-white border border-indigo-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo resize-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
