import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';
import type { IconName } from './types';

type Props = {
  title: string;
  /** `overline` for small caps section labels, `heading` for bold list titles. */
  variant?: 'overline' | 'heading';
  icon?: IconName;
  count?: number;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, variant = 'overline', icon, count, action }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <AppText variant={variant} tone={variant === 'overline' ? 'secondary' : 'default'}>
          {title}
        </AppText>
        {count !== undefined && (
          <View style={[styles.count, { backgroundColor: colors.surface }]}>
            <AppText variant="caption" tone="secondary">
              {count}
            </AppText>
          </View>
        )}
      </View>
      {icon && <Ionicons name={icon} size={18} color={colors.textSecondary} />}
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8} style={styles.action}>
          <AppText variant="small" tone="secondary">
            {action.label}
          </AppText>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { minWidth: 24, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 12, alignItems: 'center' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
