import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { fonts } from '../../theme/typography';

type Props = {
  name: string;
  size?: number;
  onPress?: () => void;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] ?? '?');
  return letters.toUpperCase();
}

export function Avatar({ name, size = 40, onPress }: Props) {
  const { colors } = useTheme();

  const circle = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.onPrimary, fontSize: size * 0.4, fontFamily: fonts.semibold }}>
        {initials(name)}
      </Text>
    </View>
  );

  if (!onPress) return circle;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Perfil de ${name}`}
      hitSlop={6}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {circle}
    </Pressable>
  );
}
