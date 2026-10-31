'use client';

import * as React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { Modal } from '@/components/ui/modal';
import { DataTable } from '@/components/ui/data-table';
import { CourseCard } from '@/components/ui/course-card';
import { formatPKR } from '@professor-academy/shared';
import type { UserRole } from '@professor-academy/shared';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Smartphone,
  Eye,
  Clock,
  Layers,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function DesignPreviewPage() {
  const [currentRole, setCurrentRole] = React.useState<UserRole | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modern Course Cards
  const sampleCourses = [
    {
      id: 'c-1',
      slug: 'mdcat-physics-masterclass',
      title: 'MDCAT Physics: Complete High-Yield Prep & Past Paper Shortcuts (2026)',
      instructor: 'Prof. Dr. Arshad Mahmood',
      thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      ratingCount: 4210,
      pricePkr: 4500,
      originalPricePkr: 8000,
      badgeText: 'Bestseller',
      badgeVariant: 'gold' as const,
      category: 'MDCAT Prep',
      eligibilitySnippet: '🎯 FSc Pre-Medical 65%+ or A-Level Physics passed',
    },
    {
      id: 'c-2',
      slug: 'fsc-chemistry-part-1',
      title: 'FSc Pre-Medical Chemistry Part-1: Organic & Inorganic Concepts',
      instructor: 'Dr. Fatima Tariq',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      ratingCount: 1890,
      pricePkr: 3800,
      originalPricePkr: 6000,
      badgeText: 'Top Rated',
      badgeVariant: 'gold' as const,
      category: 'FSc Part-I',
      eligibilitySnippet: '🎯 Matric Science with Chemistry (60%+)',
    },
    {
      id: 'c-3',
      slug: 'ecat-net-advanced-math',
      title: 'ECAT & NUST (NET) Advanced Mathematics: Speed Tricks & Problem Sets',
      instructor: 'Engr. Usman Qureshi',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      ratingCount: 2340,
      pricePkr: 4200,
      originalPricePkr: 7500,
      badgeText: 'Popular',
      badgeVariant: 'indigo' as const,
      category: 'Engineering Prep',
      eligibilitySnippet: '🎯 FSc Pre-Engineering / ICS Math student',
    },
    {
      id: 'c-4',
      slug: 'cambridge-a-level-biology',
      title: 'Cambridge International A-Level Biology (Paper 4 & 5 Special Prep)',
      instructor: 'Amina Rehman (Cambridge Certified)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      ratingCount: 980,
      pricePkr: 6500,
      originalPricePkr: 11000,
      badgeText: 'Certified',
      badgeVariant: 'indigo' as const,
      category: 'Cambridge A-Level',
      eligibilitySnippet: '🎯 O-Level / IGCSE Biology Grade B or above',
    },
  ];

  // Administrative Data Table Data
  const sampleEnrollments = [
    {
      id: 'ENR-9021',
      studentName: 'Hamza Farooq',
      studentEmail: 'hamza.f@gmail.com',
      course: 'MDCAT Physics Masterclass (2026)',
      paymentMethod: 'JAZZCASH',
      tid: 'JC-88392104',
      amount: 4500,
      status: 'PENDING_VERIFICATION' as const,
      submittedAt: '10 mins ago',
    },
    {
      id: 'ENR-9022',
      studentName: 'Ayesha Siddiqua',
      studentEmail: 'ayesha.s@outlook.com',
      course: 'FSc Part-II Advanced Mathematics',
      paymentMethod: 'BANK_TRANSFER',
      tid: 'MEZN-449102849',
      amount: 3800,
      status: 'ACTIVE' as const,
      submittedAt: '1 hour ago',
    },
    {
      id: 'ENR-9023',
      studentName: 'Bilal Khan',
      studentEmail: 'bilal.k@gmail.com',
      course: 'Computer Science & AI Foundations',
      paymentMethod: 'EASYPAISA',
      tid: 'EP-90123847',
      amount: 5000,
      status: 'ACTIVE' as const,
      submittedAt: '3 hours ago',
    },
    {
      id: 'ENR-9024',
      studentName: 'Zainab Tariq',
      studentEmail: 'zainab.t@yahoo.com',
      course: 'Cambridge A-Level Biology',
      paymentMethod: 'JAZZCASH',
      tid: 'JC-11094821',
      amount: 6500,
      status: 'REJECTED' as const,
      submittedAt: 'Yesterday',
    },
  ];

  const tableColumns = [
    {
      header: 'Student',
      cell: (item: (typeof sampleEnrollments)[0]) => (
        <div>
          <div className="font-semibold text-slate-900">{item.studentName}</div>
          <div className="text-[11px] text-slate-400">{item.studentEmail}</div>
        </div>
      ),
    },
    {
      header: 'Enrolled Course',
      accessorKey: 'course' as const,
      className: 'font-medium max-w-[260px] truncate text-slate-700',
    },
    {
      header: 'Payment Method',
      cell: (item: (typeof sampleEnrollments)[0]) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
          {item.paymentMethod === 'BANK_TRANSFER' ? (
            <Building2 className="h-3.5 w-3.5 text-amber-600" />
          ) : (
            <Smartphone className="h-3.5 w-3.5 text-brand-indigo" />
          )}
          {item.paymentMethod.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Fee & TID',
      cell: (item: (typeof sampleEnrollments)[0]) => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">
            {formatPKR(item.amount)}
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {item.tid}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item: (typeof sampleEnrollments)[0]) => {
        if (item.status === 'ACTIVE') {
          return <Badge variant="success" hasDot>Verified Active</Badge>;
        }
        if (item.status === 'PENDING_VERIFICATION') {
          return <Badge variant="warning" hasDot>Pending Admin</Badge>;
        }
        return <Badge variant="danger" hasDot>Rejected</Badge>;
      },
    },
    {
      header: 'Actions',
      cell: () => (
        <Button variant="secondary" size="sm">
          Review TID
        </Button>
      ),
    },
  ];

  const triggerTest = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar currentRole={currentRole} onRoleSwitch={setCurrentRole} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 space-y-12">
        {/* Header Hero Section: Clean, Elevated, Minimal */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" hasDot>
                Module 1 Showcase
              </Badge>
              <span className="text-xs text-slate-400 font-medium">• Modern Minimal Academic Standard</span>
            </div>
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              A Refined Academic Experience, Designed for Focus
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We took the clarity of platforms like Udemy and modernized it: smoother elevation,
              crisp borders, modern Royal Indigo accents, verified instructor badges, and dedicated
              Eligibility Criteria boxes for Pakistani students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Launch Verification Modal
            </Button>
            <Button
              variant="secondary"
              onClick={triggerTest}
              isLoading={btnLoading}
            >
              Test Loading State
            </Button>
          </div>
        </section>

        {/* 1. Next-Gen Course Cards (Superior to Udemy) */}
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-bold text-xl text-slate-900 tracking-tight">
                1. High-Yield Course Cards
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enhanced with 16:9 thumbnails, verified instructor checkmarks, star ratings, and the critical Eligibility Criteria snippet.
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-indigo hover:underline cursor-pointer flex items-center gap-1">
              <span>View full catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sampleCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>

        {/* 2. Color System */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-bold text-xl text-slate-900 tracking-tight">
              2. Modern Design Tokens
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sophisticated, high-contrast palette engineered for clarity and fatigue-free multi-hour study sessions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 shadow-subtle">
              <div className="h-12 bg-slate-900 rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-slate-900">Obsidian Slate</div>
                <div className="text-[11px] text-slate-400 font-mono">#0F172A</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 shadow-subtle">
              <div className="h-12 bg-indigo-600 rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-slate-900">Royal Indigo</div>
                <div className="text-[11px] text-slate-400 font-mono">#4F46E5</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 shadow-subtle">
              <div className="h-12 bg-amber-500 rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-slate-900">Amber Honor</div>
                <div className="text-[11px] text-slate-400 font-mono">#D97706</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 shadow-subtle">
              <div className="h-12 bg-emerald-600 rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-slate-900">Emerald Success</div>
                <div className="text-[11px] text-slate-400 font-mono">#16A34A</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 shadow-subtle">
              <div className="h-12 bg-slate-50 border border-slate-200 rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-slate-900">Canvas Surface</div>
                <div className="text-[11px] text-slate-400 font-mono">#F8F9FA</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 shadow-subtle">
              <div className="h-12 bg-slate-200 rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-slate-900">Structural Border</div>
                <div className="text-[11px] text-slate-400 font-mono">#E2E8F0</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Button Hierarchy */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-bold text-xl text-slate-900 tracking-tight">
              3. Button Hierarchy & States
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Crisp button components with active scale press feedback and clean loading spinners.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-subtle space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Indigo</Button>
              <Button variant="dark">Dark Obsidian</Button>
              <Button variant="secondary">Bordered Secondary</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Action</Button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Button size="sm" variant="primary">
                Small (32px)
              </Button>
              <Button size="md" variant="primary">
                Medium (40px)
              </Button>
              <Button size="lg" variant="primary">
                Large (44px)
              </Button>
              <Button size="md" variant="primary" isLoading>
                Loading
              </Button>
              <Button size="md" variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* 4. Badges & Status Chips */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-bold text-xl text-slate-900 tracking-tight">
              4. Badges & Verification Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Refined, pill-shaped tags for course achievements, exam boards, and fee verification pipeline states.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-subtle flex flex-wrap items-center gap-3">
            <Badge variant="gold" hasDot>
              Bestseller
            </Badge>
            <Badge variant="indigo" hasDot>
              MDCAT Prep
            </Badge>
            <Badge variant="neutral">
              FBISE Aligned
            </Badge>
            <Badge variant="success" hasDot>
              Fee Verified (PKR 4,500)
            </Badge>
            <Badge variant="warning" hasDot>
              Pending Admin Verification
            </Badge>
            <Badge variant="danger" hasDot>
              Submission Rejected
            </Badge>
          </div>
        </section>

        {/* 5. Clean Form Controls */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-bold text-xl text-slate-900 tracking-tight">
              5. Clean Form Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-contrast, accessible form elements with clean labels and micro-interaction focus rings.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-subtle grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" required hint="As printed on your B-Form or Matric Certificate">
              <Input placeholder="e.g. Muhammad Abdullah" />
            </FormField>

            <FormField label="Academic Email Address" required>
              <Input type="email" placeholder="student@example.pk" />
            </FormField>

            <FormField label="Target Exam Board / Entrance Exam" required>
              <Select defaultValue="fbise">
                <option value="fbise">Federal Board (FBISE)</option>
                <option value="bise-lahore">Lahore Board (BISE Lahore)</option>
                <option value="mdcat">MDCAT / NUMS Entrance</option>
                <option value="cambridge">Cambridge O/A-Levels</option>
              </Select>
            </FormField>

            <FormField
              label="Transaction ID (Error Validation State)"
              required
              error="Invalid Transaction ID format. Must contain 8 to 12 digits."
            >
              <Input defaultValue="TID-12" error />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Student Academic Bio / Prerequisites Statement" hint="Summarize your previous grade and target score">
                <Textarea placeholder="Scored 94% in Matric Science (Biology, Chemistry, Physics). Aiming for King Edward Medical University..." />
              </FormField>
            </div>
          </div>
        </section>

        {/* 6. Administrative Data Table */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-slate-900 tracking-tight">
                6. Administrative Fee Queue Table
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Built for rapid scanning of thousands of students and manual fee approvals.
              </p>
            </div>
          </div>

          <DataTable
            columns={tableColumns}
            data={sampleEnrollments}
            keyExtractor={(item) => item.id}
            pagination={{
              currentPage,
              totalPages: 3,
              onPageChange: (p) => setCurrentPage(p),
            }}
          />
        </section>
      </main>

      {/* Modern Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Verify Manual Fee Payment"
        description="Verify JazzCash / Bank transfer details before unlocking course access"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('Fee approved successfully! Course unlocked for student.');
                setIsModalOpen(false);
              }}
            >
              Confirm & Unlock
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-sm">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Student:</span>
              <span className="font-semibold text-slate-900">Hamza Farooq</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Course:</span>
              <span className="font-medium text-slate-800">MDCAT Physics Masterclass</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-medium text-slate-800">JazzCash Mobile Transfer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-semibold text-slate-900">JC-88392104</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Fee Paid:</span>
              <span className="font-bold text-emerald-700">{formatPKR(4500)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Confirming this transaction will immediately unlock the student dashboard and credit PKR 3,600 (80%)
            to the instructor account.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
