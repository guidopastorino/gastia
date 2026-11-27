import { Text, type TextProps, type TextStyle } from 'react-native';

import type { Colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';
import { fonts } from '../../theme/typography';

const VARIANTS = {
  display: { fontFamily: fonts.semibold, fontSize: 40, lineHeight: 46, letterSpacing: -1.4 },
  title: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, letterSpacing: -0.8 },
  heading: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.3 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, letterSpacing: -0.1 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23, letterSpacing: -0.1 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
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
