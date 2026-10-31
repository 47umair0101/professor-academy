import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid academic or personal email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signupSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, 'Must be a valid Pakistani phone number (e.g. 03001234567 or +923001234567)')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const enrollmentPaymentSchema = z.object({
  courseId: z.string().uuid('Invalid Course ID'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA']),
  transactionId: z.string().min(4, 'Transaction ID must be at least 4 characters').max(48, 'Transaction ID too long'),
  amountPaid: z.number().positive('Amount paid must be greater than zero'),
  receiptUrl: z.string().min(10, 'Receipt image upload is required'),
});

export const receiptOcrRequestSchema = z.object({
  imageBase64: z.string().min(20, 'Image data is required'),
  mimeType: z.string().default('image/jpeg'),
});

export const feeVerificationActionSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),
  action: z.enum(['APPROVE', 'REJECT']),
  adminNotes: z.string().optional(),
});

export const courseCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  slug: z.string().min(3).optional(),
  category: z.string().min(2, 'Category is required'),
  shortDescription: z.string().min(10, 'Short description is required').max(300),
  fullDescription: z.string().min(30, 'Full description is required'),
  eligibilityCriteria: z.string().min(10, 'Eligibility criteria is required so students know if this course fits them'),
  pricePkr: z.number().min(0, 'Price in PKR must be 0 (Free) or positive'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
});

export const lessonItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Lesson title is required'),
  lessonType: z.enum(['VIDEO', 'TEXT', 'QUIZ']).default('VIDEO'),
  contentHtml: z.string().optional().default(''),
  videoUrl: z.string().optional().default(''),
  videoDurationSeconds: z.number().min(0).default(0),
  isFreePreview: z.boolean().default(false),
  sortOrder: z.number().optional().default(0),
});

export const sectionItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Section title is required'),
  sortOrder: z.number().optional().default(0),
  lessons: z.array(lessonItemSchema).default([]),
});

export const fullCurriculumSchema = z.object({
  course: courseCreateSchema,
  sections: z.array(sectionItemSchema).min(1, 'Please add at least one curriculum section'),
  publishAction: z.enum(['DRAFT', 'SUBMIT_FOR_REVIEW', 'DIRECT_PUBLISH']).default('DRAFT'),
});

export const aiCoPilotPromptSchema = z.object({
  mode: z.enum(['SYLLABUS', 'MCQS', 'POLISH', 'SUMMARY']),
  topic: z.string().min(3, 'Topic is required'),
  examTarget: z.string().optional().default('General Pakistan Academic & Entry Test'),
  itemCount: z.number().min(1).max(20).optional().default(5),
  rawContent: z.string().optional(),
});

export const teacherProvisionSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid faculty email address'),
  department: z.string().min(2, 'Department / subject specialization is required'),
  phone: z.string().optional().or(z.literal('')),
  commissionRate: z.number().min(50).max(95).default(80),
  canDirectPublish: z.boolean().default(false),
  initialPassword: z.string().min(6, 'Initial password must be at least 6 characters'),
});

export const platformSettingsSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountTitle: z.string().min(2, 'Account title is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  iban: z.string().min(10, 'IBAN is required'),
  branchCode: z.string().optional(),
  jazzcashTitle: z.string().min(2, 'JazzCash title is required'),
  jazzcashNumber: z.string().min(10, 'JazzCash mobile number is required'),
  jazzcashTillId: z.string().optional(),
  easypaisaTitle: z.string().min(2, 'Easypaisa title is required'),
  easypaisaNumber: z.string().min(10, 'Easypaisa mobile number is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type EnrollmentPaymentInput = z.infer<typeof enrollmentPaymentSchema>;
export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type LessonItemInput = z.infer<typeof lessonItemSchema>;
export type SectionItemInput = z.infer<typeof sectionItemSchema>;
export type FullCurriculumInput = z.infer<typeof fullCurriculumSchema>;
export type AICoPilotPromptInput = z.infer<typeof aiCoPilotPromptSchema>;
export type TeacherProvisionInput = z.infer<typeof teacherProvisionSchema>;
export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;
