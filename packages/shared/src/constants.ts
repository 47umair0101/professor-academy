/**
 * Professor Academy - Core Constants
 */

export const APP_NAME = 'Professor Academy';
export const APP_TAGLINE = 'Excellence in Professional & Academic Education';
export const DEFAULT_CURRENCY = 'PKR';
export const DEFAULT_COMMISSION_RATE = 80; // 80% to teacher

export const EXAM_BODIES = [
  'Federal Board (FBISE)',
  'Lahore Board (BISE Lahore)',
  'Rawalpindi Board (BISE Rawalpindi)',
  'Karachi Board (BIEK)',
  'Peshawar Board (BISE Peshawar)',
  'Cambridge (O-Level)',
  'Cambridge (A-Level)',
  'MDCAT / NUMS',
  'ECAT / NUST (NET)',
  'HEC / Higher Education',
] as const;

export const COURSE_CATEGORIES = [
  'Pre-Medical & Biology',
  'Pre-Engineering & Physics',
  'Computer Science & AI',
  'Commerce & Accounting',
  'General Sciences & Mathematics',
  'English Language & Literature',
  'Competitive Exam Prep (MDCAT/ECAT)',
] as const;

export const DEFAULT_PLATFORM_SETTINGS = {
  id: 1,
  allow_teacher_direct_publish: false,
  bank_details: {
    bank_name: 'Meezan Bank Limited',
    account_title: 'Professor Academy Private Limited',
    account_number: '0101-0105432198',
    iban: 'PK42MEZN0001010105432198',
    branch_code: '0101',
  },
  jazzcash_details: {
    account_title: 'Professor Academy',
    account_number: '0300-1234567',
    till_id: '7654321',
  },
  easypaisa_details: {
    account_title: 'Professor Academy',
    account_number: '0345-9876543',
  },
};

/**
 * Format currency strictly in Pakistani Rupees
 * Example: formatPKR(4500) => "PKR 4,500"
 */
export function formatPKR(amount: number): string {
  return `PKR ${new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
