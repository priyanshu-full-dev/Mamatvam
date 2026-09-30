import { Platform } from 'react-native';

export const ThemeColor = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Colors = {
  ...ThemeColor,
  primary: '#EE4D38', // Mamatvam signature coral-red
  primaryDark: '#D43B27',
  primaryLight: '#FFF1EE',
  primaryDisabled: '#C5CCD6',

  // Status & accents
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  border: '#E2E8F0',
  borderInput: '#E5E7EB',
  placeholder: '#9CA3AF',
  text: '#1E1E1E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Language screen card pastels
  langEnglishBg: '#FCE2E2',
  langHindiBg: '#FDE8D7',
  langBanglaBg: '#DFF8D8',
  langTeluguBg: '#D5ECFD',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'system-ui',
    mono: 'Courier',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: "var(--font-display), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "var(--font-serif), Georgia, 'Times New Roman', serif",
    rounded: "var(--font-rounded), 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "var(--font-mono), Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const MaxContentWidth = 800;
export const BottomTabInset = 16;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;
