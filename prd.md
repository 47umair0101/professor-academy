# Product Requirements Document (PRD): Professor Academy

**Project Name:** Professor Academy  
**Document Version:** 2.0.0 (Modular Step-by-Step Edition)  
**Target Platforms:** Web Application (Next.js) & Cross-Platform Mobile Application (React Native / Expo)  
**Primary Market & Currency:** Pakistan (`PKR`)  
**Execution Model:** Strict Module-by-Module Delivery with User Preview Gates & Continuous GitHub Sync  
**Engineering Standard:** Senior Production Grade (Scalable to $10,000+$ active users)

---

## 1. Executive Summary & Vision

**Professor Academy** is a full-stack, multi-platform Learning Management System (LMS) and Academic Portal built for Web (Next.js) and Mobile (React Native / Expo). It replaces legacy WordPress/LearnDash setups with a custom-engineered architecture powered by a shared Supabase backend, role-based access control (**Student**, **Teacher**, **Admin**), manual localized fee verification (**Bank Transfer, JazzCash, Easypaisa**), interactive multi-format courses (Recorded Video + Rich Text), hybrid AI/Manual quizzes, a dedicated **Past Papers** repository, and **Google Gemini AI** capabilities across all user workflows.

---

## 2. Strict Step-by-Step Modular Execution & Reporting Protocol (CRITICAL FOR AI)

> **STOP — DO NOT BUILD THIS PROJECT IN ONE GO!**  
> You must build **Professor Academy** strictly **one module at a time** (10 Modules total). You are forbidden from writing code for the next module until the user has previewed, tested, and approved the current module.

### 2.1 GitHub Repository & Version Control Workflow
1. **Repository Initialization (Module 1):**
   - Initialize Git in the project root (`git init`).
   - Create a clean `.gitignore` (strictly excluding `.env`, `.env.local`, `node_modules`, `.next`, `.expo`, and build artifacts).
   - Connect to or create a GitHub repository on the user's GitHub account (via GitHub CLI `gh repo create professor-academy --private --source=. --remote=origin` or by asking the user for their GitHub repo URL if not authenticated).
2. **Continuous Module Pushing:**
   - Make small, focused commits with descriptive messages (e.g., `feat(auth): implement student signup and split-screen login`).
   - At the end of each module (after smoke tests pass), push the code to GitHub (`git push -u origin main`).
3. **Live `PROGRESS.md` Tracker:**
   - Maintain a `PROGRESS.md` file in the root of the repository and update it after every module so both the user and AI always know the exact project state.

### 2.2 Mandatory Pre-Module & Post-Module Communication Rules
- **Before Starting Any Module:**
  - State a brief 4–5 line execution plan explaining which files and features you are about to build in the current module, and ask if anything is unclear.
