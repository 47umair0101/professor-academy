'use client';

import * as React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'admissions',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'admissions',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white border-b border-slate-800 py-12 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span>We Are Here to Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Contact Professor Academy
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Have questions regarding course eligibility, local fee payments (JazzCash / Easypaisa),
              or scheduling an academic counseling session? Our team replies within 2-4 hours.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Columns: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Send an Inquiry</h2>
                <p className="text-xs text-slate-500">
                  Fill in your details and an academic coordinator will contact you.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-emerald-900">Inquiry Received!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. An academic counselor has been assigned to your query and
                    will contact you via WhatsApp / Email shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="border-emerald-300 text-emerald-800"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <Input
                        placeholder="e.g. Muhammad Ali"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </FormField>

                    <FormField label="Email Address" required>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="WhatsApp / Phone Number">
                      <Input
                        type="tel"
                        placeholder="+92 300 0000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </FormField>

                    <FormField label="Inquiry Purpose">
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full h-10 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-indigo cursor-pointer"
                      >
                        <option value="admissions">Course Admission & Eligibility</option>
                        <option value="fees">Fee Verification (JazzCash/Easypaisa)</option>
                        <option value="technical">Portal Technical Support</option>
                        <option value="teacher">Teacher / Faculty Partnership</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Your Message or Query" required>
                    <Textarea
                      rows={4}
                      placeholder="Please mention your current academic program (e.g. FSc Pre-Medical 1st Year) and any specific questions you have..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </FormField>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto font-bold"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    <span>{isSubmitting ? 'Sending inquiry...' : 'Submit Inquiry'}</span>
                  </Button>
                </form>
              )}
            </div>

            {/* Right 5 Columns: Direct Contact Cards & Campuses */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Contacts Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
                <h3 className="font-bold text-base text-slate-900">Direct Contact Channels</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">WhatsApp Admissions Helpline</p>
                      <p className="text-slate-600 font-mono">+92 300 0000000</p>
                      <p className="text-[11px] text-slate-400">Available 9:00 AM - 9:00 PM PKT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-brand-indigo flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Official Support Email</p>
                      <p className="text-slate-600 font-mono">support@professoracademy.pk</p>
                      <p className="text-[11px] text-slate-400">Average response time: &lt; 4 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Help Desk Operating Hours</p>
                      <p className="text-slate-600">Monday — Saturday</p>
                      <p className="text-[11px] text-slate-400">9:00 AM — 8:00 PM Pakistan Standard Time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Campus Centers */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-indigo" />
                  <span>Physical Academic Centers</span>
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="font-bold text-slate-900">Lahore Main Campus</p>
                    <p>42-B, Main Boulevard, Gulberg III, Lahore, Punjab</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="font-bold text-slate-900">Islamabad Academic Hub</p>
                    <p>Ground Floor, Evacuee Trust Complex, F-5/1, Islamabad</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="font-bold text-slate-900">Karachi Counseling Center</p>
                    <p>Block 4, Marine Promenade, Clifton, Karachi, Sindh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
