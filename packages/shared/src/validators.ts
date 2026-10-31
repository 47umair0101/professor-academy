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
  transactionId: z.string().min(6, 'Transaction ID must be at least 6 characters').max(32, 'Transaction ID too long'),
  amountPaid: z.number().positive('Amount paid must be greater than zero'),
  receiptUrl: z.string().url('Receipt image upload is required'),
});

export const courseCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  category: z.string().min(2, 'Category is required'),
  shortDescription: z.string().min(10, 'Short description is required').max(300),
  fullDescription: z.string().min(30, 'Full description is required'),
  eligibilityCriteria: z.string().min(10, 'Eligibility criteria is required so students know if this course fits them'),
  pricePkr: z.number().min(0, 'Price in PKR must be 0 (Free) or positive'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type EnrollmentPaymentInput = z.infer<typeof enrollmentPaymentSchema>;
export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
