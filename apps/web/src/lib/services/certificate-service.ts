import { supabase } from '@/lib/supabase/client';

export interface CertificateData {
  id: string;
  certificateCode: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issuedAt: string;
  pdfUrl?: string;
}

export class CertificateService {
  /**
   * 1. Claim / Issue a Verifiable Course Completion Certificate
   */
  static async claimCertificate(
    studentId: string,
    courseId: string
  ): Promise<{ success: boolean; certificate?: CertificateData; error?: string }> {
    try {
      // 1. Check if certificate already exists
      const { data: existing } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_code,
          student_id,
          course_id,
          pdf_url,
          issued_at,
          profiles:student_id (full_name),
          courses:course_id (title, teacher:teacher_id (full_name))
        `)
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existing) {
        return {
          success: true,
          certificate: {
            id: existing.id,
            certificateCode: existing.certificate_code,
            studentId: existing.student_id,
            studentName: (existing.profiles as any)?.full_name || 'Academic Scholar',
            courseId: existing.course_id,
            courseTitle: (existing.courses as any)?.title || 'Masterclass Program',
            instructorName: (existing.courses as any)?.teacher?.full_name || 'Prof. Dr. Arshad Mahmood',
            issuedAt: existing.issued_at,
            pdfUrl: existing.pdf_url,
          },
        };
      }

      // 2. Generate a unique verifiable certificate code (e.g. PA-2026-89412)
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const code = `PA-2026-${randomDigits}`;

      // 3. Insert new certificate
      const { data: inserted, error: insertError } = await supabase
        .from('certificates')
        .insert({
          student_id: studentId,
          course_id: courseId,
          certificate_code: code,
          pdf_url: `/verify-certificate/${code}`,
        })
        .select(`
          id,
          certificate_code,
          student_id,
          course_id,
          pdf_url,
          issued_at,
          profiles:student_id (full_name),
          courses:course_id (title, teacher:teacher_id (full_name))
        `)
        .single();

      if (insertError) throw insertError;

      return {
        success: true,
        certificate: {
          id: inserted.id,
          certificateCode: inserted.certificate_code,
          studentId: inserted.student_id,
          studentName: (inserted.profiles as any)?.full_name || 'Academic Scholar',
          courseId: inserted.course_id,
          courseTitle: (inserted.courses as any)?.title || 'Masterclass Program',
          instructorName: (inserted.courses as any)?.teacher?.full_name || 'Prof. Dr. Arshad Mahmood',
          issuedAt: inserted.issued_at,
          pdfUrl: inserted.pdf_url,
        },
      };
    } catch (err: any) {
      console.error('Failed to issue certificate:', err);
      return { success: false, error: err?.message || 'Certificate generation failed' };
    }
  }

  /**
   * 2. Verify Certificate by Code (Public Verification Endpoint)
   */
  static async verifyCertificate(
    code: string
  ): Promise<{ valid: boolean; certificate?: CertificateData; error?: string }> {
    try {
      const cleanCode = code.trim().toUpperCase();
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_code,
          student_id,
          course_id,
          pdf_url,
          issued_at,
          profiles:student_id (full_name),
          courses:course_id (title, teacher:teacher_id (full_name))
        `)
        .eq('certificate_code', cleanCode)
        .maybeSingle();

      if (error || !data) {
        return { valid: false, error: 'Certificate code not found in official registry.' };
      }

      return {
        valid: true,
        certificate: {
          id: data.id,
          certificateCode: data.certificate_code,
          studentId: data.student_id,
          studentName: (data.profiles as any)?.full_name || 'Academic Scholar',
          courseId: data.course_id,
          courseTitle: (data.courses as any)?.title || 'Masterclass Program',
          instructorName: (data.courses as any)?.teacher?.full_name || 'Prof. Dr. Arshad Mahmood',
          issuedAt: data.issued_at,
          pdfUrl: data.pdf_url,
        },
      };
    } catch (err: any) {
      return { valid: false, error: err?.message || 'Verification lookup failed' };
    }
  }
}
