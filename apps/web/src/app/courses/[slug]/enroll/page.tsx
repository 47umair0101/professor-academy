'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleGuard } from '@/components/auth/role-guard';
import { CourseCatalogService } from '@/lib/services/course-catalog-service';
import { EnrollmentService } from '@/lib/services/enrollment-service';
import { formatPKR, type PaymentMethod } from '@professor-academy/shared';
import type { CourseData } from '@/lib/data/courses-data';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  Sparkles,
  AlertTriangle,
  FileText,
  Clock,
  Loader2,
  Building2,
  Smartphone,
  CreditCard,
  X,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';

export default function CourseEnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params?.slug as string;

  const [course, setCourse] = React.useState<CourseData | null>(null);
  const [loadingCourse, setLoadingCourse] = React.useState(true);

  // Form states
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>('JAZZCASH');
  const [transactionId, setTransactionId] = React.useState('');
  const [amountPaid, setAmountPaid] = React.useState<number>(0);
  const [receiptBase64, setReceiptBase64] = React.useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Gemini Vision OCR state
  const [isScanningReceipt, setIsScanningReceipt] = React.useState(false);
  const [ocrMetadata, setOcrMetadata] = React.useState<any | null>(null);
  const [duplicateWarning, setDuplicateWarning] = React.useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load course details
  React.useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoadingCourse(true);
      const data = await CourseCatalogService.getCourseBySlug(slug);
      if (data) {
        setCourse(data);
        setAmountPaid(data.pricePkr);
      }
      setLoadingCourse(false);
    }
    load();
  }, [slug]);

  // Copy to clipboard helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handle receipt image upload & trigger Gemini Vision OCR
  const handleReceiptUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid receipt screenshot (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Receipt image must be smaller than 10MB.');
      return;
    }

    setReceiptFileName(file.name);
    setDuplicateWarning(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setReceiptBase64(dataUrl);

      // Trigger Gemini Vision Receipt OCR
      setIsScanningReceipt(true);
      try {
        const response = await fetch('/api/ai/receipt-ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            mimeType: file.type,
          }),
        });

        const resData = await response.json();
        if (resData.success && resData.data) {
          const ocr = resData.data;
          setOcrMetadata(ocr);

          // Autofill extracted TID
          if (ocr.transactionId && !transactionId) {
            setTransactionId(ocr.transactionId);
          }

          // Autofill extracted amount if verified
          if (ocr.amountPkr) {
            setAmountPaid(ocr.amountPkr);
          }

          // Autofill payment method
          if (ocr.paymentMethod && ['BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA'].includes(ocr.paymentMethod)) {
            setSelectedMethod(ocr.paymentMethod as PaymentMethod);
          }

          // Flag duplicate TID warning
          if (ocr.isDuplicateTid) {
            setDuplicateWarning(ocr.duplicateMessage);
          }
        }
      } catch (err) {
        console.error('OCR scan failed:', err);
      } finally {
        setIsScanningReceipt(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or create an account to enroll.');
      router.push(`/login?redirect=/courses/${slug}/enroll`);
      return;
    }
    if (!course) return;

    if (!transactionId.trim()) {
      setSubmitError('Please provide a valid Transaction ID (TID) from your payment receipt.');
      return;
    }

    if (!receiptBase64) {
      setSubmitError('Please upload a screenshot of your bank or mobile wallet receipt.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const res = await EnrollmentService.submitEnrollment({
      studentId: user.id,
      courseId: course.id,
      paymentMethod: selectedMethod,
      transactionId: transactionId.trim(),
      amountPaidPkr: amountPaid,
      receiptUrl: receiptBase64,
      aiOcrMetadata: ocrMetadata,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setSubmitError(res.error || 'Failed to submit enrollment.');
      return;
    }

    setSuccessModalOpen(true);
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading course checkout...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Course Not Found</h2>
          <p className="text-sm text-slate-600 mb-5">
            The course you are attempting to enroll in could not be located.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-indigo text-white text-sm font-bold shadow-sm"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-indigo transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Course Details</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Direct Pakistani Bank & Wallet Portal</span>
          </span>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Course Admission & Fee Payment
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Transfer the course fee to any official account below, then upload your payment screenshot for instant 1-2 hour manual verification.
          </p>
        </div>

        {/* ================= COURSE SUMMARY CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80'}
              alt={course.title}
              className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-xl border border-slate-200 shrink-0 shadow-xs"
            />
            <div>
              <span className="text-[11px] font-bold text-brand-indigo uppercase tracking-wider">
                {course.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                {course.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instructor: <span className="font-semibold text-slate-700">{course.instructor?.name || 'Senior Academic Faculty'}</span>
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
            <span className="text-xs text-slate-500 font-medium">Payable Fee:</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
              {formatPKR(course.pricePkr)}
            </span>
          </div>
        </div>

        {/* ================= OFFICIAL PAYMENT ACCOUNTS CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Official Academy Receiving Accounts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transfer via your mobile banking app, JazzCash app, or Easypaisa app.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Account 1: Meezan Bank */}
            <div
              onClick={() => setSelectedMethod('BANK_TRANSFER')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer relative',
                selectedMethod === 'BANK_TRANSFER'
                  ? 'border-brand-indigo bg-indigo-50/50 ring-2 ring-brand-indigo/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <Building2 className="h-4 w-4 text-brand-indigo" />
                  <span>Meezan Bank Limited</span>
                </span>
                {selectedMethod === 'BANK_TRANSFER' && (
                  <CheckCircle2 className="h-4 w-4 text-brand-indigo" />
                )}
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Account Title</span>
                  <span className="font-semibold text-slate-800">Professor Online Academy</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Account No.</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">02010108543219</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('02010108543219', 'meezan_acc');
                      }}
                      className="text-brand-indigo hover:text-brand-indigoHover p-1"
                      title="Copy Account Number"
                    >
                      {copiedKey === 'meezan_acc' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">IBAN</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-800 truncate">PK42MEZN0002010108543219</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('PK42MEZN0002010108543219', 'meezan_iban');
                      }}
                      className="text-brand-indigo hover:text-brand-indigoHover p-1"
                      title="Copy IBAN"
                    >
                      {copiedKey === 'meezan_iban' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account 2: JazzCash */}
            <div
              onClick={() => setSelectedMethod('JAZZCASH')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer relative',
                selectedMethod === 'JAZZCASH'
                  ? 'border-brand-indigo bg-indigo-50/50 ring-2 ring-brand-indigo/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900">
                  <Smartphone className="h-4 w-4 text-rose-600" />
                  <span>JazzCash Merchant</span>
                </span>
                {selectedMethod === 'JAZZCASH' && (
                  <CheckCircle2 className="h-4 w-4 text-brand-indigo" />
                )}
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Account Title</span>
                  <span className="font-semibold text-slate-800">Professor Online Academy</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">0300-1234567</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('03001234567', 'jazz_num');
                      }}
                      className="text-brand-indigo hover:text-brand-indigoHover p-1"
                      title="Copy Mobile Number"
                    >
                      {copiedKey === 'jazz_num' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Till ID (Scan QR)</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-800">7654321</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('7654321', 'jazz_till');
                      }}
                      className="text-brand-indigo hover:text-brand-indigoHover p-1"
                      title="Copy Till ID"
                    >
                      {copiedKey === 'jazz_till' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account 3: Easypaisa */}
            <div
              onClick={() => setSelectedMethod('EASYPAISA')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer relative',
                selectedMethod === 'EASYPAISA'
                  ? 'border-brand-indigo bg-indigo-50/50 ring-2 ring-brand-indigo/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span>Easypaisa Merchant</span>
                </span>
                {selectedMethod === 'EASYPAISA' && (
                  <CheckCircle2 className="h-4 w-4 text-brand-indigo" />
                )}
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Account Title</span>
                  <span className="font-semibold text-slate-800">Professor Online Academy</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">0345-9876543</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('03459876543', 'easy_num');
                      }}
                      className="text-brand-indigo hover:text-brand-indigoHover p-1"
                      title="Copy Mobile Number"
                    >
                      {copiedKey === 'easy_num' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Verification Speed</span>
                  <span className="text-[11px] font-semibold text-emerald-700">Immediate (1-2 Hours)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= VERIFICATION FORM CARD ================= */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Step 2: Submit Fee Verification Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your payment screenshot. Our Gemini AI Vision Assistant will automatically read your Transaction ID.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Step 2 of 2</span>
          </div>

          {/* Duplicate TID Warning */}
          {duplicateWarning && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Duplicate Transaction Detected</p>
                <p className="mt-0.5">{duplicateWarning}</p>
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {submitError}
            </div>
          )}

          {/* Receipt Screenshot Upload Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Payment Receipt Screenshot <span className="text-rose-500">*</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-indigo">
                <Sparkles className="h-3 w-3 text-brand-indigo" />
                <span>Powered by Gemini Vision OCR</span>
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleReceiptUpload(file);
              }}
            />

            {!receiptBase64 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-brand-indigo/70 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-2 group"
              >
                <div className="p-3.5 bg-brand-indigo/10 text-brand-indigo rounded-full transition-transform group-hover:scale-110">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-brand-indigo hover:underline">
                    Click to upload receipt screenshot
                  </span>{' '}
                  <span className="text-slate-600">or drag and drop here</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Take a clear screenshot from JazzCash, Easypaisa, or your Bank App (PNG, JPG, WebP up to 10MB).
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-brand-indigo shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {receiptFileName || 'Receipt Screenshot'}
                    </span>
                    {isScanningReceipt ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Gemini Vision Scanning...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="h-3 w-3" />
                        <span>OCR Verified</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setReceiptBase64(null);
                      setReceiptFileName(null);
                      setOcrMetadata(null);
                      setDuplicateWarning(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Remove Receipt"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="aspect-video max-h-56 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                  <img
                    src={receiptBase64}
                    alt="Receipt Preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                {ocrMetadata && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-brand-indigo">
                      <span>✨ Gemini OCR Detection</span>
                      <span className="font-mono text-[11px]">Confidence: {ocrMetadata.confidenceScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {ocrMetadata.rawSummary || 'Successfully extracted transaction details.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Fields: TID & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Transaction ID (TID / TRX ID) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. JC-9823412093 or 0201085432"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the exact reference number from your SMS or receipt.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount Transferred (PKR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">PKR</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Must match the payable course fee ({formatPKR(course.pricePkr)}).
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-indigo shrink-0" />
              <span>Verifications are processed by Admin within 1-2 hours.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isScanningReceipt}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Fee Receipt...</span>
                </>
              ) : (
                <>
                  <span>Submit for Verification</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => router.push('/student/fees')}
        title="Payment Submitted Successfully!"
        maxWidth="md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-heading">
              Receipt Queued for Verification
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Your admission request for <strong className="text-slate-800">{course.title}</strong> has been logged with Transaction ID <code className="font-mono text-brand-indigo font-bold">{transactionId}</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Course:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{course.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold font-mono text-emerald-700">{formatPKR(amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="font-semibold text-slate-800">{selectedMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                PENDING VERIFICATION
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push('/student/fees')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Track in Fee History
            </button>
            <button
              type="button"
              onClick={() => router.push(`/courses/${slug}`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              Back to Course
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
