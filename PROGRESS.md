# Professor Academy — Development Progress Tracker

**Target Architecture:** Monorepo (Turborepo + pnpm workspaces)  
**Apps:** `apps/web` (Next.js 15 App Router), `apps/mobile` (React Native Expo + NativeWind)  
**Packages:** `packages/shared` (Types, Zod schemas, constants, tokens), `packages/ui` (Shared design components)  
**GitHub Repository:** [https://github.com/47umair0101/professor-academy](https://github.com/47umair0101/professor-academy)  
**Status:** In Progress (Module 3 Completed, Module 4 Ready)

---

## 📌 Overall Module Roadmap (10 Modules Total)

| # | Module | Scope / Key Deliverables | Status | Smoke Tests | Git Commit |
|---|---|---|---|---|---|
| **1** | **Monorepo Foundation & Design System Showcase** | Turborepo setup, Academic palette, core UI library, `/design-preview` route | ✅ Completed | ✅ All Passed | `52d06ea` / `9a0b0dc` |
| **2** | **Database Schema & Supabase Auth** | PostgreSQL schema, RLS, Seed data, Split-Screen Login/Signup/Forgot-Password, RBAC | ✅ Completed | ✅ All Passed | `7a15961` |
| **3** | **Public Website, Course Catalog & Past Papers Vault** | Home, About, Contact, Course Catalog with Eligibility Criteria, Past Papers PDF Vault | ✅ Completed | ✅ All Passed | `22329a1` |
| **4** | **Admin Portal: Dashboard, Teachers & Direct Publish** | Admin KPIs, Teacher provisioning, Commission rate (80/20), Direct publish toggle | ✅ Completed | ✅ All Passed | `ffda176` |
| **5** | **Teacher Portal: Course Builder & Gemini AI Co-Pilot** | Course/Curriculum Builder, Tiptap academic editor with image upload, thumbnail file uploader & presets, Gemini AI Co-Pilot | ✅ Completed | ✅ All Passed | `5fdced7` / `740715f` |
| **6** | **Student Enrollment & Local Fee Verification Queue** | Bank Transfer/JazzCash/Easypaisa payment, Gemini Vision OCR receipt scanner, Admin verification queue, Student fee history | ✅ Completed | ✅ All Passed | `Pending Push` |
| **7** | **Student Dashboard, Course Player & AI Study Tutor** | Video + rich reading player, Topic discussions, Gemini AI contextual tutor, PDF certificates | ⚪ Pending | ⚪ Pending | - |
| **8** | **Quiz Engine, Hybrid Grading & Notifications** | Timed Quiz player, Written Q/A AI+Manual grading, In-App + Email (Resend/SMTP) notifications | ⚪ Pending | ⚪ Pending | - |
| **9** | **React Native (Expo) Mobile App** | Cross-platform Student, Teacher & Admin mobile experience with NativeWind | ⚪ Pending | ⚪ Pending | - |
| **10** | **E2E Testing, Security Audit & Final Handover** | Full test suite, RLS verification, 10,000+ scale check, production documentation | ⚪ Pending | ⚪ Pending | - |

---

## 🕒 Module 1 Changelog & Details
- Initialized Git repository on `main` branch.
- Created root `.gitignore`, `.env.example`, and Turborepo configuration (`pnpm-workspace.yaml`, `turbo.json`, root `package.json`).
- Established shared packages (`packages/shared` for tokens, constants, and Zod schemas).
- Setup Next.js 15 App Router web application in `apps/web`.
- Elevated and modernized the design system beyond legacy platforms (Udemy):
  - Deep Obsidian Slate (`#0F172A`) for high-contrast primary authority
  - Signature Electric Royal Indigo (`#4F46E5`) for modern focus & interaction
  - Amber Gold (`#D97706`) for verified achievements & bestseller badges
  - Crisp White cards (`#FFFFFF`) with subtle slate borders (`#E2E8F0`) and smooth modern elevation
  - Inter & JetBrains Mono typography with zero external build-time network dependencies
- Built modern component library:
  - High-Yield `CourseCard` with 16:9 thumbnail, verified instructor mark, ratings, PKR pricing, and dedicated **Eligibility Criteria Snippet**
  - Buttons (Indigo primary, Obsidian dark, bordered secondary, outline, ghost, danger) with active scale press states
  - Badges, Form Controls (Inputs, Selects, Textareas, FormField)
  - Accessible Modal Dialog & Administrative Fee Verification Data Table
  - Modern floating-feel Navbar with Command-K search bar & quick Role Simulator
  - Dark Slate Footer with Pakistani payment method badges (Meezan, JazzCash, Easypaisa)
- Deployed interactive showcase at `/design-preview` and homepage at `/`.

---

## 🕒 Module 2 Changelog & Details
- Created complete PostgreSQL / Supabase production schema in `supabase/schema.sql` (enums, `profiles`, `courses`, `lessons`, `enrollments`, `quizzes`, `notifications`, `past_papers`, `certificates`, composite indexes for 10,000+ scale, RLS policies, and auto profile creation trigger).
- Configured Supabase SSR client utilities in `apps/web/src/lib/supabase/` (`client.ts` and `server.ts`).
- Built central `AuthProvider` and `useAuth()` hook in `apps/web/src/lib/auth/auth-context.tsx` with session persistence, role routing, and seed test accounts.
- Built Pixel-Perfect Split-Screen Authentication matching user's custom designs:
  - **Login Page (`/login`):** "Professor Online ACADEMY" branding, custom student illustration with progress card, floating white login card, "Remember me", "Forgot password?", 1-click Demo Account filler for Student/Teacher/Admin, and secure login notice.
  - **Sign Up Page (`/signup`):** Full student registration (Full Name, Email, Pakistani Phone Number, City, Program Selector, Password, Confirm Password, Terms Agreement checkbox).
  - **Forgot Password Page (`/forgot-password`):** Password reset request flow with success feedback and back to login link.
- Implemented Role-Based Access Control (RBAC) via `<RoleGuard>`:
  - **Student Dashboard (`/student/dashboard`):** Unified modern layout matching user's custom designs with fixed viewport sidebar, pinned bottom logout, interactive profile dropdown, and notification tabs.
  - **Teacher Dashboard (`/teacher/dashboard`):** Modern faculty console with course management, Gemini AI co-pilot preview, student Q&A threads, and 80/20 revenue breakdown in PKR.
  - **Admin Dashboard (`/admin/dashboard`):** Superuser command center with manual fee verification queue (Meezan/JazzCash/Easypaisa), teacher provisioning, and interactive direct publish toggles.
  - Unauthorized access protection (403 guard redirecting users to their proper role area).

---

## 🕒 Module 3 Changelog & Details
- **Course Catalog (`/courses`):**
  - Full search bar with instant debounce keyword lookup.
  - Multi-faceted sidebar filtering (Categories: MDCAT, ECAT, FBISE, Cambridge, CSS, Computer Science; Levels: Entry Test, Intermediate, Competitive, Skill; Pricing: All, Free, Paid; Star Ratings).
  - Responsive Course Card grid showing thumbnails, category pills, verified faculty, star ratings, PKR pricing, and dedicated **Eligibility Criteria Snippets**.
  - Dynamic active filter pills with 1-click removal and empty state with reset trigger.
- **Single Course Detail Page (`/courses/[slug]`):**
  - High-impact dark header with academic category, level, syllabus alignment (PMDC/FBISE), and bilingual lecture badges.
  - **Dedicated Eligibility Criteria Section ("Is This Course Right For You?")**: Outlines minimum required qualification (e.g. FSc Pre-Medical 65%+), recommended foundation, target aspirants, and prerequisites.
  - Interactive Course Curriculum accordion with collapsible sections, lecture counts, durations, and free sample preview buttons.
  - Free Video Preview Modal with responsive video player and direct enrollment CTA.
  - Instructor profile showcase with student metrics, lead faculty bio, and rating.
  - Sticky pricing box with localized Pakistani payment badges (Meezan, JazzCash, Easypaisa).
- **Past Papers Vault (`/past-papers`):**
  - Filterable public archive for examination bodies (`FBISE`, `BISE Lahore`, `UHS MDCAT`, `ECAT UET`, `Cambridge CAIE`, `FPSC CSS`).
  - Search by exam title, year (2020–2024), subject, or paper code.
  - Solved papers with verified marking schemes filter.
  - Interactive In-App PDF Reader Modal with zoom, page counts, syllabus topic breakdown, and direct download action with success toast.
- **Public Core Pages:**
  - **About Page (`/about`):** Mission, 4-pillar academic pedagogy (High-yield concepts, Past paper drills, Gemini AI tutor, Local fee accessibility), leadership team, and student metrics.
  - **Contact Page (`/contact`):** Interactive inquiry form with client validation, WhatsApp helpline, support email, operating hours, and physical campus addresses (Lahore, Islamabad, Karachi).

---

## 🕒 Module 4 Changelog & Details
- **Admin Service & Validation Layer (`AdminService`):**
  - Integrated Supabase database queries for faculty members, fee queues, and platform settings with resilient offline state fallbacks.
  - Added Zod schemas (`teacherProvisionSchema`, `platformSettingsSchema`) for strict payload verification.
- **Executive Dashboard KPIs (`/admin/dashboard`):**
  - Live metric cards: Gross Platform Volume (PKR), Net Platform Cut (20%), Pending Fee Receipts count, and Active Faculty count.
  - Unified clean layout with decent Royal Indigo branding, fixed viewport sidebar, pinned bottom logout, and interactive admin profile dropdown.
- **Teacher Provisioning System (PRD Section 4 Mandate):**
  - Built Provisioning Modal form with Full Name, Faculty Email, Department, Pakistani Phone, 80/20 Commission rate, and Initial Temporary Password.
  - Complete Faculty Directory Table displaying instructor metrics, commission splits, and department tags.
- **Interactive Direct Publish Toggle (PRD Section 4 Mandate):**
  - Per-teacher interactive toggle switch (`can_direct_publish`) allowing admin to authorize instant publishing (skipping review) or enforce approval review.
- **Course Approvals Queue (`activeTab === 'course-approvals'`):**
  - Inspection pipeline for courses submitted by non-direct-publish instructors.
  - Syllabus preview modal showing price PKR, duration, lectures count, and prerequisites snippet.
  - 1-click "Approve & Publish to Catalog" and "Request Changes" actions with real-time feedback.
- **Platform Bank & Payment Accounts Manager (`platform_settings` table):**
  - Editable form for Meezan Bank (Account Title, Number, IBAN, Branch Code), JazzCash (Account Title, Number, Till ID), and Easypaisa.
  - Direct persistence into PostgreSQL `platform_settings` table (row id = 1).
- **Manual Fee Verification Queue (`activeTab === 'fee-queue'`):**
  - Verifies student bank transfer/JazzCash/Easypaisa transaction slips with in-app receipt image modal, TID verification, and instant Approve/Reject triggers.

---

## 🕒 Module 5 Changelog & Details
- **Course & Curriculum Builder Wizard (`/teacher/courses/new`):**
  - Multi-step interactive builder with Step 1 (Course Info, Categorization, 80/20 Revenue Split Calculator, Cover Thumbnail, and "Is this course right for me?" Eligibility Criteria Builder).
  - Step 2: Interactive Curriculum Outline with draggable/reorderable Sections and multi-format Lectures (`VIDEO` or `TEXT`).
  - Section and Lesson CRUD with instant Free Sample Preview toggles (`is_free_preview`).
- **Interactive Video Preview Player (`VideoPreviewPlayer`):**
  - Robust YouTube standard and unlisted URL parser with clean iframe embed wrapper (`rel=0&modestbranding=1`).
  - Direct video streaming (`.mp4`) support with duration counter.
- **Academic Rich Text Editor (`RichTextEditor`):**
  - Headless Tiptap implementation (`@tiptap/react`, `@tiptap/starter-kit`) with academic toolbar.
  - Headings (H1, H2, H3), bold, italic, strike, inline formula code, bullet/numbered lists, blockquotes, horizontal dividers, and 1-click Exam Tip Callout insertion.
- **Google Gemini AI Teaching Co-Pilot (`@google/genai`):**
  - Official SDK integration using model `gemini-2.5-flash` in `GeminiService`.
  - Mode 1 (`SYLLABUS`): Generates full 4-section curriculum outlines tailored to Pakistani boards (MDCAT, ECAT, FSc, KPPSC, CSS) with 1-click "Apply to Course" trigger.
  - Mode 2 (`MCQS`): Generates high-yield practice MCQs with options A-D, correct keys, and detailed scientific rationale with 1-click "Insert into Lecture Notes" action.
  - Mode 3 (`POLISH`): Polishes raw lecture notes into high-yield academic study notes with exam tips.
  - Resilient offline fallback generator for offline testing or unconfigured API keys.
  - API endpoint: `POST /api/ai/course-copilot` with strict Zod validation.
- **Teacher Course Service & Direct Publishing Logic (`TeacherCourseService`):**
  - Checks instructor's `can_direct_publish` authorization flag.
  - If authorized, 1-click "Direct Publish" immediately promotes course to `PUBLISHED` in public catalog.
  - If un-authorized, "Submit for Review" queues the course into Admin Course Approvals as `PENDING_REVIEW`.
- **Teacher Dashboard Integration (`/teacher/dashboard`):**
  - Connected `+ Create New Course` button to `/teacher/courses/new`.
  - Dynamic course list showing published, pending, and draft curricula with enrolled student counts, section counts, and PKR pricing.
- **Course Builder Upgrades & Rich Text Editor Modernization:**
  - Upgraded Course Thumbnail Banner with 3 dedicated modes: Device File Upload (drag-and-drop & file picker with immediate 16:9 preview), 5 curated Pakistani syllabus presets (MDCAT Physics, ECAT Math, Organic Chemistry, Cambridge Biology, CSS/PMS), and Direct URL.
  - Enhanced Rich Text Editor with multi-modal Image Upload & Embed Modal, science/math subscripts ($H_2O$) & superscripts ($x^2$), high-yield yellow highlighter, 3 academic callouts (💡 Rule, ⚠️ Pitfall, 📝 Formula), and 3x3 table insertion.

---

## 🕒 Module 6 Changelog & Details
- **Database & RLS Policies Synchronization (`supabase/schema.sql`):**
  - Configured PostgreSQL Row-Level Security policies on `public.enrollments` for Admin full management (`FOR ALL`), Teacher course enrollment visibility (`FOR SELECT`), and Student pending submission updates (`FOR UPDATE`).
  - Added RLS policies on `public.notifications` for student delivery and automated system inserts.
- **Gemini Vision Receipt OCR API (`POST /api/ai/receipt-ocr`):**
  - Powered by Google Gemini API (`@google/genai` model `gemini-3.5-flash-lite`).
  - Automatically analyzes student payment screenshots (JazzCash, Easypaisa, Meezan Bank, etc.) and extracts Transaction ID (TID), Amount in PKR, Payment Method, and Confidence Score.
  - Built-in duplicate TID detection against existing database records to prevent duplicate fraud.
- **Student Enrollment & Fee Checkout Page (`/courses/[slug]/enroll`):**
  - Step 1: Displays official Pakistani receiving accounts (Meezan Bank Limited, JazzCash Merchant, Easypaisa) with 1-click clipboard copy for account numbers and IBANs.
  - Step 2: Drag-and-drop receipt screenshot upload with instant Gemini Vision OCR scanning & autofill.
  - Form validation, duplicate warning banner, and submission to `public.enrollments`.
  - Success modal with instant link to Fee History or Course details.
- **Admin Fee Verification & Audit Queue (`/admin/fee-verifications`):**
  - Full superuser queue with status tabs (`Pending Verification`, `Approved`, `Rejected`, `All Records`).
  - Side-by-side receipt inspector modal showing uploaded screenshot alongside student ledger and Gemini OCR metadata.
  - 1-Click **Approve**: Unlocks course for student, sets enrollment to `ACTIVE`, automatically logs 80% teacher / 20% platform revenue split, and delivers real-time In-App notification to student.
  - 1-Click **Reject**: Prompts for rejection reason, sets status to `REJECTED`, and notifies student with exact reason for re-uploading.
  - Direct integration into Executive Admin Dashboard (`/admin/dashboard`).
- **Student Fee & Transaction History (`/student/fees`):**
  - Complete admission tracking portal with real-time status badges (`PENDING_VERIFICATION`, `ACTIVE`, `REJECTED`).
  - View Receipt modal, TID display, and dynamic action buttons ("Go to Course" for active, "Resubmit" for rejected).
- **Dynamic Course Page (`/courses/[slug]`) CTA Integration:**
  - Real-time user enrollment state check.
  - Displays "Enrolled • Continue Learning" if active, "Payment Under Review" if pending, "Receipt Rejected • Resubmit" if rejected, or "Enroll & Pay (PKR X,XXX)" for new admissions.