- **After Completing Any Module (Mandatory Short Report Format):**
  Every time a module is finished and smoke-tested, you **MUST** pause and present this exact short report to the user:

  ```markdown
  ### 📊 Module Completion Report
  - **Active Module Completed:** Module [X] — [Module Title]
  - **What Was Built:**
    - [Concise bullet 1]
    - [Concise bullet 2]
    - [Concise bullet 3]
  - **Smoke Test & Quality Status:** ✅ Build Passed | ✅ Typecheck Passed | ✅ Module Smoke Tests Passed
  - **GitHub Sync Status:** ✅ Committed & pushed to `origin/main` (Commit: `[short-hash]`)
  - **How You Can Preview & Test Right Now:**
    - **URL / Screen:** `http://localhost:3000/[route]`
    - **Test Actions / Credentials:** [Exact steps for the user to verify]
  - **Overall Project Progress:**
    - **Completed:** `[X] / 10 Modules ([X0]%)`
    - **Pending:** `[10 - X] / 10 Modules`
    - **Next Up:** `Module [X + 1] — [Next Module Title]`

  ❓ **Your Approval Needed:** Please preview this module. Everything is organized and within flow. Should I start working on **Module [X + 1]** now, or would you like any changes in Module [X]?
  ```

---

## 3. Core Engineering & Quality Directives

1. **Security First:**
   - Validate all inputs on client and server using shared `Zod` schemas.
   - Never hardcode secrets; use environment variables (`.env`) and maintain `.env.example`.
   - Protect against SQL Injection, XSS (sanitize rich text HTML via `DOMPurify`), CSRF, and unauthorized access.
   - Enforce strict Row-Level Security (RLS) in PostgreSQL and server-side RBAC middleware (`STUDENT`, `TEACHER`, `ADMIN`).
   - Serve private payment receipts and protected course files via time-limited Signed URLs.
2. **Reliability & Error Handling:**
   - Handle all edge cases gracefully with clear, helpful messages for users and structured logs for developers.
3. **Performance & Scale ($10,000+$ Concurrent Users):**
   - Use normalized tables, composite PostgreSQL indexes, cursor/indexed pagination, and smart caching (`TanStack Query` + Next.js caching) so nothing breaks at $10,000+$ users.
4. **Code Quality & Reusability:**
   - Write clean, modular, strict TypeScript (`strict: true`) with meaningful names, short comments, and a clean folder structure.
   - **Zero Shortcuts:** No placeholder stubs, fake timers, or temporary hacks.
   - **Reusability (DRY):** Build reusable UI components, hooks, and utilities. Check whether something similar already exists before creating something new, and refactor instead of duplicating.
5. **Smoke Testing & Full Feature Testing:**
   - Run **Smoke Tests** first after every module (app boot, DB connection, route render, auth guard check) and write automated tests for every flow, action, and failure edge case. Never delete or skip a failing test—fix the code.

---

## 4. Finalized Tech Stack (100% Free-First & Best-in-Class Architecture)

Every tool in this stack is chosen to maximize developer velocity, code sharing between Web and Mobile, and **$0/month free-tier operation** while supporting effortless scaling:

| Layer | Best-in-Class Choice | Why It Is Best & Free-First |
| :--- | :--- | :--- |
| **Monorepo Architecture** | **Turborepo + `pnpm` workspaces** | Shares `Zod` schemas, TypeScript types, API logic, and color tokens across Web & Mobile without duplication. |
| **Web Application** | **Next.js 15 (App Router, TypeScript, Tailwind CSS)** | Industry standard, fast SSR/ISR, deploys free on Vercel. |
| **Mobile Application** | **React Native (Expo SDK + Expo Router + NativeWind)** | Uses the exact same Tailwind styling mental model as Next.js; builds for Android & iOS from one codebase. |
| **Backend, Auth & DB** | **Supabase (PostgreSQL + Auth + Realtime)** | Generous free tier ($500\text{MB}$ Postgres DB, $50,000$ monthly active users, built-in JWT Auth, RLS security, and Realtime in-app alerts). |
| **Type-Safe ORM / Queries** | **Supabase JS Client + TypeGen (or Drizzle ORM)** | Zero-cost, rock-solid TypeScript auto-completion directly from PostgreSQL schema. |
| **File & Media Storage** | **Supabase Storage + Cloudflare R2 (Free Tier)** | Supabase Storage ($1\text{GB}$ free) + Cloudflare R2 ($10\text{GB}$/month free with **zero egress/bandwidth fees**) for Fee Receipts, Past Papers PDFs, and Course Media. |
| **Video Hosting** | **Priority 1: YouTube Unlisted Embed**<br>**Priority 2: Cloudflare R2 / Bunny Stream** | YouTube Unlisted gives $100\%$ free unlimited HD video hosting with custom player wrapper; R2/Bunny provides low-cost direct video streaming when needed. |
| **Rich Text Course Editor** | **Tiptap (Headless Editor)** | $100\%$ free, extensible, supports LaTeX math, tables, media embeds, and custom Gemini AI toolbar buttons. |
| **Transactional Emails** | **Resend (Free Tier) + Nodemailer (Gmail/SMTP fallback)** | Resend gives $3,000$ free emails/month; Nodemailer SMTP provides an unlimited free fallback for Quiz & Fee verification emails. |
| **Mobile Push Alerts** | **Expo Push Notifications** | $100\%$ free push notifications for Android and iOS. |
| **AI Engine** | **Google Gemini API (`@google/genai`)** | `gemini-2.5-flash` offers a generous free tier for AI Quiz Grading, Receipt OCR, Quiz Generation, and Student Tutoring; `gemini-2.5-flash-image` powers teacher illustration generation. |
| **PDF Certificates** | **`@react-pdf/renderer` or `pdf-lib`** | Generates verifiable completion certificates $100\%$ free in-memory without paid third-party PDF APIs. |

---

## 5. Design System & UI/UX Architecture (Strict Anti-"Vibe-Coded" Mandate)

The UI must look like an authoritative, prestigious, motivating academy—**never** like an AI-generated or "vibe-coded" template.

### 5.1 Anti-AI-Slop Rules
- **NO** neon purple/blue/pink gradients, glowing buttons, random glassmorphism, or cluttered fake charts.
- **YES** to editorial academic typography, generous warm-cream reading surfaces, crisp $1\text{px}$ structural borders, and consistent spacing.

### 5.2 Color Tokens (Shared Across Web & Mobile)
- **Primary Brand (Academic Navy):** `#1A2451` (Hover/Deep: `#111838`) — Navigation, headers, primary buttons, active states.
- **Secondary Accent (Heritage Gold):** `#C59B27` — Progress bars, badges, certificate seals, key highlights.
- **Secondary Soft Accent (Rose-Gold Tint):** `#B8868B` — Subtle decorative tags and secondary highlights.
- **Background Primary (Warm Cream):** `#FAF9F6` — Main page/screen canvas for comfortable long reading sessions.
- **Surface / Card Background:** `#FFFFFF` with `#E5E3DC` ($1\text{px}$ solid border).
- **Text Primary (Charcoal Ink):** `#222222` | **Text Secondary (Academic Slate):** `#5A6072`.
- **Semantic Status Colors:**
  - Success (Emerald): `#15803D` (`bg: #DCFCE7`)
  - Warning (Amber): `#B45309` (`bg: #FEF3C7`)
  - Danger (Crimson): `#B91C1C` (`bg: #FEE2E2`)

