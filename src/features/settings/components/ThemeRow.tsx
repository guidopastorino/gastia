import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { AppText, ListRow, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme, type ThemePreference } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';

/** The button shows the selected mode; tapping it moves on: claro → oscuro → sistema → claro. */
const MODES: Record<ThemePreference, { label: string; icon: IconName; next: ThemePreference }> = {
  light: { label: 'Claro', icon: 'sunny-outline', next: 'dark' },
  dark: { label: 'Oscuro', icon: 'moon-outline', next: 'system' },
  system: { label: 'Sistema', icon: 'phone-portrait-outline', next: 'light' },
};

export function ThemeRow() {
  const styles = useStyles();
  const { preference, setPreference, scheme, colors } = useTheme();
  const current = MODES[preference];

  const subtitle =
    preference === 'system'
      ? `Sigue al sistema · ahora ${scheme === 'dark' ? 'oscuro' : 'claro'}`
      : `Siempre ${current.label.toLowerCase()}`;

  return (
    <ListRow
      icon="contrast-outline"
      title="Tema"
      subtitle={subtitle}
      accessory={
        <Pressable
          onPress={() => setPreference(current.next)}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={`Tema: ${current.label}`}
          accessibilityHint={`Cambia a ${MODES[current.next].label.toLowerCase()}`}
          hitSlop={6}
        >
          <Ionicons name={current.icon} size={15} color={colors.text} />
          <AppText variant="smallStrong">{current.label}</AppText>
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
