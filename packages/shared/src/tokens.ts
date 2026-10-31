/**
 * Professor Academy - Design System Tokens
 * Shared across Web (Tailwind CSS) & Mobile (NativeWind)
 * Strictly follows the Anti-"Vibe-Coded" Academic Aesthetic
 */

export const brandColors = {
  // Primary Academic Brand
  navy: {
    DEFAULT: '#1A2451',
    deep: '#111838',
    light: '#28377A',
    surface: '#EAEFF9',
    subtle: '#F4F6FC',
  },
  // Secondary Heritage Accent
  gold: {
    DEFAULT: '#C59B27',
    hover: '#A37E1C',
    light: '#E5C058',
    surface: '#FDF8EB',
    subtle: '#FFFDF9',
  },
  // Soft Rose-Gold Secondary
  roseGold: {
    DEFAULT: '#B8868B',
    hover: '#9E6C71',
    surface: '#F9EFF0',
    subtle: '#FCF7F7',
  },
  // Backgrounds & Canvas
  canvas: {
    cream: '#FAF9F6', // Main Warm Cream canvas
    white: '#FFFFFF', // Clean White cards/surfaces
    subtle: '#F5F4EE', // Slightly tinted section divider
  },
  // Structural Borders
  border: {
    DEFAULT: '#E5E3DC',
    light: '#EFECE6',
    dark: '#D0CDC4',
  },
  // Text & Ink
  text: {
    charcoal: '#222222', // Primary reading ink
    slate: '#5A6072',    // Secondary subtext
    muted: '#8C93A4',    // Timestamps & disabled placeholders
    inverse: '#FFFFFF',  // Text on Navy/Dark
  },
  // Semantic Status Colors
  status: {
    success: {
      DEFAULT: '#15803D',
      bg: '#DCFCE7',
      border: '#BBF7D0',
    },
    warning: {
      DEFAULT: '#B45309',
      bg: '#FEF3C7',
      border: '#FDE68A',
    },
    danger: {
      DEFAULT: '#B91C1C',
      bg: '#FEE2E2',
      border: '#FECACA',
    },
    info: {
      DEFAULT: '#1D4ED8',
      bg: '#DBEAFE',
      border: '#BFDBFE',
    },
  },
} as const;

export const typography = {
  fonts: {
    heading: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace',
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
