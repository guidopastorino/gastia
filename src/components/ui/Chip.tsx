import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import type { IconName } from './types';

type Props = {
  label: string;
  icon?: IconName;
  /** Small status dot before the label. */
  dot?: boolean;
  variant?: 'muted' | 'outline' | 'solid';
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, icon, dot, variant = 'muted', style }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'solid' ? colors.primary : variant === 'muted' ? colors.surface : 'transparent';
  const fg = variant === 'solid' ? colors.onPrimary : colors.textSecondary;
  const border = variant === 'outline' ? colors.border : 'transparent';

  return (
    <View style={[styles.base, { backgroundColor: bg, borderColor: border }, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: colors.success }]} />}
      {icon && <Ionicons name={icon} size={13} color={fg} />}
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
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
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontFamily: fonts.medium, fontSize: 12 },
});
