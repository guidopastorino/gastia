import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { IconName } from './types';

type Props = {
  icon: IconName;
  size?: number;
  /** `rounded` draws a rounded square instead of a circle. */
  shape?: 'circle' | 'rounded';
  variant?: 'muted' | 'solid';
};

export function IconCircle({ icon, size = 44, shape = 'circle', variant = 'muted' }: Props) {
  const { colors } = useTheme();
  const solid = variant === 'solid';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? size / 2 : size * 0.28,
        backgroundColor: solid ? colors.primary : colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={icon} size={size * 0.48} color={solid ? colors.onPrimary : colors.icon} />
    </View>
  );
}
