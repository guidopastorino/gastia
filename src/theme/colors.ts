export type ColorScheme = 'light' | 'dark';

export type Colors = {
  /** Page background behind cards. */
  background: string;
  /** Top app header background. */
  header: string;
  card: string;
  /** Muted fill for inputs, chips, icon circles and secondary buttons. */
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  icon: string;
  border: string;
  separator: string;
  pressed: string;
  primary: string;
  onPrimary: string;
  link: string;
  danger: string;
  success: string;
  segmentBackground: string;
};

export const palettes: Record<ColorScheme, Colors> = {
  light: {
    background: '#f5f6f8',
    header: '#ffffff',
    card: '#ffffff',
    surface: '#f1f2f4',
    text: '#0a0a0b',
    textSecondary: '#4b5563',
    textTertiary: '#8b919a',
    icon: '#1f2937',
    border: '#e5e7eb',
    separator: '#eceef1',
    pressed: '#eceef1',
    primary: '#000000',
    onPrimary: '#ffffff',
    link: '#111827',
    danger: '#dc2626',
    success: '#15803d',
    segmentBackground: '#eceef1',
  },
  dark: {
    background: '#000000',
    header: '#0b0b0c',
    card: '#141416',
    surface: '#1f1f22',
    text: '#f5f5f7',
    textSecondary: '#a1a1aa',
    textTertiary: '#71717a',
    icon: '#e4e4e7',
    border: '#27272a',
    separator: '#232326',
    pressed: '#232326',
    primary: '#ffffff',
    onPrimary: '#000000',
    link: '#e4e4e7',
    danger: '#f87171',
    success: '#4ade80',
    segmentBackground: '#1f1f22',
  },
};
