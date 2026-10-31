'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  EnrollmentService,
  type VerificationQueueItem,
} from '@/lib/services/enrollment-service';
import { formatPKR, type EnrollmentStatus } from '@professor-academy/shared';
import {
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
  User,
  GraduationCap,
  ExternalLink,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

export default function AdminFeeVerificationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = React.useState<
    'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED' | 'ALL'
  >('PENDING_VERIFICATION');
  const [queue, setQueue] = React.useState<VerificationQueueItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Selected item for side-by-side inspection
  const [inspectItem, setInspectItem] = React.useState<VerificationQueueItem | null>(null);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [actionInProgress, setActionInProgress] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const data = await EnrollmentService.getVerificationQueue(activeTab);
    setQueue(data);
    setLoading(false);
  }, [activeTab]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (item: VerificationQueueItem) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to approve payment of PKR ${item.amountPaidPkr.toLocaleString()} (TID: ${item.transactionId}) for ${item.studentName}? This will unlock the course and log 80% to faculty.`)) {
      return;
    }

    setActionInProgress(true);
    const res = await EnrollmentService.approveVerification(
      item.id,
      user.id,
      'Approved by Executive Administrator via Portal'
    );
    setActionInProgress(false);

    if (res.success) {
      if (inspectItem?.id === item.id) setInspectItem(null);
      loadData();
    } else {
      alert(`Approval error: ${res.error}`);
    }
  };

  const handleConfirmReject = async () => {
    if (!user || !inspectItem) return;
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection so the student can rectify.');
      return;
    }

    setActionInProgress(true);
    const res = await EnrollmentService.rejectVerification(
      inspectItem.id,
      user.id,
      rejectReason.trim()
    );
    setActionInProgress(false);

    if (res.success) {
      setRejectModalOpen(false);
      setInspectItem(null);
      setRejectReason('');
      loadData();
    } else {
      alert(`Rejection error: ${res.error}`);
    }
  };

  const filtered = queue.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-indigo transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Executive Admin Dashboard</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-indigo bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Superuser Portal Governance</span>
            </span>
          </div>

          {/* Header Title */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Financial Compliance & Admission Queue</span>
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">
                Fee Verification & Receipt Audit Queue
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify Pakistani student bank & wallet receipts, unlock courses, and automate 80% teacher / 20% platform splits.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Tab Navigation & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex rounded-xl bg-white p-1 border border-slate-200 text-xs font-semibold shadow-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('PENDING_VERIFICATION')}
                className={cn(
                  'py-2 px-4 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'PENDING_VERIFICATION'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Pending Verification
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ACTIVE')}
                className={cn(
                  'py-2 px-4 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'ACTIVE'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Approved & Unlocked
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REJECTED')}
                className={cn(
                  'py-2 px-4 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'REJECTED'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Rejected Receipts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={cn(
                  'py-2 px-4 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'ALL'
                    ? 'bg-slate-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                All Records
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search student, course, TID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo shadow-xs"
              />
            </div>
          </div>

          {/* Table of Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                Loading verification records from database...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {activeTab === 'PENDING_VERIFICATION'
                    ? 'Queue is Clear! All pending receipts verified.'
                    : 'No records found for this filter.'}
                </h3>
                <p className="text-xs text-slate-500">
                  New student fee submissions via Bank Transfer, JazzCash, or Easypaisa will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">TID / Method</th>
                      <th className="py-3 px-4">Amount (PKR)</th>
                      <th className="py-3 px-4">80/20 Split</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((item) => {
                      const isPending = item.status === 'PENDING_VERIFICATION';
                      const isActive = item.status === 'ACTIVE';
                      const isRejected = item.status === 'REJECTED';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{item.studentName}</div>
                            <div className="text-[11px] text-slate-400">{item.studentEmail}</div>
                            {item.studentPhone && (
                              <div className="text-[10px] text-slate-400 font-mono">{item.studentPhone}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 max-w-[200px]">
                            <div className="font-bold text-slate-800 truncate" title={item.courseTitle}>
                              {item.courseTitle}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Fee: {formatPKR(item.coursePrice)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-slate-900">{item.transactionId}</div>
                            <span className="text-[10px] text-slate-500 font-sans font-semibold">
                              {item.paymentMethod}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {formatPKR(item.amountPaidPkr)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-[11px]">
                            <div className="text-emerald-700 font-bold font-mono">
                              80%: {formatPKR(item.teacherSharePkr)}
                            </div>
                            <div className="text-slate-400 font-mono">
                              20%: {formatPKR(item.platformSharePkr)}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="h-3 w-3" />
                                <span>Pending</span>
                              </span>
                            )}
                            {isActive && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <Check className="h-3 w-3" />
                                <span>Approved</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                <X className="h-3 w-3" />
                                <span>Rejected</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Inspect Receipt Modal Trigger */}
                              <button
                                type="button"
                                onClick={() => setInspectItem(item)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                                title="Inspect Receipt & AI Audit"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Inspect</span>
                              </button>

                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(item)}
                                    disabled={actionInProgress}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs disabled:opacity-50"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Approve</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setInspectItem(item);
                                      setRejectModalOpen(true);
                                    }}
                                    disabled={actionInProgress}
                                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs disabled:opacity-50"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ================= MODAL: SIDE-BY-SIDE RECEIPT INSPECTOR ================= */}
        {inspectItem && !rejectModalOpen && (
          <Modal
            isOpen={!!inspectItem}
            onClose={() => setInspectItem(null)}
            title={`Payment Receipt Audit - TID: ${inspectItem.transactionId}`}
            maxWidth="xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
              {/* Left Column: Receipt Screenshot Image (7 Cols) */}
              <div className="md:col-span-7 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Uploaded Payment Screenshot</span>
                  <span className="text-[11px] font-mono">{inspectItem.paymentMethod}</span>
                </div>

                <div className="aspect-video max-h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center shadow-inner">
                  <img
                    src={inspectItem.receiptUrl}
                    alt="Receipt Screenshot"
                    className="w-full h-full object-contain"
                  />
                </div>

                {inspectItem.aiOcrMetadata && (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-brand-indigo">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Gemini Vision AI Audit Record</span>
                      </span>
                      <span className="font-mono text-[11px]">
                        Confidence: {inspectItem.aiOcrMetadata.confidenceScore || 90}%
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {inspectItem.aiOcrMetadata.rawSummary || 'Parsed via automated OCR.'}
                    </p>
                    {inspectItem.aiOcrMetadata.dateTime && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        Extracted Timestamp: {inspectItem.aiOcrMetadata.dateTime}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Transaction & Student Ledger (5 Cols) */}
              <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Student Profile
                    </p>
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{inspectItem.studentName}</span>
                      <span className="text-slate-500 text-[11px]">{inspectItem.studentEmail}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Course & Payable Amount
                    </p>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block line-clamp-2">
                        {inspectItem.courseTitle}
                      </span>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 font-mono">
                        <span className="text-slate-500">Transferred:</span>
                        <span className="font-extrabold text-emerald-700 text-sm">
                          {formatPKR(inspectItem.amountPaidPkr)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Calculated 80/20 Payout
                    </p>
                    <div className="space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Teacher Cut (80%):</span>
                        <span className="font-bold text-emerald-700">{formatPKR(inspectItem.teacherSharePkr)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Platform Cut (20%):</span>
                        <span className="font-bold text-slate-600">{formatPKR(inspectItem.platformSharePkr)}</span>
                      </div>
                    </div>
                  </div>

                  {inspectItem.adminNotes && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>Admin Notes:</strong> {inspectItem.adminNotes}
                    </div>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                  {inspectItem.status === 'PENDING_VERIFICATION' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(inspectItem)}
                        disabled={actionInProgress}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve & Unlock</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRejectModalOpen(true)}
                        disabled={actionInProgress}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject with Reason</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setInspectItem(null)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Close Inspector
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* ================= MODAL: REJECT CONFIRMATION ================= */}
        {rejectModalOpen && inspectItem && (
          <Modal
            isOpen={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            title="Reject Fee Verification"
            maxWidth="sm"
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                You are about to reject the fee submission for <strong>{inspectItem.studentName}</strong> (TID: {inspectItem.transactionId}).
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Transaction ID not found in bank statement, screenshot cropped/illegible, or transfer amount does not match fee..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={actionInProgress}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionInProgress && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </RoleGuard>
  );
}
