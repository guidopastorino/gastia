export type ColorScheme = 'light' | 'dark';

export type Colors = {
  background: string;
  groupedBackground: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  separator: string;
  pressed: string;
  primary: string;
  onPrimary: string;
  link: string;
  danger: string;
  segmentBackground: string;
  segmentSelected: string;
};

export const palettes: Record<ColorScheme, Colors> = {
  light: {
    background: '#ffffff',
    groupedBackground: '#f2f2f7',
    card: '#ffffff',
    text: '#000000',
    textSecondary: '#6d6d72',
    textTertiary: '#8e8e93',
    border: '#dddddd',
    separator: '#c6c6c8',
    pressed: '#e5e5ea',
    primary: '#111111',
    onPrimary: '#ffffff',
    link: '#0969da',
    danger: '#ff3b30',
    segmentBackground: '#e9e9eb',
    segmentSelected: '#ffffff',
  },
  dark: {
    background: '#000000',
    groupedBackground: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#8e8e93',
    textTertiary: '#8e8e93',
    border: '#38383a',
    separator: '#38383a',
    pressed: '#2c2c2e',
    primary: '#ffffff',
    onPrimary: '#000000',
    link: '#0a84ff',
    danger: '#ff453a',
    segmentBackground: '#2c2c2e',
    segmentSelected: '#636366',
  },
};
