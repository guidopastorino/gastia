import Ionicons from '@expo/vector-icons/Ionicons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { Colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/tokens';
import type { IconName } from './types';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZES: Record<Size, { height: number; fontSize: number; icon: number; paddingX: number }> = {
  sm: { height: 44, fontSize: 14, icon: 17, paddingX: 12 },
  md: { height: 50, fontSize: 16, icon: 19, paddingX: 18 },
  lg: { height: 58, fontSize: 18, icon: 22, paddingX: 22 },
};

function variantColors(variant: Variant, c: Colors) {
  switch (variant) {
    case 'primary':
      return { bg: c.primary, fg: c.onPrimary, border: c.primary };
    case 'secondary':
      return { bg: c.surface, fg: c.text, border: c.surface };
    case 'outline':
      return { bg: c.card, fg: c.text, border: c.border };
    case 'ghost':
      return { bg: 'transparent', fg: c.textSecondary, border: 'transparent' };
  }
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const { colors } = useTheme();
  const { bg, fg, border } = variantColors(variant, colors);
  const s = SIZES[size];
  const iconEl = icon && <Ionicons name={icon} size={s.icon} color={fg} />;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { height: s.height, paddingHorizontal: s.paddingX, backgroundColor: bg, borderColor: border },
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {iconPosition === 'left' && iconEl}
          <Text style={[styles.label, { color: fg, fontSize: s.fontSize }]} numberOfLines={1}>
            {title}
          </Text>
          {iconPosition === 'right' && iconEl}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  label: { fontWeight: '600' },
});