### 5.3 Typography & Layout
- **Headings:** `Poppins` (SemiBold `600`, Bold `700`)
- **Body & UI:** `Inter` (Regular `400`, Medium `500`, SemiBold `600`)
- **Monospace (Timers, PKR Fees, TIDs):** `JetBrains Mono`
- **Container & Grid:** `1200px` max container width on Web, `20px`–`24px` card gap, `10px` border radius.

---

## 6. Core Functional Requirements Summary

1. **Roles on Web & Mobile:** `STUDENT`, `TEACHER`, and `ADMIN` supported on both Next.js and React Native.
2. **Student Flow:**
   - **Free Sign Up & Login.**
   - Browse courses, read full **Course Description** and **Eligibility Criteria / Prerequisites** to decide if the course fits them.
   - Enroll by transferring fee (`PKR`) via **Bank Transfer, JazzCash, or Easypaisa**, entering Transaction ID, and uploading receipt screenshot.
   - Access unlocked courses after Admin verification, watch video lectures, read rich-text lessons, ask questions in **Topic Discussion Comments**, take timed quizzes, browse **Past Papers**, and download **Completion Certificates**.
3. **Teacher Flow:**
   - Account created exclusively by Admin from backend.
   - Create courses, sections, and lessons (Video embeds/uploads + Rich Text Editor with **Gemini AI Text & Image Generator**).
   - Course publishing respects Admin's **"Direct Course Publish"** toggle (live immediately if enabled, or sent to Admin approval queue if disabled).
   - Create quizzes with Single Choice, Multiple Choice, True/False, Fill-in-Blanks, and **Written Q/A** formats, plus **Quiz Expiry Time Enable/Disable toggle**.
   - Grade Written Q/A answers using **Gemini AI Auto-Grading** or **Manual Teacher Grading**.
   - Automatic **In-App + Email Notification** sent to enrolled students when a quiz is published; teachers can also send custom course notifications.
   - View enrolled students list and **Course Sales Figures Widget** (backed by an $80\%$ Teacher / $20\%$ Platform split in the database for future payouts).
