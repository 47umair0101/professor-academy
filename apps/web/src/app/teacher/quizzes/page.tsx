'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { QuizService, type QuizDetails } from '@/lib/services/quiz-service';
import {
  ClipboardCheck,
  PlusCircle,
  FileCheck2,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Loader2,
  BookOpen,
  Send,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherQuizzesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [quizzes, setQuizzes] = React.useState<QuizDetails[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [gradingQueueCount, setGradingQueueCount] = React.useState(0);
  const [publishingId, setPublishingId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const list = await QuizService.getTeacherQuizzes(user.id);
    setQuizzes(list);

    const queue = await QuizService.getTeacherGradingQueue(user.id);
    setGradingQueueCount(queue.length);
    setLoading(false);
  }, [user?.id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePublish = async (quizId: string) => {
    if (!user?.id) return;
    setPublishingId(quizId);
    const res = await QuizService.publishQuiz(quizId, user.id);
    setPublishingId(null);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || 'Failed to publish quiz');
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeTab === 'PUBLISHED' && !q.isPublished) return false;
    if (activeTab === 'DRAFT' && q.isPublished) return false;
    if (searchTerm.trim()) {
      const match =
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.courseTitle && q.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  return (
    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/teacher/dashboard"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Back to Teacher Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Academic Quiz & Assessment Suite
                </h1>
                <p className="text-[11px] text-slate-500">
                  Faculty Portal: MDCAT, ECAT & Board Assessment Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/teacher/quizzes/grading">
                <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-brand-indigo hover:bg-indigo-100 text-xs font-bold transition-all cursor-pointer">
                  <FileCheck2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Written Grading Queue</span>
                  {gradingQueueCount > 0 && (
                    <span className="bg-brand-indigo text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                      {gradingQueueCount}
                    </span>
                  )}
                </button>
              </Link>

              <Link href="/teacher/quizzes/new">
                <Button variant="primary" size="md" className="font-bold text-xs shadow-sm">
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  <span>+ Create Quiz</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Quick Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Assessments</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{quizzes.length}</h3>
                <span className="text-[11px] text-slate-400">Diagnostic & Benchmark</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Published Live</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
                  {quizzes.filter((q) => q.isPublished).length}
                </h3>
                <span className="text-[11px] text-emerald-700 font-medium">Available to Students</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Pending Written Grading</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1 font-mono">{gradingQueueCount}</h3>
                <span className="text-[11px] text-amber-700 font-medium">Needs Faculty Audit</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileCheck2 className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">AI Auto-Grading Engine</p>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </h3>
                <span className="text-[11px] text-indigo-600 font-mono">Gemini 3.5 Flash Active</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      activeTab === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    {tab === 'ALL' ? 'All Quizzes' : tab === 'PUBLISHED' ? 'Published' : 'Drafts'}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search quizzes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo focus:bg-white"
                />
              </div>
            </div>

            {/* Quizzes Table */}
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <Loader2 className="h-7 w-7 text-brand-indigo animate-spin mx-auto" />
                <p>Loading assessment bank...</p>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500 space-y-3">
                <ClipboardCheck className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No quizzes match your current filter.</p>
                <Link href="/teacher/quizzes/new">
                  <Button variant="primary" size="sm">Create First Quiz</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-5 font-bold">Assessment Title</th>
                      <th className="py-3.5 px-4 font-bold">Course</th>
                      <th className="py-3.5 px-4 font-bold">Time Limit</th>
                      <th className="py-3.5 px-4 font-bold">Passing %</th>
                      <th className="py-3.5 px-4 font-bold">Grading Mode</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQuizzes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                            {q.title}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {q.description || 'No description provided.'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-700 text-xs block max-w-xs truncate">
                            {q.courseTitle}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{q.timeLimitMinutes} Mins</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-slate-700">
                          {q.passingPercentage}%
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700">
                            {q.writtenGradingMode === 'HYBRID_AI_TEACHER'
                              ? 'Hybrid (AI + Teacher)'
                              : q.writtenGradingMode === 'AUTO_AI'
                              ? 'Auto AI Graded'
                              : 'Manual Faculty'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {q.isPublished ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>Live</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!q.isPublished && (
                              <button
                                onClick={() => handlePublish(q.id)}
                                disabled={publishingId === q.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40"
                              >
                                {publishingId === q.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Send className="h-3.5 w-3.5" />
                                )}
                                <span>Publish</span>
                              </button>
                            )}

                            <Link href={`/student/quizzes/${q.id}`}>
                              <button
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-indigo hover:bg-indigo-50 transition-colors"
                                title="Preview Student Experience"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
