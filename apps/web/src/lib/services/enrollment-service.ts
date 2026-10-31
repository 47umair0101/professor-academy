import { supabase } from '@/lib/supabase/client';
import {
  type PaymentMethod,
  type EnrollmentStatus,
  type Enrollment,
  type Course,
  type Profile,
} from '@professor-academy/shared';

export interface SubmitEnrollmentInput {
  studentId: string;
  courseId: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amountPaidPkr: number;
  receiptUrl: string;
  aiOcrMetadata?: any;
}

export interface VerificationQueueItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string | null;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  coursePrice: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amountPaidPkr: number;
  teacherSharePkr: number;
  platformSharePkr: number;
  receiptUrl: string;
  status: EnrollmentStatus;
  aiOcrMetadata?: any;
  adminNotes?: string | null;
  createdAt: string;
}

export class EnrollmentService {
  /**
   * 1. Submit an enrollment with fee receipt
   */
  static async submitEnrollment(input: SubmitEnrollmentInput): Promise<{
    success: boolean;
    enrollmentId?: string;
    error?: string;
  }> {
    try {
      const cleanTid = input.transactionId.trim();

      // Ensure valid course UUID mapping for legacy/mock slugs
      let targetCourseId = input.courseId;
      if (targetCourseId === 'c-1') targetCourseId = '10000000-0000-0000-0000-000000000001';
      if (targetCourseId === 'c-2') targetCourseId = '10000000-0000-0000-0000-000000000002';
      if (targetCourseId === 'c-3') targetCourseId = '10000000-0000-0000-0000-000000000003';
      if (targetCourseId === 'c-4') targetCourseId = '10000000-0000-0000-0000-000000000004';
      if (targetCourseId === 'c-5') targetCourseId = '10000000-0000-0000-0000-000000000005';
      if (targetCourseId === 'c-6') targetCourseId = '10000000-0000-0000-0000-000000000006';

      // Ensure student profile exists in public.profiles (safeguard for student accounts)
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', input.studentId)
        .maybeSingle();

      if (!profileCheck) {
        await supabase.from('profiles').insert({
          id: input.studentId,
          full_name: 'Student Account',
          email: `student-${input.studentId.slice(0, 8)}@professoracademy.pk`,
          role: 'STUDENT',
          commission_rate: 80,
          is_active: true,
        });
      }

      // Check if student already enrolled in this course
      const { data: existingStudentEnrollment } = await supabase
        .from('enrollments')
        .select('id, status, transaction_id')
        .eq('student_id', input.studentId)
        .eq('course_id', targetCourseId)
        .maybeSingle();

      if (existingStudentEnrollment) {
        if (existingStudentEnrollment.status === 'ACTIVE') {
          return {
            success: false,
            error: 'You are already actively enrolled in this course!',
          };
        }
        if (existingStudentEnrollment.status === 'PENDING_VERIFICATION') {
          // Update the pending submission with the new receipt / TID
          const { error: updateError } = await supabase
            .from('enrollments')
            .update({
              payment_method: input.paymentMethod,
              transaction_id: cleanTid,
              amount_paid_pkr: input.amountPaidPkr,
              receipt_url: input.receiptUrl,
              ai_ocr_metadata: input.aiOcrMetadata || {},
              admin_notes: null,
            })
            .eq('id', existingStudentEnrollment.id);

          if (updateError) {
            console.error('Failed to update pending enrollment:', updateError.message, updateError.details);
            return { success: false, error: updateError.message };
          }

          return { success: true, enrollmentId: existingStudentEnrollment.id };
        }
      }

      // Check if transaction ID has already been submitted by someone else
      const { data: existingTid } = await supabase
        .from('enrollments')
        .select('id, student_id')
        .eq('transaction_id', cleanTid)
        .maybeSingle();

      if (existingTid && existingTid.student_id !== input.studentId) {
        return {
          success: false,
          error:
            'This Transaction ID has already been submitted in the system. Duplicate receipts will be rejected.',
        };
      }

      // Compute tentative 80/20 shares (finalized upon verification)
      const teacherShare = Math.round(input.amountPaidPkr * 0.8);
      const platformShare = input.amountPaidPkr - teacherShare;

      const { data: inserted, error: insertError } = await supabase
        .from('enrollments')
        .insert({
          student_id: input.studentId,
          course_id: targetCourseId,
          status: 'PENDING_VERIFICATION',
          payment_method: input.paymentMethod,
          transaction_id: cleanTid,
          amount_paid_pkr: input.amountPaidPkr,
          teacher_share_pkr: teacherShare,
          platform_share_pkr: platformShare,
          receipt_url: input.receiptUrl,
          ai_ocr_metadata: input.aiOcrMetadata || {},
        })
        .select('id')
        .single();

      if (insertError) {
        console.error(
          'Insert enrollment error:',
          insertError.message,
          insertError.details,
          insertError.hint,
          insertError.code
        );
        return { success: false, error: insertError.message };
      }

      // Create notification for student (best effort)
      try {
        await supabase.from('notifications').insert({
          recipient_id: input.studentId,
          title: 'Fee Receipt Submitted for Verification',
          message: `Your payment receipt (TID: ${cleanTid}) of PKR ${input.amountPaidPkr.toLocaleString()} has been received. Our administration will verify it within 1-2 hours to unlock your course.`,
          type: 'FEE_SUBMITTED',
          link_url: '/student/fees',
          course_id: targetCourseId,
        });
      } catch (notifErr) {
        console.warn('Notification insert skipped:', notifErr);
      }

      return { success: true, enrollmentId: inserted.id };
    } catch (err: any) {
      console.error('submitEnrollment exception:', err);
      return { success: false, error: err?.message || 'Failed to submit enrollment request.' };
    }
  }

