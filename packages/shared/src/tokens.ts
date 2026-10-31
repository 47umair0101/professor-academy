/**
 * Professor Academy - Modern Academic Design System Tokens
 * An elevated, minimal, and premium aesthetic superior to legacy LMS platforms
 * Shared across Web (Tailwind CSS) & Mobile (NativeWind)
 */

export const brandColors = {
  // Primary Authority & Ink
  primary: {
    DEFAULT: '#0F172A', // Deep Obsidian Slate
    hover: '#1E293B',
    active: '#020617',
    surface: '#F8FAFC',
  },
  // Signature Academic Accent (Modern Royal Indigo)
  accent: {
    DEFAULT: '#4F46E5', // Electric Royal Indigo
    hover: '#4338CA',
    active: '#3730A3',
    light: '#6366F1',
    surface: '#EEF2FF',
    subtle: '#F5F7FF',
  },
  // Heritage Honor & Achievement (Warm Amber Gold)
  gold: {
    DEFAULT: '#D97706', // Warm Amber Gold
    hover: '#B45309',
    surface: '#FEF3C7',
    text: '#92400E',
    star: '#F59E0B',
  },
  // Backgrounds & Surfaces
  canvas: {
    white: '#FFFFFF', // Clean White cards & containers
    subtle: '#F8F9FA', // Modern off-white background
    hover: '#F1F5F9',
  },
  // Clean Modern Structural Borders
  border: {
    DEFAULT: '#E2E8F0', // Slate 200
    light: '#F1F5F9',   // Slate 100
    dark: '#CBD5E1',    // Slate 300
    focus: '#4F46E5',
  },
  // Text & Typography
  text: {
    primary: '#0F172A',   // Slate 900
    secondary: '#475569', // Slate 600
    muted: '#94A3B8',     // Slate 400
    inverse: '#FFFFFF',
  },
  // Status Colors
  status: {
    success: {
      DEFAULT: '#16A34A',
      surface: '#DCFCE7',
      text: '#15803D',
      border: '#BBF7D0',
    },
    warning: {
      DEFAULT: '#D97706',
      surface: '#FEF3C7',
      text: '#92400E',
      border: '#FDE68A',
    },
    danger: {
      DEFAULT: '#DC2626',
      surface: '#FEE2E2',
      text: '#B91C1C',
      border: '#FECACA',
    },
    info: {
      DEFAULT: '#2563EB',
      surface: '#EFF6FF',
      text: '#1D4ED8',
      border: '#BFDBFE',
    },
  },
} as const;

export const typography = {
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;
