import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { AppText, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme, type ThemePreference } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';
import { SettingsRow } from './SettingsRow';

const CURRENT: Record<ThemePreference, string> = {
  light: 'Modo claro activado',
  dark: 'Modo oscuro activado',
  system: 'Según el sistema',
};

/** The toggle button offers the next mode: claro → oscuro → sistema → claro. */
const NEXT: Record<ThemePreference, { value: ThemePreference; label: string; icon: IconName }> = {
  light: { value: 'dark', label: 'Modo Oscuro', icon: 'moon-outline' },
  dark: { value: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  system: { value: 'light', label: 'Modo Claro', icon: 'sunny-outline' },
};

export function ThemeRow() {
  const styles = useStyles();
  const { preference, setPreference, colors } = useTheme();
  const next = NEXT[preference];

  return (
    <SettingsRow
      icon="color-palette-outline"
      title="Tema de interfaz"
      subtitle={CURRENT[preference]}
      accessory={
        <Pressable
          onPress={() => setPreference(next.value)}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={`Cambiar a ${next.label}`}
        >
          <Ionicons name={next.icon} size={17} color={colors.text} />
          <AppText variant="small">{next.label}</AppText>
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
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.sm,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
  },
}));
