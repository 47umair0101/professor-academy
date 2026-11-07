'use client';

import * as React from 'react';
import {
  User,
  ShieldCheck,
  GraduationCap,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Phone,
  MapPin,
  Mail,
  Loader2,
  Trash2,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  KeyRound,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AuthUser } from '@/lib/auth/auth-context';

interface StudentProfileViewProps {
  user: AuthUser;
  onProfileUpdated: (updated: Partial<AuthUser>) => void;
  enrolledCount?: number;
  completedCount?: number;
}

export function StudentProfileView({
  user,
  onProfileUpdated,
  enrolledCount = 1,
  completedCount = 0,
}: StudentProfileViewProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<'personal' | 'security' | 'academic'>(
    'personal'
  );

  // --- Profile Details State ---
  const [fullName, setFullName] = React.useState(user.fullName || '');
  const [phone, setPhone] = React.useState(user.phone || '+92 300 1234567');
  const [city, setCity] = React.useState(user.city || 'Lahore');
  const [program, setProgram] = React.useState(user.program || 'MDCAT Preparation (2026)');
  const [bio, setBio] = React.useState(
    'Aspiring medical entrant preparing for high-yield PMDC/UHS concepts with daily past paper practice.'
  );
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl || '');

  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [profileMessage, setProfileMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // --- Avatar Upload State ---
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  // --- Password Change State ---
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordMessage, setPasswordMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fetch real profile on load if bio or fresh fields exist
  React.useEffect(() => {
    if (!user.id) return;
    fetch(`/api/user/profile?userId=${encodeURIComponent(user.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          if (data.profile.fullName) setFullName(data.profile.fullName);
          if (data.profile.phone) setPhone(data.profile.phone);
          if (data.profile.city) setCity(data.profile.city);
          if (data.profile.program) setProgram(data.profile.program);
          if (data.profile.bio) setBio(data.profile.bio);
          if (data.profile.avatarUrl) setAvatarUrl(data.profile.avatarUrl);
        }
      })
      .catch(() => {});
  }, [user.id]);

  // Synchronize when parent user changes
  React.useEffect(() => {
    if (user.fullName) setFullName(user.fullName);
    if (user.phone) setPhone(user.phone);
    if (user.city) setCity(user.city);
    if (user.program) setProgram(user.program);
    if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
  }, [user]);

  // --- Password Validation Rules ---
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = Boolean(newPassword && newPassword === confirmPassword);
  const isDifferentFromCurrent = !currentPassword || newPassword !== currentPassword;

  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumberOrSymbol].filter(Boolean).length;
  const isPasswordFormValid =
    Boolean(currentPassword) &&
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasNumberOrSymbol &&
    passwordsMatch &&
    isDifferentFromCurrent;

  // --- Handlers ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          fullName,
          phone,
          city,
          program,
          bio,
          avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      onProfileUpdated({
        fullName,
        phone,
        city,
        program,
        avatarUrl,
      });

      setTimeout(() => setProfileMessage(null), 4000);
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Could not save profile' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileMessage({
        type: 'error',
        text: 'Please select an image file (JPG, PNG, or WebP).',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage({
        type: 'error',
        text: 'Selected image exceeds the 5MB size limit.',
      });
      return;
    }

    setIsUploadingAvatar(true);
    setProfileMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setAvatarUrl(data.avatarUrl);
      onProfileUpdated({ avatarUrl: data.avatarUrl });
      setProfileMessage({ type: 'success', text: 'Profile picture updated successfully!' });
      setTimeout(() => setProfileMessage(null), 4000);
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Error uploading photo' });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, avatarUrl: '' }),
      });

      if (!res.ok) throw new Error('Failed to remove photo');

      setAvatarUrl('');
      onProfileUpdated({ avatarUrl: '' });
      setProfileMessage({ type: 'success', text: 'Profile picture removed.' });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Error removing photo' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage(null);

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordMessage({
        type: 'success',
        text: 'Your password was changed successfully! A security alert was added to your notification log.',
      });

      // Clear password inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 5000);
    } catch (err: any) {
      setPasswordMessage({
        type: 'error',
        text: err.message || 'Could not update password. Please check your current password.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const userInitials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'HF';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Profile & Security
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Student
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage your personal academic profile, photo, program specialization, and secure account credentials.
          </p>
        </div>

        {/* Quick Identity Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl">
          <div className="h-9 w-9 rounded-full bg-brand-indigo text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">{fullName || 'Student'}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('personal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'personal'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Personal Details & Photo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveSubTab('academic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'academic'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Academic Standing</span>
        </button>
      </div>

      {/* SUB-VIEW 1: PERSONAL DETAILS & AVATAR */}
      {activeSubTab === 'personal' && (
        <div className="space-y-6">
          {/* Avatar Management Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Profile Photo</h3>
            <p className="text-xs text-slate-500 mb-5">
              Upload a clear profile picture. This avatar appears on your certificates, topic discussions, and teacher Q&A submissions.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-slate-100 overflow-hidden bg-gradient-to-br from-indigo-500 to-brand-indigo flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>

                {/* Camera Overlay Icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title="Upload new picture"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-brand-indigo text-white shadow-md hover:bg-brand-indigoHover flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border-2 border-white"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Upload Controls & Guidelines */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileSelected}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isUploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                    className="font-bold text-xs flex items-center gap-2"
                  >
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>Upload New Photo</span>
                      </>
                    )}
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploadingAvatar}
                      onClick={handleRemoveAvatar}
                      className="font-bold text-xs text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  Recommended: Square JPG, PNG, or WebP. Maximum file size: 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {profileMessage && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                profileMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {profileMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          {/* Personal Details Form */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Full Legal Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hamza Farooq"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium"
                />
                <span className="text-[10px] text-slate-400">This exact name will be stamped on your verified course completion certificates.</span>
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>Academic Email Address</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    Verified ID
                  </span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 font-medium cursor-not-allowed select-none"
                />
                <span className="text-[10px] text-slate-400">Registered primary email address cannot be changed directly. Contact support if needed.</span>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>Phone Number (SMS & WhatsApp Alerts)</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium"
                />
              </div>

              {/* City / Campus */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>City / Examination Center</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Islamabad, Karachi, Peshawar, Multan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium"
                />
              </div>

              {/* Target Academic Program */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  <span>Target Academic Program & Goal</span>
                </label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium bg-white"
                >
                  <option value="MDCAT Preparation (2026)">MDCAT Preparation (2026) — PMDC Medical College Admissions</option>
                  <option value="ECAT Engineering Prep (2026)">ECAT Engineering Prep (2026) — UET & NUST Admissions</option>
                  <option value="FSc Pre-Medical (Part 1 & 2)">FSc Pre-Medical (Part 1 & 2) — FBISE / BISE Boards</option>
                  <option value="FSc Pre-Engineering (Part 1 & 2)">FSc Pre-Engineering (Part 1 & 2) — FBISE / BISE Boards</option>
                  <option value="Cambridge CAIE A-Levels">Cambridge CAIE A-Levels (Physics, Chemistry, Biology, Math)</option>
                  <option value="CSS & PMS Competitive Exams">CSS & PMS Competitive Exams (Federal / Provincial)</option>
                  <option value="Computer Science & Programming">Computer Science & Full-Stack Web Development</option>
                </select>
                <span className="text-[10px] text-slate-400">Customizes your Gemini AI Study Tutor recommendations and past paper mock suggestions.</span>
              </div>

              {/* Academic Bio / Aspirations */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
                  <span>Study Objective & College Aspirations</span>
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your academic targets or target university (e.g. King Edward Medical University, NUST, FAST, etc.)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingProfile}
                className="font-bold text-xs flex items-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: SECURITY & PASSWORD (INDUSTRY-STANDARD SOLUTION) */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Security Information Header Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Cryptographic Password Security</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To protect your academic progress, fee verification receipts, and official certificate credentials, changing your password requires verifying your existing password first. Passwords are salted and encrypted via PostgreSQL bcrypt algorithms.
              </p>
            </div>
            <div className="shrink-0 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Standard</p>
              <p className="text-xs font-bold text-indigo-300">Bcrypt BF Encryption</p>
            </div>
          </div>

          {/* Feedback Banner */}
          {passwordMessage && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                passwordMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {passwordMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand-indigo" />
              <span>Update Account Password</span>
            </h3>

            {/* 1. Current / Old Password */}
            <div className="space-y-1.5 max-w-md">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Current / Old Password</span>
                <span className="text-[10px] text-rose-600 font-bold">* Required for authorization</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your existing account password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                (For demo accounts, use <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">student123</code> or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">Password123</code>)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* 2. New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 3. Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all font-medium ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-slate-200 focus:ring-brand-indigo/20 focus:border-brand-indigo'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Meter & Interactive Checklist */}
            {newPassword.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">Password Strength:</span>
                  <span
                    className={`text-[11px] font-bold ${
                      strengthScore <= 1
                        ? 'text-rose-600'
                        : strengthScore === 2
                        ? 'text-amber-600'
                        : strengthScore === 3
                        ? 'text-indigo-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {strengthScore <= 1
                      ? 'Weak'
                      : strengthScore === 2
                      ? 'Fair'
                      : strengthScore === 3
                      ? 'Good'
                      : 'Strong & Secure'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full flex-1 transition-all ${
                      strengthScore >= 1
                        ? strengthScore === 1
                          ? 'bg-rose-500'
                          : strengthScore === 2
                          ? 'bg-amber-500'
                          : strengthScore === 3
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                        : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 transition-all ${
                      strengthScore >= 2
                        ? strengthScore === 2
                          ? 'bg-amber-500'
                          : strengthScore === 3
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                        : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 transition-all ${
                      strengthScore >= 3
                        ? strengthScore === 3
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                        : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 transition-all ${
                      strengthScore >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                    }`}
                  />
                </div>

                {/* Rules Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasUpper ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasLower ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasNumberOrSymbol ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>One number or special symbol</span>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className={`flex items-center gap-1.5 sm:col-span-2 ${passwordsMatch ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${passwordsMatch ? 'text-emerald-600' : 'text-rose-400'}`} />
                      <span>{passwordsMatch ? 'New passwords match' : 'Passwords do not match yet'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isChangingPassword || !isPasswordFormValid}
                className="font-bold text-xs flex items-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Verifying & Encrypting...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Update Password Securely</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 3: ACADEMIC STANDING */}
      {activeSubTab === 'academic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{enrolledCount}</p>
              <p className="text-xs font-semibold text-slate-500">Active Course Enrollments</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{completedCount}</p>
              <p className="text-xs font-semibold text-slate-500">Completed Video & Text Lectures</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-2">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs font-semibold text-slate-500">Verified Certificate Eligibility</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Academic Standing Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your profile is registered as an enrolled candidate in <strong>{program}</strong>. Your test scores, quiz submissions, and verified completion credentials remain permanently bound to your account ID.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Badge variant="indigo" className="font-bold text-xs py-1 px-3">
                Account ID: {user.id.slice(0, 13)}...
              </Badge>
              <Badge variant="success" className="font-bold text-xs py-1 px-3">
                Status: In Good Standing
              </Badge>
              <Badge variant="gold" className="font-bold text-xs py-1 px-3">
                Examination Year: 2026
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
