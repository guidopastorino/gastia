import { Text, type TextProps, type TextStyle } from 'react-native';

import type { Colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';

const VARIANTS = {
  display: { fontSize: 36, fontWeight: '800', letterSpacing: -0.8 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  heading: { fontSize: 19, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 16 },
  bodyStrong: { fontSize: 16, fontWeight: '600' },
  small: { fontSize: 14 },
  smallStrong: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '600' },
  overline: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof VARIANTS;
export type TextTone = 'default' | 'secondary' | 'tertiary' | 'inverse' | 'danger' | 'success';

const TONES: Record<TextTone, keyof Colors> = {
  default: 'text',
  secondary: 'textSecondary',
  tertiary: 'textTertiary',
  inverse: 'onPrimary',
  danger: 'danger',
  success: 'success',
};

type Props = TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function AppText({ variant = 'body', tone = 'default', style, ...rest }: Props) {
  const { colors } = useTheme();
  return <Text style={[VARIANTS[variant], { color: colors[TONES[tone]] }, style]} {...rest} />;
}
