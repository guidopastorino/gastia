import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/tokens';
import type { IconName } from './types';

type Props = {
  label: string;
  icon?: IconName;
  /** Small status dot before the label. */
  dot?: boolean;
  variant?: 'muted' | 'outline' | 'solid';
  size?: 'sm' | 'md';
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, icon, dot, variant = 'muted', size = 'sm', uppercase, style }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'solid' ? colors.primary : variant === 'muted' ? colors.surface : 'transparent';
  const fg = variant === 'solid' ? colors.onPrimary : colors.textSecondary;
  const border = variant === 'outline' ? colors.border : 'transparent';
  const fontSize = size === 'sm' ? 12 : 14;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bg, borderColor: border, paddingVertical: size === 'sm' ? 4 : 7 },
        style,
      ]}
    >
      {dot && <View style={[styles.dot, { backgroundColor: fg }]} />}
      {icon && <Ionicons name={icon} size={fontSize + 2} color={fg} />}
      <Text
        style={[
          styles.label,
          { color: fg, fontSize },
          uppercase && { textTransform: 'uppercase', letterSpacing: 0.8 },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontWeight: '600' },
});
