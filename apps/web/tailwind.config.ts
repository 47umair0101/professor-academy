import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F172A',
          primaryHover: '#1E293B',
          primaryActive: '#020617',
          indigo: '#4F46E5',
          indigoHover: '#4338CA',
          indigoLight: '#6366F1',
          indigoSurface: '#EEF2FF',
          indigoSubtle: '#F5F7FF',
          gold: '#D97706',
          goldHover: '#B45309',
          goldSurface: '#FEF3C7',
          goldText: '#92400E',
          star: '#F59E0B',
          bg: '#FFFFFF',
          canvas: '#F8F9FA',
          border: '#E2E8F0',
          borderLight: '#F1F5F9',
          borderDark: '#CBD5E1',
          textPrimary: '#0F172A',
          textSecondary: '#475569',
          textMuted: '#94A3B8',
          successBg: '#DCFCE7',
          successText: '#15803D',
          dangerBg: '#FEE2E2',
          dangerText: '#B91C1C',
          warningBg: '#FEF3C7',
          warningText: '#92400E',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        card: '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        cardHover: '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        popover: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
