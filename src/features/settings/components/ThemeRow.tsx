import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { AppText, ListRow, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme, type ThemePreference } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';

const CURRENT: Record<ThemePreference, string> = {
  light: 'Modo claro',
  dark: 'Modo oscuro',
  system: 'Según el sistema',
};

/** The toggle button offers the next mode: claro → oscuro → sistema → claro. */
const NEXT: Record<ThemePreference, { value: ThemePreference; label: string; icon: IconName }> = {
  light: { value: 'dark', label: 'Oscuro', icon: 'moon-outline' },
  dark: { value: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  system: { value: 'light', label: 'Claro', icon: 'sunny-outline' },
};

export function ThemeRow() {
  const styles = useStyles();
  const { preference, setPreference, colors } = useTheme();
  const next = NEXT[preference];

  return (
    <ListRow
      icon="contrast-outline"
      title="Tema"
      subtitle={CURRENT[preference]}
      accessory={
        <Pressable
          onPress={() => setPreference(next.value)}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={`Cambiar a ${next.label}`}
          hitSlop={6}
        >
          <Ionicons name={next.icon} size={15} color={colors.text} />
          <AppText variant="smallStrong">{next.label}</AppText>
        </Pressable>
      }
    />
  );
}

const useStyles = makeStyles((c) => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: c.surface,
  },
}));
