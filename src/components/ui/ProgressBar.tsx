import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  /** 0..1 */
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, height = 8, color, trackColor, style }: Props) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <View
      style={[
        { height, borderRadius: height / 2, backgroundColor: trackColor ?? colors.surface, overflow: 'hidden' },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
    >
      <View style={{ width: `${pct}%`, height: '100%', borderRadius: height / 2, backgroundColor: color ?? colors.primary }} />
    </View>
  );
}
