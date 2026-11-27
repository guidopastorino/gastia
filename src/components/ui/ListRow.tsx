import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, Switch, View } from 'react-native';

import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';
import { Chip } from './Chip';
import { IconCircle } from './IconCircle';
import type { IconName } from './types';

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Text at the right, e.g. "USD". */
  value?: string;
  /** Pill at the right, e.g. "3 bancos". */
  badge?: string;
  /** Renders a switch instead of a chevron. */
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  /** Custom right-side element. */
  accessory?: ReactNode;
  destructive?: boolean;
  onPress?: () => void;
};

export const LIST_ROW_ICON_SIZE = 36;
export const LIST_ROW_PADDING = 18;
export const LIST_ROW_GAP = 14;

export function ListRow({ title, subtitle, icon, value, badge, toggle, accessory, destructive, onPress }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const showChevron = !!onPress && !toggle && !accessory && !destructive;

  return (
    <Pressable
      onPress={toggle ? () => toggle.onChange(!toggle.value) : onPress}
      disabled={!onPress && !toggle}
      style={({ pressed }) => [styles.row, pressed && (onPress || toggle) && styles.pressed]}
      accessibilityRole={toggle ? 'switch' : onPress ? 'button' : undefined}
      accessibilityState={toggle ? { checked: toggle.value } : undefined}
    >
      {icon && <IconCircle icon={icon} size={LIST_ROW_ICON_SIZE} />}
      <View style={styles.texts}>
        <AppText numberOfLines={2} tone={destructive ? 'danger' : 'default'}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" tone="secondary">
            {subtitle}
          </AppText>
        )}
      </View>
      {value && (
        <AppText variant="small" tone="secondary">
          {value}
        </AppText>
      )}
      {badge && <Chip label={badge} />}
      {accessory}
      {toggle && (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{ true: colors.primary }}
          // Contrasting thumb so it stays visible on the light track in dark mode.
          thumbColor={toggle.value ? colors.onPrimary : undefined}
        />
      )}
      {showChevron && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LIST_ROW_GAP,
    minHeight: 60,
    paddingHorizontal: LIST_ROW_PADDING,
    paddingVertical: 14,
    backgroundColor: c.card,
  },
  pressed: { backgroundColor: c.pressed },
  texts: { flex: 1, gap: 2 },
}));