4. **Admin Flow (Superuser):**
   - Provision Teacher accounts and toggle **Direct Course Publish** (globally or per teacher).
   - **Fee Verification Queue:** Inspect student fee screenshots (assisted by **Gemini Vision OCR**), verify Transaction IDs, and Approve/Reject to unlock courses.
   - Moderate all topic comments (reply or delete), manage full Student list, and manage the **Past Papers** repository.

---

## 7. Database Schema Blueprint (PostgreSQL / Supabase)

```sql
-- Core Enums
CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE course_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE lesson_type AS ENUM ('VIDEO', 'TEXT', 'MIXED');
CREATE TYPE enrollment_status AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'REJECTED', 'REVOKED');
CREATE TYPE payment_method AS ENUM ('BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA');
CREATE TYPE question_type AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'WRITTEN_QA');
CREATE TYPE grading_mode AS ENUM ('AUTO_AI', 'MANUAL_TEACHER', 'HYBRID_AI_TEACHER');

-- 1. Profiles (Extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'STUDENT',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  can_direct_publish BOOLEAN DEFAULT NULL,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 80.00, -- 80% Teacher / 20% Platform
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Platform Settings (Single Row Config controlled by Admin)
CREATE TABLE platform_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  allow_teacher_direct_publish BOOLEAN NOT NULL DEFAULT FALSE,
  bank_details JSONB NOT NULL,
  jazzcash_details JSONB NOT NULL,
  easypaisa_details JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Courses, Sections & Lessons
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
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

CREATE TABLE course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
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

-- 4. Enrollments & Fee Verification Receipts (80/20 Split)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
  payment_method payment_method NOT NULL,
  transaction_id TEXT NOT NULL,
  amount_paid_pkr NUMERIC(10,2) NOT NULL,
  teacher_share_pkr NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_share_pkr NUMERIC(10,2) NOT NULL DEFAULT 0,
  receipt_url TEXT NOT NULL,
  ai_ocr_metadata JSONB DEFAULT '{}'::jsonb,
  admin_notes TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 5. Lesson Progress & Topic Discussion Comments
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

CREATE TABLE lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES lesson_comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_pinned_answer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Quizzes, Questions, Attempts & Answers
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
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

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type question_type NOT NULL,
  prompt TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer JSONB,
  points NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  total_score NUMERIC(6,2) DEFAULT 0,
  max_score NUMERIC(6,2) NOT NULL,
  percentage NUMERIC(5,2) DEFAULT 0,
  is_passed BOOLEAN DEFAULT FALSE,
  grading_status TEXT NOT NULL DEFAULT 'COMPLETED'
);

CREATE TABLE quiz_attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  student_response JSONB NOT NULL,
  points_awarded NUMERIC(5,2) DEFAULT 0,
  ai_feedback TEXT,
  teacher_feedback TEXT,
  graded_by_teacher_id UUID REFERENCES profiles(id),
  is_graded BOOLEAN NOT NULL DEFAULT FALSE
);

-- 7. Notifications, Past Papers & Certificates
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE past_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  exam_body TEXT NOT NULL,
  exam_year INT NOT NULL,
  subject TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  pdf_url TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Indexes for 10,000+ Concurrent Users
CREATE INDEX idx_courses_status_category ON courses(status, category);
CREATE INDEX idx_enrollments_student_status ON enrollments(student_id, status);
CREATE INDEX idx_enrollments_status_created ON enrollments(status, created_at DESC);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, sort_order);
CREATE INDEX idx_comments_lesson_created ON lesson_comments(lesson_id, created_at ASC);
CREATE INDEX idx_notifications_recipient_unread ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX idx_past_papers_filters ON past_papers(exam_body, exam_year DESC, subject);
```

---

## 8. The 10 Step-by-Step Modules (Strict Sequential Roadmap)

> **RULE:** Complete **one module**, run its **Smoke Tests**, push to **GitHub**, show the **Short Progress Report + Preview Instructions**, and **WAIT** for user approval before starting the next module.

