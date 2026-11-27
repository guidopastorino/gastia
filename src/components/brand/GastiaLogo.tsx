import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  size?: number;
};

/** App mark: diamond glyph inside a rounded tile. */
export function GastiaLogo({ size = 40 }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityLabel="gastia"
    >
      <Ionicons name="diamond-outline" size={size * 0.5} color={colors.text} />
    </View>
  );
}
