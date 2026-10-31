/**
 * Professor Academy - Core Domain Types & Enums
 * Aligned with PostgreSQL / Supabase Schema (PRD Section 7)
 */

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type LessonType = 'VIDEO' | 'TEXT' | 'MIXED';

export type EnrollmentStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED' | 'REVOKED';

export type PaymentMethod = 'BANK_TRANSFER' | 'JAZZCASH' | 'EASYPAISA';

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'FILL_BLANK'
  | 'WRITTEN_QA';

export type GradingMode = 'AUTO_AI' | 'MANUAL_TEACHER' | 'HYBRID_AI_TEACHER';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  can_direct_publish?: boolean | null;
  commission_rate: number; // e.g. 80.00 (80% teacher / 20% platform)
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformSettings {
  id: number;
  allow_teacher_direct_publish: boolean;
  bank_details: {
    bank_name: string;
    account_title: string;
    account_number: string;
    iban: string;
    branch_code?: string;
  };
  jazzcash_details: {
    account_title: string;
    account_number: string;
    till_id?: string;
  };
  easypaisa_details: {
    account_title: string;
    account_number: string;
  };
  updated_at: string;
}

export interface Course {
  id: string;
  teacher_id: string;
  teacher?: Profile;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  eligibility_criteria: string;
  category: string;
  thumbnail_url?: string | null;
  price_pkr: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
  sections_count?: number;
  lessons_count?: number;
  enrolled_count?: number;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  section_id: string;
  course_id: string;
  title: string;
  lesson_type: LessonType;
  content_html?: string | null;
  video_url?: string | null;
  video_duration_seconds?: number;
  attachments?: Array<{ name: string; url: string; size_bytes?: number }>;
  is_free_preview: boolean;
  sort_order: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  student?: Profile;
  course_id: string;
  course?: Course;
  status: EnrollmentStatus;
  payment_method: PaymentMethod;
  transaction_id: string;
  amount_paid_pkr: number;
  teacher_share_pkr: number;
  platform_share_pkr: number;
  receipt_url: string;
  ai_ocr_metadata?: {
    extracted_amount?: number;
    extracted_tid?: string;
    confidence_score?: number;
    notes?: string;
  };
  admin_notes?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  progress_percentage: number;
  completed_at?: string | null;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  student_id: string;
  course_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface LessonComment {
  id: string;
  lesson_id: string;
  user_id: string;
  user?: Profile;
  parent_comment_id?: string | null;
  body: string;
  is_pinned_answer: boolean;
  replies?: LessonComment[];
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id?: string | null;
  title: string;
  description?: string | null;
  time_limit_minutes: number;
  attempts_allowed: number;
  passing_percentage: number;
  randomize_questions: boolean;
  has_expiry: boolean;
  expires_at?: string | null;
  written_grading_mode: GradingMode;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_type: QuestionType;
  prompt: string;
  options?: Array<{ id: string; label: string; text: string }>;
  correct_answer?: unknown;
  points: number;
  sort_order: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  quiz?: Quiz;
  student_id: string;
  started_at: string;
  submitted_at?: string | null;
  total_score?: number;
  max_score: number;
  percentage?: number;
  is_passed?: boolean;
  grading_status: 'IN_PROGRESS' | 'NEEDS_GRADING' | 'COMPLETED';
}

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id?: string | null;
  course_id?: string | null;
  title: string;
  message: string;
  type: 'ENROLLMENT_VERIFIED' | 'ENROLLMENT_REJECTED' | 'QUIZ_PUBLISHED' | 'DISCUSSION_REPLY' | 'SYSTEM';
  link_url?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PastPaper {
  id: string;
  title: string;
  exam_body: string;
  exam_year: number;
  subject: string;
  file_url: string;
  uploaded_by?: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_code: string;
  student_id: string;
  course_id: string;
  pdf_url: string;
  issued_at: string;
}
