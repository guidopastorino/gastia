export type ColorScheme = 'light' | 'dark';

export type Colors = {
  /** Page background behind cards. */
  background: string;
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
    background: '#f6f6f7',
    card: '#ffffff',
    surface: '#f1f1f3',
    text: '#0a0a0b',
    textSecondary: '#6b6b73',
    textTertiary: '#a0a0a8',
    icon: '#18181b',
    border: '#e4e4e7',
    separator: '#f0f0f2',
    pressed: '#f1f1f3',
    primary: '#0a0a0b',
    onPrimary: '#ffffff',
    link: '#0a0a0b',
    danger: '#dc2626',
    success: '#16a34a',
    segmentBackground: '#ececef',
  },
  dark: {
    background: '#09090b',
    card: '#161618',
    surface: '#202024',
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    textTertiary: '#6b6b73',
    icon: '#e4e4e7',
    border: '#2a2a2f',
    separator: '#222226',
    pressed: '#202024',
    primary: '#fafafa',
    onPrimary: '#0a0a0b',
    link: '#fafafa',
    danger: '#f87171',
    success: '#4ade80',
    segmentBackground: '#202024',
  },
};
