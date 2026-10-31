import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          navy: {
            DEFAULT: '#1A2451',
            deep: '#111838',
            light: '#28377A',
            surface: '#EAEFF9',
            subtle: '#F4F6FC',
          },
          gold: {
            DEFAULT: '#C59B27',
            hover: '#A37E1C',
            light: '#E5C058',
            surface: '#FDF8EB',
            subtle: '#FFFDF9',
          },
          roseGold: {
            DEFAULT: '#B8868B',
            hover: '#9E6C71',
            surface: '#F9EFF0',
            subtle: '#FCF7F7',
          },
          cream: {
            DEFAULT: '#FAF9F6',
            subtle: '#F5F4EE',
          },
          border: {
            DEFAULT: '#E5E3DC',
            light: '#EFECE6',
            dark: '#D0CDC4',
          },
          charcoal: '#222222',
          slate: '#5A6072',
          muted: '#8C93A4',
          status: {
            success: '#15803D',
            successBg: '#DCFCE7',
            warning: '#B45309',
            warningBg: '#FEF3C7',
            danger: '#B91C1C',
            dangerBg: '#FEE2E2',
          },
        },
      },
      fontFamily: {
        heading: ['Poppins', 'var(--font-poppins)', 'sans-serif'],
        body: ['Inter', 'var(--font-inter)', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        academic: '10px',
      },
      maxWidth: {
        academic: '1200px',
      },
      boxShadow: {
        subtle: '0 2px 8px -2px rgba(26, 36, 81, 0.05), 0 1px 4px -1px rgba(26, 36, 81, 0.03)',
        card: '0 4px 16px -4px rgba(26, 36, 81, 0.06), 0 2px 6px -2px rgba(26, 36, 81, 0.03)',
        cardHover: '0 10px 25px -5px rgba(26, 36, 81, 0.1), 0 4px 10px -3px rgba(26, 36, 81, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