### Module 1: GitHub Repo Setup, Monorepo Foundation & Design System Showcase
- **Scope:**
  - Initialize Git, create/link the GitHub repository, and create `PROGRESS.md` and `README.md`.
  - Set up Turborepo (`apps/web`, `apps/mobile`, `packages/shared`).
  - Configure the Academic Navy (`#1A2451`), Heritage Gold (`#C59B27`), and Warm Cream (`#FAF9F6`) theme + `Poppins`, `Inter`, and `JetBrains Mono` fonts.
  - Build core reusable UI components (Buttons, Inputs, Badges, Cards, Modals, Data Tables, Navbar, Footer) and render them on a live `/design-preview` route.
- **Smoke Test & User Preview Gate:** User previews `/design-preview` to verify the UI looks prestigious, academic, and 100% free of "vibe-coded" AI patterns.

### Module 2: Database Schema, Supabase Auth & Role-Based Login / Sign Up
- **Scope:**
  - Deploy the PostgreSQL schema, RLS policies, and seed initial test accounts (`admin@professoracademy.pk`, `teacher@professoracademy.pk`, `student@professoracademy.pk`).
  - Build the Split-Screen **Sign Up** page (`/signup` — free student registration), **Login** page (`/login`), and **Forgot/Reset Password** flow (`/forgot-password`).
  - Implement Role-Based Access Control (RBAC) middleware redirecting logged-in users to `/student/dashboard`, `/teacher/dashboard`, or `/admin/dashboard`.
- **Smoke Test & User Preview Gate:** User tests signing up as a new student, logging in with all 3 roles, and verifying unauthorized route protection.

### Module 3: Public Website, Course Catalog (with Eligibility Criteria) & Past Papers Vault
- **Scope:**
  - Build Public **Home Page** (Hero, Live Stats, Featured Programs, Testimonials, CTA), **About Page**, and **Contact Page**.
  - Build **Course Catalog** (`/courses`) with search/category filters and **Single Course Detail Page** (`/courses/[slug]`) showcasing full description, curriculum preview, fee in `PKR`, and **Eligibility Criteria** ("Is this course right for me?").
  - Build **Past Papers Directory** (`/past-papers`) with instant filtering by **Exam Body**, **Year**, and **Subject**, plus PDF preview/download.
- **Smoke Test & User Preview Gate:** User browses the public pages, inspects a course's eligibility criteria, and filters/downloads a Past Paper.

### Module 4: Admin Portal — Part 1 (Executive Dashboard, Teacher Creation & Governance)
- **Scope:**
  - Build **Admin Dashboard** (`/admin/dashboard`) with platform KPIs and revenue summaries.
  - Build **Teacher Management** (`/admin/teachers`): Admin creates Teacher accounts from the backend and sets commission split (default $80\%$).
  - Build **Platform Governance Settings**: Global and per-teacher toggle to **Enable/Disable Direct Course Publishing by Teachers**, plus the **Course Approval Queue**.
  - Build **Admin Past Papers CRUD** (`/admin/past-papers`) and **Student Directory** (`/admin/students`).
- **Smoke Test & User Preview Gate:** User logs in as Admin, creates a Teacher account, toggles Direct Course Publish, and uploads a Past Paper.

### Module 5: Teacher Portal — Part 1 (Course Builder, Rich Text Editor & Gemini AI Co-Pilot)
- **Scope:**
  - Build **Teacher Dashboard** (`/teacher/dashboard`) featuring enrolled student widgets and the **Course Sales Figures Widget** (showing verified sales and the $80/20$ split record).
  - Build **Course & Curriculum Builder** (`/teacher/courses`): Create courses, sections, and lessons supporting **YouTube Unlisted Embeds**, **Cloudflare R2 Video Uploads**, and **Tiptap Rich Text Articles**.
  - Integrate **Gemini AI Co-Pilot & Image Generator** inside the rich text editor so teachers can generate custom diagrams/illustrations (`gemini-2.5-flash-image`) and refine lesson text (`gemini-2.5-flash`).
- **Smoke Test & User Preview Gate:** User logs in as Teacher, creates a video + rich-text course, generates an AI illustration inside the editor, and tests publishing.