  /**
   * 2. Get Student's Enrollment Status for a specific course
   */
  static async getEnrollmentForCourse(
    studentId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error || !data) return null;
      return data as Enrollment;
    } catch {
      return null;
    }
  }

  /**
   * 3. Get Student's Fee & Enrollment History (`/student/fees`)
   */
  static async getStudentEnrollmentHistory(studentId: string): Promise<
    Array<{
      enrollment: Enrollment;
      course: Course;
    }>
  > {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses (
            id,
            title,
            slug,
            category,
            thumbnail_url,
            price_pkr,
            teacher_id
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((item: any) => ({
        enrollment: item as Enrollment,
        course: item.course as Course,
      }));
    } catch (err) {
      console.error('getStudentEnrollmentHistory error:', err);
      return [];
    }
  }

  /**
   * 4. Get Admin Fee Verification Queue (`/admin/fee-verifications`)
   */
  static async getVerificationQueue(
    statusFilter: 'ALL' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED' = 'PENDING_VERIFICATION'
  ): Promise<VerificationQueueItem[]> {
    try {
      let query = supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          course_id,
          status,
          payment_method,
          transaction_id,
          amount_paid_pkr,
          teacher_share_pkr,
          platform_share_pkr,
          receipt_url,
          ai_ocr_metadata,
          admin_notes,
          created_at,
          student:profiles!enrollments_student_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          course:courses!enrollments_course_id_fkey (
            id,
            title,
            slug,
            price_pkr,
            teacher_id
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('getVerificationQueue query error:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        studentId: row.student_id,
        studentName: row.student?.full_name || 'Student Account',
        studentEmail: row.student?.email || 'student@professoracademy.pk',
        studentPhone: row.student?.phone || null,
        courseId: row.course_id,
        courseTitle: row.course?.title || 'Academic Course',
        courseSlug: row.course?.slug || '',
        coursePrice: Number(row.course?.price_pkr || row.amount_paid_pkr),
        paymentMethod: row.payment_method,
        transactionId: row.transaction_id,
        amountPaidPkr: Number(row.amount_paid_pkr),
        teacherSharePkr: Number(row.teacher_share_pkr),
        platformSharePkr: Number(row.platform_share_pkr),
        receiptUrl: row.receipt_url,
        status: row.status,
        aiOcrMetadata: row.ai_ocr_metadata,
        adminNotes: row.admin_notes,
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.error('getVerificationQueue exception:', err);
      return [];
    }
  }

  /**
   * 5. Approve Fee Verification (Unlocks course + logs 80/20 split + notifies student)
   */
  static async approveVerification(
    enrollmentId: string,
    adminId: string,
    adminNotes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Fetch enrollment details
      const { data: enrollment, error: fetchErr } = await supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          course_id,
          amount_paid_pkr,
          transaction_id,
          course:courses (
            id,
            title,
            price_pkr,
            teacher_id
          )
        `)
        .eq('id', enrollmentId)
        .single();

      if (fetchErr || !enrollment) {
        return { success: false, error: 'Enrollment record not found.' };
      }

      const courseTitle = (enrollment.course as any)?.title || 'Course';
      const amount = Number(enrollment.amount_paid_pkr);
      const teacherShare = Math.round(amount * 0.8);
      const platformShare = amount - teacherShare;

      // Update enrollment to ACTIVE
      const { error: updateErr } = await supabase
        .from('enrollments')
        .update({
          status: 'ACTIVE',
          teacher_share_pkr: teacherShare,
          platform_share_pkr: platformShare,
          verified_by: adminId,
          verified_at: new Date().toISOString(),
          admin_notes: adminNotes || 'Verified by Executive Administrator',
        })
        .eq('id', enrollmentId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // Send In-App notification to student
      await supabase.from('notifications').insert({
        recipient_id: enrollment.student_id,
        title: `Payment Verified: ${courseTitle}`,
        message: `Your payment receipt of PKR ${amount.toLocaleString()} (TID: ${enrollment.transaction_id}) has been approved! The course is now fully unlocked. Happy learning!`,
        type: 'FEE_APPROVED',
        link_url: `/student/dashboard`,
        course_id: enrollment.course_id,
      });

      return { success: true };
    } catch (err: any) {
      console.error('approveVerification error:', err);
      return { success: false, error: err?.message || 'Failed to approve enrollment.' };
    }
  }

  /**
   * 6. Reject Fee Verification (Sets status REJECTED + notifies student with reason)
   */
  static async rejectVerification(
    enrollmentId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: enrollment, error: fetchErr } = await supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          course_id,
          transaction_id,
          course:courses (
            id,
            title
          )
        `)
        .eq('id', enrollmentId)
        .single();

      if (fetchErr || !enrollment) {
        return { success: false, error: 'Enrollment record not found.' };
      }

      const courseTitle = (enrollment.course as any)?.title || 'Course';

      const { error: updateErr } = await supabase
        .from('enrollments')
        .update({
          status: 'REJECTED',
          verified_by: adminId,
          verified_at: new Date().toISOString(),
          admin_notes: reason,
        })
        .eq('id', enrollmentId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // Send rejection notification to student
      await supabase.from('notifications').insert({
        recipient_id: enrollment.student_id,
        title: `Payment Verification Rejected: ${courseTitle}`,
        message: `Your payment submission (TID: ${enrollment.transaction_id}) could not be verified. Reason: "${reason}". Please visit your Fee History page to upload a clear official receipt.`,
        type: 'FEE_REJECTED',
        link_url: `/student/fees`,
        course_id: enrollment.course_id,
      });

      return { success: true };
    } catch (err: any) {
      console.error('rejectVerification error:', err);
      return { success: false, error: err?.message || 'Failed to reject enrollment.' };
    }
  }
}
