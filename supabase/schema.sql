-- ====================================================================
-- PROFESSOR ACADEMY - POSTGRESQL / SUPABASE PRODUCTION DATABASE SCHEMA
-- Version: 2.0.0
-- Scale: Production-ready for 10,000+ Concurrent Students
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE course_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lesson_type AS ENUM ('VIDEO', 'TEXT', 'MIXED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'REJECTED', 'REVOKED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'WRITTEN_QA');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE grading_mode AS ENUM ('AUTO_AI', 'MANUAL_TEACHER', 'HYBRID_AI_TEACHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'STUDENT',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  program TEXT,
  avatar_url TEXT,
  bio TEXT,
  can_direct_publish BOOLEAN DEFAULT NULL, -- NULL means defer to platform_settings default
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 80.00, -- 80% Teacher / 20% Platform
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PLATFORM SETTINGS (Single Row Configuration)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  allow_teacher_direct_publish BOOLEAN NOT NULL DEFAULT FALSE,
  bank_details JSONB NOT NULL DEFAULT '{
    "bank_name": "Meezan Bank Limited",
    "account_title": "Professor Academy (Pvt) Ltd",
    "account_number": "0101-0105432198",
    "iban": "PK42MEZN0001010105432198",
    "branch_code": "0101"
  }'::jsonb,
  jazzcash_details JSONB NOT NULL DEFAULT '{
    "account_title": "Professor Academy",
    "account_number": "0300-1234567",
    "till_id": "7654321"
  }'::jsonb,
  easypaisa_details JSONB NOT NULL DEFAULT '{
    "account_title": "Professor Academy",
    "account_number": "0345-9876543"
  }'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. COURSES, SECTIONS & LESSONS
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  price_pkr NUMERIC(10,2) NOT NULL DEFAULT 0,
  status course_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  lesson_type lesson_type NOT NULL DEFAULT 'TEXT',
  content_html TEXT,
  video_url TEXT,
  video_duration_seconds INT DEFAULT 0,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_free_preview BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ENROLLMENTS & FEE VERIFICATIONS (80/20 Split)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
  payment_method payment_method NOT NULL,
  transaction_id TEXT NOT NULL,
  amount_paid_pkr NUMERIC(10,2) NOT NULL,
  teacher_share_pkr NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_share_pkr NUMERIC(10,2) NOT NULL DEFAULT 0,
  receipt_url TEXT NOT NULL,
  ai_ocr_metadata JSONB DEFAULT '{}'::jsonb,
  admin_notes TEXT,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 7. PROGRESS & COMMENTS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_pinned_answer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. QUIZZES, QUESTIONS, ATTEMPTS & ANSWERS
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INT NOT NULL DEFAULT 45,
  attempts_allowed INT NOT NULL DEFAULT 1,
  passing_percentage NUMERIC(5,2) NOT NULL DEFAULT 50.00,
  randomize_questions BOOLEAN NOT NULL DEFAULT TRUE,
  has_expiry BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  written_grading_mode grading_mode NOT NULL DEFAULT 'HYBRID_AI_TEACHER',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_type question_type NOT NULL,
  prompt TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer JSONB,
  points NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  total_score NUMERIC(6,2) DEFAULT 0,
  max_score NUMERIC(6,2) NOT NULL,
  percentage NUMERIC(5,2) DEFAULT 0,
  is_passed BOOLEAN DEFAULT FALSE,
  grading_status TEXT NOT NULL DEFAULT 'COMPLETED'
);

CREATE TABLE IF NOT EXISTS public.quiz_attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  student_response JSONB NOT NULL,
  points_awarded NUMERIC(5,2) DEFAULT 0,
  ai_feedback TEXT,
  teacher_feedback TEXT,
  graded_by_teacher_id UUID REFERENCES public.profiles(id),
  is_graded BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. NOTIFICATIONS, PAST PAPERS & CERTIFICATES
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.past_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  exam_body TEXT NOT NULL,
  exam_year INT NOT NULL,
  subject TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  pdf_url TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 10. COMPOSITE INDEXES FOR HIGH-TRAFFIC SCALE (10,000+ Concurrent Students)
CREATE INDEX IF NOT EXISTS idx_courses_status_category ON public.courses(status, category);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_status ON public.enrollments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_status_created ON public.enrollments(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON public.lessons(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_comments_lesson_created ON public.lesson_comments(lesson_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON public.notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_past_papers_filters ON public.past_papers(exam_body, exam_year DESC, subject);

-- 11. ROW-LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses Policies
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
  FOR SELECT USING (status = 'PUBLISHED' OR auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can insert and update their own courses" ON public.courses;
CREATE POLICY "Teachers can insert and update their own courses" ON public.courses
  FOR ALL USING (auth.uid() = teacher_id);

-- Enrollments Policies
DROP POLICY IF EXISTS "Students can view their own enrollments" ON public.enrollments;
CREATE POLICY "Students can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can create enrollment requests" ON public.enrollments;
CREATE POLICY "Students can create enrollment requests" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Past Papers Policies
DROP POLICY IF EXISTS "Past papers are viewable by everyone" ON public.past_papers;
CREATE POLICY "Past papers are viewable by everyone" ON public.past_papers
  FOR SELECT USING (true);

-- 12. AUTOMATIC PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, city, program)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'STUDENT'::user_role),
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'program'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed Default Platform Settings
INSERT INTO public.platform_settings (id, allow_teacher_direct_publish)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;
