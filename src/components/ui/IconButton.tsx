import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { IconName } from './types';

type Props = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
  /** `muted` draws a filled circle behind the icon. */
  variant?: 'plain' | 'muted' | 'primary';
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 22,
  variant = 'plain',
  color,
  style,
}: Props) {
  const { colors } = useTheme();
  const box = size + 18;
  const bg = variant === 'muted' ? colors.surface : variant === 'primary' ? colors.primary : 'transparent';
  const fg = color ?? (variant === 'primary' ? colors.onPrimary : colors.icon);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [
        {
          width: box,
          height: box,
          borderRadius: box / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          opacity: pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={fg} />
    </Pressable>
  );
}
