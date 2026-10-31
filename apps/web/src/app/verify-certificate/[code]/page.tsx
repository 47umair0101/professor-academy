'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CertificateService, type CertificateData } from '@/lib/services/certificate-service';
import { AcademicCertificate } from '@/components/certificate/academic-certificate';
import { ShieldCheck, XCircle, Loader2, ArrowLeft, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = (params?.code as string) || '';

  const [loading, setLoading] = React.useState(true);
  const [cert, setCert] = React.useState<CertificateData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!code) return;
    setLoading(true);
    CertificateService.verifyCertificate(code).then((res) => {
      setLoading(false);
      if (res.valid && res.certificate) {
        setCert(res.certificate);
      } else {
        setError(res.error || 'Certificate not found in registry.');
      }
    });
  }, [code]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <Loader2 className="h-10 w-10 text-brand-indigo animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Verifying Academic Credential...</h2>
            <p className="text-xs text-slate-500 font-mono">Querying official registry for: {code}</p>
          </div>
        ) : error || !cert ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Credential Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              We could not find a verified certificate matching the code <strong className="font-mono text-slate-900">{code}</strong> in the Professor Online Academy official database.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button variant="secondary" size="md">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Return to Academy Home</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base sm:text-lg text-emerald-950">
                      Verified Genuine Credential
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      AUTHENTIC
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    This credential was officially granted by Professor Online Academy upon verified 100% curriculum completion.
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right font-mono text-xs text-emerald-900">
                <span>Registry Code: </span>
                <strong className="block text-sm">{cert.certificateCode}</strong>
              </div>
            </div>

            {/* Render Certificate Visual */}
            <AcademicCertificate
              studentName={cert.studentName}
              courseTitle={cert.courseTitle}
              certificateCode={cert.certificateCode}
              issuedAt={cert.issuedAt}
              instructorName={cert.instructorName}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
