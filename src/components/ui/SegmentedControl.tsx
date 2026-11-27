import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/tokens';
import { fonts } from '../../theme/typography';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedControl<T extends string>({ options, value, onChange, style }: Props<T>) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.segmentBackground }, style]}
      accessibilityRole="radiogroup"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && { backgroundColor: colors.primary }]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.onPrimary : colors.textSecondary },
                selected && { fontFamily: fonts.semibold },
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: radius.pill, padding: 4 },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  label: { fontFamily: fonts.medium, fontSize: 14 },
});
