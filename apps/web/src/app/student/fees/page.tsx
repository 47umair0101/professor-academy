'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { EnrollmentService } from '@/lib/services/enrollment-service';
import { formatPKR, type Enrollment, type Course } from '@professor-academy/shared';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Receipt,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

export default function StudentFeeHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [enrollments, setEnrollments] = React.useState<
    Array<{ enrollment: Enrollment; course: Course }>
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedReceipt, setSelectedReceipt] = React.useState<{
    url: string;
    courseTitle: string;
    tid: string;
  } | null>(null);
  const [receiptZoom, setReceiptZoom] = React.useState<number>(1);

  const loadData = React.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const history = await EnrollmentService.getStudentEnrollmentHistory(user.id);
    setEnrollments(history);
    setLoading(false);
  }, [user]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = enrollments.filter(
    (item) =>
      item.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enrollment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['STUDENT', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-indigo transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Student Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              <span>Refresh History</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="h-4 w-4" />
                <span>Financial Ledger & Admission Status</span>
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">
                Fee & Payment History
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track all manual bank and wallet fee submissions, verification status, and unlocked courses.
              </p>
            </div>

            <Link
              href="/courses"
              className="px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Browse More Courses</span>
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by course name or Transaction ID (TID)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo shadow-xs"
              />
            </div>
          </div>

          {/* Table / List View */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              Loading your transaction records...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Fee Submissions Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm
                  ? 'No payment submissions matched your search query.'
                  : 'You have not submitted any course fee receipts yet. Explore our academic courses to get started.'}
              </p>
              {!searchTerm && (
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-indigo text-white text-xs font-bold shadow-sm"
                >
                  Explore Course Catalog
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(({ enrollment, course }) => {
                const isPending = enrollment.status === 'PENDING_VERIFICATION';
                const isActive = enrollment.status === 'ACTIVE';
                const isRejected = enrollment.status === 'REJECTED';

                return (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Course Info & Status */}
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          course?.thumbnail_url ||
                          'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={course?.title || 'Course'}
                        className="w-16 h-12 object-cover rounded-xl border border-slate-200 shrink-0 shadow-xs"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
                            {course?.category || 'Academic Course'}
                          </span>
                          <span className="text-slate-300">•</span>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Clock className="h-3 w-3" />
                              <span>Under Review by Admin</span>
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Verified & Unlocked</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Verification Rejected</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                          {course?.title || 'Course'}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap">
                          <span>
                            TID: <strong className="text-slate-800">{enrollment.transaction_id}</strong>
                          </span>
                          <span>•</span>
                          <span>Method: <strong className="text-slate-800">{enrollment.payment_method}</strong></span>
                          <span>•</span>
                          <span>Date: {new Date(enrollment.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Rejection Note if applicable */}
                        {isRejected && enrollment.admin_notes && (
                          <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                            <strong>Admin Note:</strong> {enrollment.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount & Actions */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 gap-3 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fee Transferred</span>
                        <span className="font-mono font-bold text-base text-slate-900">
                          {formatPKR(enrollment.amount_paid_pkr)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Receipt Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReceipt({
                              url: enrollment.receipt_url,
                              courseTitle: course?.title || 'Receipt',
                              tid: enrollment.transaction_id,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Receipt</span>
                        </button>

                        {/* Status specific CTA */}
                        {isActive && (
                          <Link
                            href={`/courses/${course?.slug || ''}`}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>Go to Course</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}

                        {isRejected && (
                          <Link
                            href={`/courses/${course?.slug || ''}/enroll`}
                            className="px-4 py-1.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>Resubmit</span>
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Link>
                        )}

                        {isPending && (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/80">
                            Estimated: 1-2 Hours
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RECEIPT VIEWER MODAL ================= */}
        {selectedReceipt && (
          <Modal
            isOpen={!!selectedReceipt}
            onClose={() => {
              setSelectedReceipt(null);
              setReceiptZoom(1);
            }}
            title={`Payment Receipt - TID: ${selectedReceipt.tid}`}
            description={selectedReceipt.courseTitle}
            maxWidth="lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span className="font-mono font-bold text-slate-800">TID: {selectedReceipt.tid}</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setReceiptZoom((prev) => Math.max(0.6, prev - 0.2))}
                    className="p-1 rounded hover:bg-white text-slate-600 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiptZoom(1)}
                    className="px-1.5 py-0.5 text-[10px] font-mono text-slate-600 hover:bg-white rounded cursor-pointer"
                    title="Reset Zoom"
                  >
                    {Math.round(receiptZoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiptZoom((prev) => Math.min(2.5, prev + 0.2))}
                    className="p-1 rounded hover:bg-white text-slate-600 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <div className="h-3.5 w-px bg-slate-300 mx-0.5" />
                  <a
                    href={selectedReceipt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-white text-slate-600 hover:text-brand-indigo cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Open Original in New Tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Original</span>
                  </a>
                </div>
              </div>

              <div className="min-h-[380px] max-h-[64vh] w-full rounded-2xl overflow-auto bg-slate-950 border border-slate-800 flex items-center justify-center p-3 relative shadow-inner">
                <img
                  src={selectedReceipt.url}
                  alt="Receipt Preview"
                  style={{
                    transform: `scale(${receiptZoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="max-h-[60vh] w-auto max-w-full object-contain mx-auto rounded-lg shadow-xl block"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReceipt(null);
                    setReceiptZoom(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </RoleGuard>
  );
}
