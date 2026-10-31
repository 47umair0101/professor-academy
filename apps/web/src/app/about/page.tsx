'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Target,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Cpu,
  Smartphone,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Active Students Enrolled', value: '25,000+' },
    { label: 'Board & MDCAT Success Rate', value: '98.4%' },
    { label: 'Top 50 Merit Positions Secured', value: '42' },
    { label: 'Verified Subject Professors', value: '35+' },
  ];

  const pillars = [
    {
      icon: Target,
      title: 'High-Yield Concept Mastery',
      desc: 'We discard blind rote learning. Every lecture deconstructs core principles using visual models, derivation maps, and real exam problem structures.',
    },
    {
      icon: BookOpen,
      title: 'Past Paper Analytical Drills',
      desc: 'Over 10 years of solved questions from FBISE, Punjab BISE, UHS, and UET integrated directly into each chapter syllabus.',
    },
    {
      icon: Cpu,
      title: 'Gemini AI Study Tutor',
      desc: '24/7 personalized problem assistance. Get immediate conceptual hints and step-by-step solutions without waiting for office hours.',
    },
    {
      icon: Smartphone,
      title: 'Local Pakistani Fee Accessibility',
      desc: 'Top tier education shouldn’t require expensive credit cards. Pay seamlessly via Meezan Bank, JazzCash, or Easypaisa with instant receipt verification.',
    },
  ];

  const leadership = [
    {
      name: 'Prof. Dr. Arshad Mahmood',
      role: 'Dean of Sciences & Physics Lead',
      bio: 'Ex-Chairman Physics with 22+ years of MDCAT prep mentorship. Guided over 14,000 students to government medical colleges.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Dr. Fatima Tariq',
      role: 'Head of Chemistry Faculty',
      bio: 'M.Phil Organic Chemistry, Board Gold Medalist. Author of 3 high-school chemistry revision guides.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Engr. Usman Qureshi',
      role: 'Director of Engineering Entrance Tests',
      bio: 'UET Lahore top graduate with 10+ years coaching ECAT and NUST NET speed mathematics.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white border-b border-slate-800 py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Democratizing Academic Excellence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
              Bridging the Quality Gap in Pakistani Higher Secondary Education.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Professor Academy was founded to provide every ambitious student in Pakistan — from Gilgit to Karachi —
              direct access to the nation’s top board examiners, medical entry test specialists, and AI learning tools.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 max-w-4xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Pillars of Pedagogy */}
        <section className="py-16 px-4 sm:px-6 bg-slate-50/50 border-b border-slate-200">
          <div className="max-w-[1400px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Our 4-Pillar Academic Methodology
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                How we consistently produce board toppers and medical/engineering admissions year after year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-3 shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verified Faculty Leadership */}
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-[1400px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Meet Our Senior Faculty Leads
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Educators with decades of paper-setting and board evaluation experience across Pakistan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {leadership.map((lead, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-center hover:shadow-md transition-shadow"
                >
                  <img
                    src={lead.avatarUrl}
                    alt={lead.name}
                    className="h-24 w-24 rounded-full object-cover mx-auto ring-4 ring-indigo-50"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{lead.name}</h3>
                    <p className="text-xs font-semibold text-brand-indigo">{lead.role}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{lead.bio}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold">Ready to begin your preparation?</h3>
                <p className="text-xs text-slate-300">
                  Join over 25,000 students achieving their dream university admissions.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/courses">
                  <Button variant="primary" size="md">
                    <span>Browse Courses</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
