'use client';

import * as React from 'react';
import { Award, ShieldCheck, Printer, Check, Copy, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AcademicCertificateProps {
  studentName: string;
  courseTitle: string;
  certificateCode: string;
  issuedAt: string;
  instructorName?: string;
  onClose?: () => void;
}

export const AcademicCertificate: React.FC<AcademicCertificateProps> = ({
  studentName,
  courseTitle,
  certificateCode,
  issuedAt,
  instructorName = 'Prof. Dr. Arshad Mahmood',
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const formattedDate = new Date(issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify-certificate/${certificateCode}`
    : `https://professoracademy.pk/verify-certificate/${certificateCode}`;

  const handlePrint = () => {
    window.print();
  };

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl print:hidden text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Verifiable Academic Credential</span>
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
            {certificateCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={copyVerifyLink}>
            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            <span>{copied ? 'Link Copied!' : 'Copy Verify URL'}</span>
          </Button>

          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5 mr-1" />
            <span>Print / Save as PDF</span>
          </Button>
        </div>
      </div>

      {/* Official Certificate Visual Document */}
      <div
        id="academic-certificate-document"
        className="relative bg-white text-slate-900 border-[10px] border-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl overflow-hidden print:border-[8px] print:shadow-none print:m-0 print:p-8"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #FAFAFA 0%, #FFFFFF 100%)',
        }}
      >
        {/* Ornate Inner Double Border */}
        <div className="border-2 border-amber-500/80 p-6 sm:p-8 rounded-xl relative">
          {/* Corner Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600" />

          {/* Certificate Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-brand-indigo text-white flex items-center justify-center font-bold text-lg shadow-md">
                PA
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
                PROFESSOR ONLINE ACADEMY
              </span>
            </div>
            <p className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-500 font-semibold font-mono">
              Academic Council & National Accreditation Registry • Pakistan
            </p>
          </div>

          <div className="my-6 border-b border-amber-200" />

          {/* Title */}
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
              Certificate of Academic Mastery
            </span>
            <p className="text-xs text-slate-500 italic pt-2">
              This is to officially and unconditionally certify that
            </p>
          </div>

          {/* Recipient Student Name */}
          <div className="text-center my-6">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-indigo font-serif underline decoration-amber-500/60 decoration-2 underline-offset-8">
              {studentName}
            </h1>
          </div>

          {/* Statement */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              has satisfactorily completed 100% of the prescribed academic lectures, clinical past paper drills, conceptual problem sets, and curriculum requirements for:
            </p>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 py-1">
              "{courseTitle}"
            </h2>
            <p className="text-[11px] text-slate-500">
              Demonstrating comprehensive proficiency and verified competency in all curriculum units.
            </p>
          </div>

          {/* Signatures & Seal Grid */}
          <div className="grid grid-cols-3 items-end gap-4 mt-10 pt-6 border-t border-slate-200 text-center">
            {/* Left: Instructor Signature */}
            <div className="space-y-1 text-left sm:text-center">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-base sm:text-lg text-brand-indigo font-bold">
                  {instructorName}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-800">{instructorName}</p>
              <p className="text-[10px] text-slate-500">Course Lead & Faculty Chairman</p>
            </div>

            {/* Middle: Gold Official Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-lg flex items-center justify-center text-white">
                <div className="h-full w-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center p-1 text-center">
                  <Award className="h-6 w-6 stroke-[2.2]" />
                  <span className="text-[7px] font-bold uppercase tracking-tighter leading-tight mt-0.5">
                    Verified Seal
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-bold font-mono text-amber-800 mt-1">OFFICIAL AUDIT</span>
            </div>

            {/* Right: Director General Signature */}
            <div className="space-y-1 text-right sm:text-center">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-base sm:text-lg text-slate-800 font-bold">
                  Dr. Qasim Farooq
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-800">Dr. Qasim Farooq</p>
              <p className="text-[10px] text-slate-500">Director General Academic Standards</p>
            </div>
          </div>

          {/* Certificate Footer Metadata */}
          <div className="mt-8 pt-4 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
            <div>
              <span>Issued On: </span>
              <strong className="text-slate-800">{formattedDate}</strong>
            </div>
            <div>
              <span>Certificate ID: </span>
              <strong className="text-brand-indigo">{certificateCode}</strong>
            </div>
            <div>
              <span>Verification URL: </span>
              <span className="underline text-slate-600">{verifyUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
