import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, Switch, View } from 'react-native';

import { AppText, Chip, IconCircle, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Bold value at the right, e.g. "USD ($)". */
  value?: string;
  /** Pill at the right, e.g. "3 bancos". */
  badge?: string;
  /** Renders a switch instead of a chevron. */
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  /** Custom right-side element (button...). */
  accessory?: ReactNode;
  onPress?: () => void;
};

export function SettingsRow({ title, subtitle, icon, value, badge, toggle, accessory, onPress }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const showChevron = !!onPress && !toggle && !accessory;

  return (
    <Pressable
      onPress={toggle ? () => toggle.onChange(!toggle.value) : onPress}
      disabled={!onPress && !toggle}
      style={({ pressed }) => [styles.row, pressed && (onPress || toggle) && styles.pressed]}
      accessibilityRole={toggle ? 'switch' : onPress ? 'button' : undefined}
      accessibilityState={toggle ? { checked: toggle.value } : undefined}
    >
      {icon && <IconCircle icon={icon} size={40} />}
      <View style={styles.texts}>
        <AppText numberOfLines={2}>{title}</AppText>
        {subtitle && (
          <AppText variant="small" tone="secondary">
            {subtitle}
          </AppText>
        )}
      </View>
      {value && <AppText variant="smallStrong">{value}</AppText>}
      {badge && <Chip label={badge} />}
      {accessory}
      {toggle && <Switch value={toggle.value} onValueChange={toggle.onChange} trackColor={{ true: colors.primary }} />}
      {showChevron && <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: c.card,
  },
  pressed: { backgroundColor: c.pressed },
  texts: { flex: 1, gap: 2 },
}));
