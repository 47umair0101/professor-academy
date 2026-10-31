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
import { formatPKR, brandColors } from '@professor-academy/shared';
import type { UserRole } from '@professor-academy/shared';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Clock,
  Search,
  Mail,
  Lock,
  GraduationCap,
  FileCheck,
  Eye,
  Check,
  Building2,
  Smartphone,
  Info,
} from 'lucide-react';

export default function DesignPreviewPage() {
  const [currentRole, setCurrentRole] = React.useState<UserRole | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sample data for Data Table
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
      course: 'Cambridge A-Level Biology (Paper 4 & 5)',
      paymentMethod: 'JAZZCASH',
      tid: 'JC-11094821',
      amount: 6000,
      status: 'REJECTED' as const,
      submittedAt: 'Yesterday',
    },
  ];

  const tableColumns = [
    {
      header: 'Student & Email',
      cell: (item: (typeof sampleEnrollments)[0]) => (
        <div>
          <div className="font-semibold text-academic-navy">{item.studentName}</div>
          <div className="text-xs text-academic-slate">{item.studentEmail}</div>
        </div>
      ),
    },
    {
      header: 'Target Program',
      accessorKey: 'course' as const,
      className: 'font-medium',
    },
    {
      header: 'Payment Method',
      cell: (item: (typeof sampleEnrollments)[0]) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-academic-charcoal">
          {item.paymentMethod === 'BANK_TRANSFER' ? (
            <Building2 className="h-3.5 w-3.5 text-academic-gold" />
          ) : (
            <Smartphone className="h-3.5 w-3.5 text-academic-navy" />
          )}
          {item.paymentMethod.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Transaction ID & Fee',
      cell: (item: (typeof sampleEnrollments)[0]) => (
        <div>
          <span className="font-mono text-xs font-semibold text-academic-navy block">
            {formatPKR(item.amount)}
          </span>
          <span className="font-mono text-[11px] text-academic-slate tracking-wider">
            TID: {item.tid}
          </span>
        </div>
      ),
    },
    {
      header: 'Verification Status',
      cell: (item: (typeof sampleEnrollments)[0]) => {
        if (item.status === 'ACTIVE') {
          return <Badge variant="success" hasDot>Verified & Active</Badge>;
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
        <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
            Inspect
          </Button>
        </div>
      ),
    },
  ];

  const toggleLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-academic-cream">
      {/* Top Navbar with live Role Simulator */}
      <Navbar currentRole={currentRole} onRoleSwitch={setCurrentRole} />

      <main className="flex-1 max-w-academic mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header Hero Section */}
        <section className="bg-white rounded-academic border border-academic-border p-8 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-academic-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="gold" hasDot>
                  Module 1 Review Active
                </Badge>
                <Badge variant="navy">Turborepo + Next.js 15</Badge>
              </div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-academic-navy tracking-tight">
                Professor Academy Design System
              </h1>
              <p className="text-academic-slate text-sm md:text-base leading-relaxed">
                A prestigious, anti-&ldquo;vibe-coded&rdquo; academic design language. Strictly tailored
                for long study sessions, authoritative curriculum presentation, and transparent Pakistani
                fee operations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="gold"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Launch Test Modal
              </Button>
              <Button
                variant="primary"
                onClick={toggleLoading}
                isLoading={btnLoading}
                leftIcon={<Check className="h-4 w-4" />}
              >
                Trigger State Test
              </Button>
            </div>
          </div>
        </section>

        {/* Section 1: Color Palette */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3">
            <h2 className="font-heading font-bold text-xl text-academic-navy flex items-center gap-2">
              <span>1. Verified Academic Color Tokens</span>
            </h2>
            <p className="text-xs text-academic-slate mt-1">
              Never uses neon AI gradients. Built on dignified Navy, Heritage Gold, Soft Rose-Gold, and Warm Cream.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Academic Navy */}
            <div className="bg-white rounded-academic border border-academic-border p-3.5 space-y-2">
              <div className="h-14 rounded bg-[#1A2451] shadow-inner flex items-end p-2">
                <span className="text-[10px] font-mono text-white/80">#1A2451</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-academic-navy">Academic Navy</div>
                <div className="text-[11px] text-academic-slate">Primary Brand & Authority</div>
              </div>
            </div>

            {/* Deep Navy */}
            <div className="bg-white rounded-academic border border-academic-border p-3.5 space-y-2">
              <div className="h-14 rounded bg-[#111838] shadow-inner flex items-end p-2">
                <span className="text-[10px] font-mono text-white/80">#111838</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-academic-navy">Deep Navy</div>
                <div className="text-[11px] text-academic-slate">Headers & Active States</div>
              </div>
            </div>

            {/* Heritage Gold */}
            <div className="bg-white rounded-academic border border-academic-border p-3.5 space-y-2">
              <div className="h-14 rounded bg-[#C59B27] shadow-inner flex items-end p-2">
                <span className="text-[10px] font-mono text-white/90">#C59B27</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-academic-navy">Heritage Gold</div>
                <div className="text-[11px] text-academic-slate">Excellence, Seals & Badges</div>
              </div>
            </div>

            {/* Soft Rose Gold */}
            <div className="bg-white rounded-academic border border-academic-border p-3.5 space-y-2">
              <div className="h-14 rounded bg-[#B8868B] shadow-inner flex items-end p-2">
                <span className="text-[10px] font-mono text-white/90">#B8868B</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-academic-navy">Rose-Gold Tint</div>
                <div className="text-[11px] text-academic-slate">Secondary Teacher Tag</div>
              </div>
            </div>

            {/* Warm Cream */}
            <div className="bg-white rounded-academic border border-academic-border p-3.5 space-y-2">
              <div className="h-14 rounded bg-[#FAF9F6] border border-academic-border flex items-end p-2">
                <span className="text-[10px] font-mono text-academic-charcoal">#FAF9F6</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-academic-navy">Warm Cream</div>
                <div className="text-[11px] text-academic-slate">Fatigue-Free Canvas</div>
              </div>
            </div>

            {/* Card Border */}
            <div className="bg-white rounded-academic border border-academic-border p-3.5 space-y-2">
              <div className="h-14 rounded bg-[#E5E3DC] flex items-end p-2">
                <span className="text-[10px] font-mono text-academic-charcoal">#E5E3DC</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-academic-navy">Structural Border</div>
                <div className="text-[11px] text-academic-slate">Crisp 1px Boundaries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Buttons & Actions */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3">
            <h2 className="font-heading font-bold text-xl text-academic-navy">
              2. Button Hierarchy & Interactive States
            </h2>
            <p className="text-xs text-academic-slate mt-1">
              Purpose-built button variants with distinct visual weighting, loading spinners, and icon slots.
            </p>
          </div>

          <div className="bg-white rounded-academic border border-academic-border p-6 space-y-6">
            {/* Primary & Accent Buttons */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-academic-slate block mb-3">
                Variants (Standard Medium Size)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Academic Navy</Button>
                <Button variant="gold" leftIcon={<Sparkles className="h-4 w-4" />}>
                  Heritage Gold Accent
                </Button>
                <Button variant="secondary">Secondary Card Surface</Button>
                <Button variant="outline">Navy Border Outline</Button>
                <Button variant="ghost">Subtle Ghost</Button>
                <Button variant="danger" leftIcon={<AlertTriangle className="h-4 w-4" />}>
                  Reject / Revoke
                </Button>
              </div>
            </div>

            {/* Sizing Comparison */}
            <div className="pt-4 border-t border-academic-border/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-academic-slate block mb-3">
                Sizes Comparison (Small, Medium, Large)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">
                  Small (32px)
                </Button>
                <Button size="md" variant="primary">
                  Medium (40px)
                </Button>
                <Button size="lg" variant="primary" rightIcon={<BookOpen className="h-4 w-4" />}>
                  Large (48px - Primary Hero CTA)
                </Button>
                <Button size="md" variant="gold" isLoading>
                  Processing
                </Button>
                <Button size="md" variant="secondary" disabled>
                  Disabled Action
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Badges, Tags & Status */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3">
            <h2 className="font-heading font-bold text-xl text-academic-navy">
              3. Badges, Certification Seals & Status Indicators
            </h2>
            <p className="text-xs text-academic-slate mt-1">
              For role identification, course eligibility labels, and fee verification pipeline flags.
            </p>
          </div>

          <div className="bg-white rounded-academic border border-academic-border p-6 flex flex-wrap items-center gap-3">
            <Badge variant="navy" hasDot>
              STUDENT ROLE
            </Badge>
            <Badge variant="rose" hasDot>
              TEACHER ROLE
            </Badge>
            <Badge variant="danger" hasDot>
              ADMIN SUPERUSER
            </Badge>
            <Badge variant="gold" hasDot>
              CERTIFIED ACADEMIC
            </Badge>
            <Badge variant="success" hasDot>
              Fee Verified (PKR 4,500)
            </Badge>
            <Badge variant="warning" hasDot>
              Pending Verification
            </Badge>
            <Badge variant="danger">Submission Rejected</Badge>
            <Badge variant="neutral">FBISE Aligned</Badge>
            <Badge variant="gold" size="sm">
              98.5% Passing Rate
            </Badge>
          </div>
        </section>

        {/* Section 4: Typography & Editorial Scales */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3">
            <h2 className="font-heading font-bold text-xl text-academic-navy">
              4. Typography Hierarchy (Poppins, Inter & JetBrains Mono)
            </h2>
            <p className="text-xs text-academic-slate mt-1">
              Precision pairings ensure long study material and mathematical problems are effortless to read.
            </p>
          </div>

          <div className="bg-white rounded-academic border border-academic-border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-academic-gold">
                Headings: Poppins
              </span>
              <h3 className="font-heading font-bold text-2xl text-academic-navy">
                Excellence in Academic Mastery
              </h3>
              <p className="text-xs text-academic-slate">
                Used for page headings, course titles, section cards, and certificate headers.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-academic-navy">
                Body & UI: Inter
              </span>
              <p className="font-body text-sm text-academic-charcoal leading-relaxed">
                &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
                Optimized line-height prevents visual fatigue during extended multi-hour reading sessions.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-academic-status-warning">
                Monospace: JetBrains Mono
              </span>
              <div className="space-y-1 font-mono text-xs text-academic-navy bg-academic-cream p-3 rounded border border-academic-border">
                <div className="font-semibold text-sm">{formatPKR(4500)}</div>
                <div className="text-academic-slate">TID: JC-9023847291</div>
                <div className="text-academic-status-danger font-semibold flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>00:44:59 (Quiz Timer)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Form Fields & Inputs */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3">
            <h2 className="font-heading font-bold text-xl text-academic-navy">
              5. Academic Form Controls & Error States
            </h2>
            <p className="text-xs text-academic-slate mt-1">
              Clean, border-framed input surfaces with accessible focus rings and validation helper slots.
            </p>
          </div>

          <div className="bg-white rounded-academic border border-academic-border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" required hint="As printed on your B-Form or Matric Certificate">
              <Input placeholder="e.g. Muhammad Abdullah" />
            </FormField>

            <FormField label="Academic Email Address" required>
              <Input
                type="email"
                placeholder="student@example.pk"
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </FormField>

            <FormField label="Target Exam Board / Level" required>
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
              error="Invalid Transaction ID. Bank & JazzCash TIDs must contain 8 to 12 digits."
            >
              <Input
                defaultValue="TID-12"
                error
                leftIcon={<CreditCard className="h-4 w-4" />}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Student Academic Bio / Prerequisites Statement"
                hint="Summarize your previous grade/percentage and target score"
              >
                <Textarea placeholder="Scored 94% in Matric Science (Biology, Chemistry, Physics). Aiming for King Edward Medical University..." />
              </FormField>
            </div>
          </div>
        </section>

        {/* Section 6: Academic Composite Cards (Live UI Simulation) */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3">
            <h2 className="font-heading font-bold text-xl text-academic-navy">
              6. Composite Academic Cards (Domain Model Simulation)
            </h2>
            <p className="text-xs text-academic-slate mt-1">
              Real representations of Course Cards with Eligibility Criteria, Fee Breakdown, and Timed Quiz cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Course Card with Eligibility Preview */}
            <Card interactive className="flex flex-col">
              <div className="h-40 bg-gradient-to-br from-academic-navy to-academic-navy-deep relative p-4 flex flex-col justify-between text-white rounded-t-academic">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">
                    MDCAT PREP
                  </Badge>
                  <span className="font-mono text-xs font-semibold bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                    28 Video Lectures
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base leading-snug">
                    Complete Physics for MDCAT 2026
                  </h4>
                  <p className="text-[11px] text-white/80 mt-0.5">By Prof. Dr. Arshad Mahmood</p>
                </div>
              </div>

              <CardContent className="space-y-3 flex-1">
                <p className="text-xs text-academic-slate line-clamp-2 leading-relaxed">
                  Comprehensive coverage of Mechanics, Electromagnetism, Modern Physics, and high-yield
                  past question shortcuts.
                </p>

                {/* Eligibility Criteria Box (Mandatory PRD Requirement) */}
                <div className="bg-academic-cream p-2.5 rounded border border-academic-border text-xs space-y-1">
                  <span className="font-semibold text-academic-navy flex items-center gap-1 text-[11px]">
                    <Info className="h-3 w-3 text-academic-gold" />
                    Eligibility Criteria:
                  </span>
                  <p className="text-[11px] text-academic-slate leading-normal">
                    FSc Pre-Medical Part-1 with 65%+ or A-Level Physics passed.
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-academic-slate block">Fee</span>
                  <span className="font-mono font-bold text-sm text-academic-navy">
                    {formatPKR(4500)}
                  </span>
                </div>
                <Button size="sm" variant="primary">
                  View Syllabus
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2: Manual Fee Verification Card */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="warning" hasDot>
                    Verification In Queue
                  </Badge>
                  <span className="font-mono text-xs text-academic-slate">TID: 994821</span>
                </div>
                <CardTitle className="text-base mt-2">JazzCash Manual Transfer</CardTitle>
                <CardDescription>Paid by Student: Daniyal Ahmed</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-academic-border/60">
                  <span className="text-academic-slate">Course Enrolled:</span>
                  <span className="font-medium text-academic-charcoal">FSc Chemistry Part-1</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-academic-border/60">
                  <span className="text-academic-slate">Amount Paid:</span>
                  <span className="font-mono font-bold text-academic-navy">{formatPKR(3500)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-academic-border/60">
                  <span className="text-academic-slate">Teacher Share (80%):</span>
                  <span className="font-mono text-academic-status-success font-medium">
                    {formatPKR(2800)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-academic-slate">Platform Share (20%):</span>
                  <span className="font-mono text-academic-slate font-medium">{formatPKR(700)}</span>
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button size="sm" variant="danger" className="w-1/2">
                  Reject
                </Button>
                <Button size="sm" variant="primary" className="w-1/2 bg-academic-status-success hover:bg-emerald-800">
                  Approve (Unlock)
                </Button>
              </CardFooter>
            </Card>

            {/* Card 3: Timed Quiz Status Card */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="gold">Grand Test #3</Badge>
                  <span className="font-mono text-xs text-academic-status-danger font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 45 Mins
                  </span>
                </div>
                <CardTitle className="text-base mt-2">Organic Chemistry Reactions</CardTitle>
                <CardDescription>Chapter 7: Hydrocarbons & Benzene</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-academic-slate">
                    <span>Passing Criteria</span>
                    <span className="font-semibold text-academic-navy">50.00% (Pass)</span>
                  </div>
                  <div className="w-full bg-academic-cream h-2 rounded-full overflow-hidden border border-academic-border">
                    <div className="bg-academic-gold h-full w-[78%]" />
                  </div>
                </div>

                <div className="p-2.5 rounded bg-academic-cream border border-academic-border space-y-1">
                  <div className="font-semibold text-academic-navy text-[11px]">
                    Hybrid Grading Engine:
                  </div>
                  <p className="text-[11px] text-academic-slate">
                    Single Choice + Multiple Choice graded instantly. Written Q/A evaluated via Gemini AI
                    Co-Pilot + Teacher review.
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <span className="text-xs text-academic-slate font-mono">1 Attempt Left</span>
                <Button size="sm" variant="gold">
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Section 7: Live Interactive Data Table */}
        <section className="space-y-4">
          <div className="border-b border-academic-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-xl text-academic-navy">
                7. Live Administrative Data Table Component
              </h2>
              <p className="text-xs text-academic-slate mt-1">
                Engineered for rapid scanning of thousands of students, fee approvals, and course listings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by TID or Student..."
                leftIcon={<Search className="h-3.5 w-3.5" />}
                className="h-8 text-xs w-56"
              />
            </div>
          </div>

          <DataTable
            columns={tableColumns}
            data={sampleEnrollments}
            keyExtractor={(item) => item.id}
            pagination={{
              currentPage,
              totalPages: 4,
              onPageChange: (p) => setCurrentPage(p),
            }}
          />
        </section>

        {/* Section 8: Module 1 Readiness Audit */}
        <section className="bg-academic-navy text-white rounded-academic p-8 border border-academic-navy-deep space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-academic-gold font-semibold">
                Foundation Verification
              </span>
              <h3 className="font-heading font-bold text-2xl mt-1">
                Module 1 Quality & Architecture Checklist
              </h3>
            </div>
            <Badge variant="gold" size="md">
              100% Free-First Infrastructure
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 border border-white/10 p-4 rounded-academic space-y-1.5">
              <div className="flex items-center gap-1.5 text-academic-gold font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Monorepo Architecture</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                Turborepo + pnpm workspaces linking `apps/web`, `apps/mobile`, and `packages/shared`.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-academic space-y-1.5">
              <div className="flex items-center gap-1.5 text-academic-gold font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero AI &ldquo;Vibe-Coded&rdquo; Slop</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                Strict adherence to Academic Navy, Heritage Gold, Warm Cream, crisp 1px borders, and Poppins/Inter.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-academic space-y-1.5">
              <div className="flex items-center gap-1.5 text-academic-gold font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>TypeScript & Zod Strictness</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                Shared schemas for Auth, PKR Currency, Enrollments, and Courses ready for Module 2.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-academic space-y-1.5">
              <div className="flex items-center gap-1.5 text-academic-gold font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Mobile & Web Token Parity</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                Shared `brandColors` exported directly to both Tailwind CSS and React Native (NativeWind).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Dialog Demonstration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Academic Dialog: Manual Fee Verification"
        description="Verify student transaction details before granting course access"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('Fee verified successfully! Course unlocked for student.');
                setIsModalOpen(false);
              }}
            >
              Confirm & Unlock
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="bg-academic-cream p-3.5 rounded border border-academic-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-academic-slate">Student:</span>
              <span className="font-semibold text-academic-navy">Hamza Farooq</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-academic-slate">Course:</span>
              <span className="font-semibold text-academic-navy">MDCAT Physics Masterclass</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-academic-slate">Method:</span>
              <span className="font-semibold text-academic-charcoal">JazzCash Mobile Transfer</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-academic-slate">TID:</span>
              <span className="font-mono font-bold text-academic-navy">JC-88392104</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-academic-border">
              <span className="text-academic-slate">Fee Paid:</span>
              <span className="font-mono font-bold text-academic-status-success">{formatPKR(4500)}</span>
            </div>
          </div>

          <p className="text-xs text-academic-slate leading-relaxed">
            Confirming this payment will unlock the course dashboard for the student, credit PKR 3,600 (80%)
            to the instructor account, and send an automated confirmation email.
          </p>
        </div>
      </Modal>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
