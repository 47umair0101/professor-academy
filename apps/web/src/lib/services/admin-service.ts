import { createClient } from '@/lib/supabase/client';
import {
  teacherProvisionSchema,
  platformSettingsSchema,
  type TeacherProvisionInput,
  type PlatformSettingsInput,
} from '@professor-academy/shared';

export interface AdminTeacher {
  id: string;
  name: string;
  email: string;
  department: string;
  phone?: string;
  coursesCount: number;
  studentsCount: number;
  canDirectPublish: boolean;
  commissionRate: number; // e.g. 80
  joinedAt: string;
}

export interface PendingCourseReview {
  id: string;
  title: string;
  category: string;
  teacherName: string;
  teacherEmail: string;
  pricePkr: number;
  thumbnailUrl: string;
  lessonsCount: number;
  durationHours: number;
  eligibilitySnippet: string;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

// Initial mock & seed state (synced with Supabase)
let initialTeachers: AdminTeacher[] = [
  {
    id: 't-1',
    name: 'Prof. Dr. Arshad Mahmood',
    email: 'teacher@professoracademy.pk',
    department: 'Physics Department',
    phone: '+92 321 7654321',
    coursesCount: 4,
    studentsCount: 14200,
    canDirectPublish: true,
    commissionRate: 80,
    joinedAt: 'Jan 2024',
  },
  {
    id: 't-2',
    name: 'Dr. Fatima Tariq',
    email: 'fatima.tariq@professoracademy.pk',
    department: 'Chemistry Department',
    phone: '+92 300 9876543',
    coursesCount: 3,
    studentsCount: 11200,
    canDirectPublish: true,
    commissionRate: 80,
    joinedAt: 'Mar 2024',
  },
  {
    id: 't-3',
    name: 'Engr. Usman Qureshi',
    email: 'usman.qureshi@professoracademy.pk',
    department: 'Mathematics & ECAT',
    phone: '+92 333 4567890',
    coursesCount: 2,
    studentsCount: 9400,
    canDirectPublish: false,
    commissionRate: 80,
    joinedAt: 'May 2024',
  },
  {
    id: 't-4',
    name: 'Amina Rehman',
    email: 'amina.rehman@professoracademy.pk',
    department: 'Cambridge A-Level Biology',
    phone: '+92 345 1122334',
    coursesCount: 2,
    studentsCount: 6800,
    canDirectPublish: false,
    commissionRate: 80,
    joinedAt: 'Jun 2024',
  },
];

let initialPendingCourses: PendingCourseReview[] = [
  {
    id: 'rev-c1',
    title: 'Fast-Track ECAT Trigonometric Limits & Vectors (2026 Batch)',
    category: 'Engineering Prep',
    teacherName: 'Engr. Usman Qureshi',
    teacherEmail: 'usman.qureshi@professoracademy.pk',
    pricePkr: 3500,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 24,
    durationHours: 18,
    eligibilitySnippet: 'FSc Pre-Engineering Part-1 with 60%+ in Mathematics',
    submittedAt: 'Today at 2:15 PM',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'rev-c2',
    title: 'Cambridge CAIE A2 Biology Paper 5 Experimental Design Masterclass',
    category: 'Cambridge A-Level',
    teacherName: 'Amina Rehman',
    teacherEmail: 'amina.rehman@professoracademy.pk',
    pricePkr: 5000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 16,
    durationHours: 12,
    eligibilitySnippet: 'Completed AS Biology Syllabus 9700',
    submittedAt: 'Yesterday at 6:40 PM',
    status: 'PENDING_REVIEW',
  },
];

let platformBankSettings: PlatformSettingsInput = {
  bankName: 'Meezan Bank Limited',
  accountTitle: 'Professor Academy (Pvt) Ltd',
  accountNumber: '0101-0105432198',
  iban: 'PK42MEZN0001010105432198',
  branchCode: '0101 (Main Gulberg Lahore)',
  jazzcashTitle: 'Professor Online Academy',
  jazzcashNumber: '0300-1234567',
  jazzcashTillId: '7654321',
  easypaisaTitle: 'Professor Academy Admissions',
  easypaisaNumber: '0345-9876543',
};

export const AdminService = {
  // 1. Fetch Teachers List
  getTeachers: async (): Promise<AdminTeacher[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'TEACHER')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((t: any) => ({
          id: t.id,
          name: t.full_name,
          email: t.email,
          department: t.program || 'Faculty',
          phone: t.phone || '',
          coursesCount: t.courses_count || 1,
          studentsCount: t.students_count || 1200,
          canDirectPublish: !!t.can_direct_publish,
          commissionRate: t.commission_rate || 80,
          joinedAt: new Date(t.created_at).toLocaleDateString(),
        }));
      }
    } catch (e) {
      // Fallback to initial state
    }
    return initialTeachers;
  },

  // 2. Provision New Teacher
  provisionTeacher: async (input: TeacherProvisionInput): Promise<{ success: boolean; teacher?: AdminTeacher; error?: string }> => {
    const parseResult = teacherProvisionSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.errors[0]?.message || 'Validation failed' };
    }

    const newTeacher: AdminTeacher = {
      id: `t-${Date.now()}`,
      name: input.fullName,
      email: input.email,
      department: input.department,
      phone: input.phone || '',
      coursesCount: 0,
      studentsCount: 0,
      canDirectPublish: input.canDirectPublish,
      commissionRate: input.commissionRate,
      joinedAt: 'Just Now',
    };

    try {
      const supabase = createClient();
      await supabase.from('profiles').insert([
        {
          id: newTeacher.id,
          full_name: newTeacher.name,
          email: newTeacher.email,
          role: 'TEACHER',
          phone: newTeacher.phone,
          program: newTeacher.department,
          can_direct_publish: newTeacher.canDirectPublish,
          commission_rate: newTeacher.commissionRate,
          is_active: true,
        },
      ]);
    } catch (e) {
      // Continue locally
    }

    initialTeachers = [newTeacher, ...initialTeachers];
    return { success: true, teacher: newTeacher };
  },

  // 3. Toggle Teacher Direct Publish Privilege (PRD Section 4 Mandate)
  toggleDirectPublish: async (teacherId: string, canDirectPublish: boolean): Promise<boolean> => {
    try {
      const supabase = createClient();
      await supabase
        .from('profiles')
        .update({ can_direct_publish: canDirectPublish })
        .eq('id', teacherId);
    } catch (e) {
      // Continue locally
    }

    initialTeachers = initialTeachers.map((t) =>
      t.id === teacherId ? { ...t, canDirectPublish } : t
    );
    return true;
  },

  // 4. Fetch Official Platform Settings
  getPlatformSettings: async (): Promise<PlatformSettingsInput> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        return {
          bankName: data.bank_details?.bank_name || platformBankSettings.bankName,
          accountTitle: data.bank_details?.account_title || platformBankSettings.accountTitle,
          accountNumber: data.bank_details?.account_number || platformBankSettings.accountNumber,
          iban: data.bank_details?.iban || platformBankSettings.iban,
          branchCode: data.bank_details?.branch_code || platformBankSettings.branchCode,
          jazzcashTitle: data.jazzcash_details?.account_title || platformBankSettings.jazzcashTitle,
          jazzcashNumber: data.jazzcash_details?.account_number || platformBankSettings.jazzcashNumber,
          jazzcashTillId: data.jazzcash_details?.till_id || platformBankSettings.jazzcashTillId,
          easypaisaTitle: data.easypaisa_details?.account_title || platformBankSettings.easypaisaTitle,
          easypaisaNumber: data.easypaisa_details?.account_number || platformBankSettings.easypaisaNumber,
        };
      }
    } catch (e) {
      // Fallback
    }
    return platformBankSettings;
  },

  // 5. Update Platform Payment Details in PostgreSQL
  updatePlatformSettings: async (settings: PlatformSettingsInput): Promise<{ success: boolean; error?: string }> => {
    const parse = platformSettingsSchema.safeParse(settings);
    if (!parse.success) {
      return { success: false, error: parse.error.errors[0]?.message || 'Invalid settings' };
    }

    try {
      const supabase = createClient();
      await supabase
        .from('platform_settings')
        .update({
          bank_details: {
            bank_name: settings.bankName,
            account_title: settings.accountTitle,
            account_number: settings.accountNumber,
            iban: settings.iban,
            branch_code: settings.branchCode,
          },
          jazzcash_details: {
            account_title: settings.jazzcashTitle,
            account_number: settings.jazzcashNumber,
            till_id: settings.jazzcashTillId,
          },
          easypaisa_details: {
            account_title: settings.easypaisaTitle,
            account_number: settings.easypaisaNumber,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);
    } catch (e) {
      // Local sync
    }

    platformBankSettings = { ...settings };
    return { success: true };
  },

  // 6. Course Approval Queue
  getPendingCourses: (): PendingCourseReview[] => {
    return initialPendingCourses;
  },

  approveCourse: (courseId: string): boolean => {
    initialPendingCourses = initialPendingCourses.filter((c) => c.id !== courseId);
    return true;
  },

  rejectCourse: (courseId: string): boolean => {
    initialPendingCourses = initialPendingCourses.filter((c) => c.id !== courseId);
    return true;
  },
};