### Module 6: Student Enrollment, Manual Fee Payment (Bank/JazzCash/Easypaisa) & Admin Verification
- **Scope:**
  - Build **Student Enrollment & Fee Payment Screen** (`/courses/[slug]/enroll`): Displays Bank Transfer, JazzCash, and Easypaisa account details, accepts Transaction ID + Receipt Screenshot upload.
  - Integrate **Gemini Vision Receipt OCR** (`gemini-2.5-flash`) to automatically read TID and amount from the uploaded receipt image and flag duplicate TIDs.
  - Build **Admin Fee Verification Queue** (`/admin/fee-verifications`): Side-by-side receipt viewer, One-Click Approve (unlocks course + logs $80\%$ Teacher / $20\%$ Platform revenue split + sends Email/In-App alert) or Reject with reason.
  - Build **Student Fee / Order History Page** (`/student/fees`).
- **Smoke Test & User Preview Gate:** User uploads a test JazzCash/Bank receipt as a Student, then logs in as Admin to verify it and confirm the course unlocks.

### Module 7: Student Dashboard, Course Player, Topic Discussions & AI Study Tutor
- **Scope:**
  - Build **Student Dashboard** (`/student/dashboard`) with active courses, progress bars, and notifications feed.
  - Build **Course Learning Player** (`/student/courses/[slug]/learn`): Video player + formatted reading view + automatic lesson completion tracking.
  - Build **Topic-Level Discussion Comments** under every lesson (Students ask questions, Teachers reply with `Instructor` badge, Admin can reply to or delete any comment).
  - Integrate **Gemini AI Contextual Study Tutor** drawer on lesson pages and **Verifiable PDF Certificate** generation upon $100\%$ course completion.
- **Smoke Test & User Preview Gate:** User watches a lesson, posts/moderates a topic comment, asks the AI Tutor a question, and previews a generated certificate.

### Module 8: Quiz Engine, Hybrid AI/Manual Grading & Multi-Channel Notifications
- **Scope:**
  - Build **Teacher Quiz Builder** (`/teacher/quizzes`): Supports Single Choice, Multiple Choice, True/False, Fill-in-Blanks, and **Written Q/A** formats, plus Time Limit, Attempts, Passing $\%$, **One-Click AI Quiz Generator**, and **Quiz Expiry Time Enable/Disable Toggle**.
  - Build **Automated Notification Dispatcher**: Publishing a quiz triggers both an **In-App Realtime Notification** and an **Email Notification** (via Resend/SMTP) to enrolled students. Teachers can also send custom course notifications.
  - Build **Student Timed Quiz Player** with live countdown timer and **Hybrid Grading System** (instant objective scoring + **Gemini AI Written Q/A Grader** + **Manual Teacher Grading Queue**).
- **Smoke Test & User Preview Gate:** User publishes a quiz as Teacher, verifies the email/in-app notification, takes the quiz as Student, and tests both AI and manual grading of written answers.

### Module 9: React Native (Expo) Mobile App — Student, Teacher & Admin Experience
- **Scope:**
  - Build the cross-platform **React Native (Expo + NativeWind)** mobile app inside `apps/mobile` sharing `packages/shared` schemas and Supabase backend.
  - Implement Mobile Auth, **Student Mobile Experience** (Dashboard, Video/Text Course Player, Camera/Gallery Fee Receipt Upload, Timed Quizzes, Topic Comments, Past Papers), **Teacher Mobile Experience** (Sales & Student Stats, Q&A Replies, Written Quiz Grading, Course Notifications), and **Admin Mobile Experience** (Mobile Fee Verification Queue, Comment Moderation, Teacher/Course Toggles).
- **Smoke Test & User Preview Gate:** User previews the mobile app via Expo Go / Web-Mobile Simulator across Student, Teacher, and Admin roles.

### Module 10: Full End-to-End Testing, Security Audit & Final Production Handover
- **Scope:**
  - Execute comprehensive unit, integration, and E2E test suites across all 10 modules (including failure and unauthorized access cases).
  - Perform final security audit (RLS policies, input sanitization, signed URLs, index performance for $10,000+$ users).
  - Finalize `README.md` and `PROGRESS.md` ($10/10$ Modules Complete) and push the production-ready release tag to GitHub.