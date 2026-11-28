import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { AppText } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';
import type { Account } from '../api';

type Props = {
  label: string;
  accounts: Account[];
  value: string | null;
  onChange: (id: string) => void;
  /** Account that can't be picked (e.g. the origin of a transfer). */
  disabledId?: string | null;
};

/** One card per account with its balance; the selected one gets a border. */
export function AccountPicker({ label, accounts, value, onChange, disabledId }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="smallStrong">{label}</AppText>
      <View style={styles.list} accessibilityRole="radiogroup">
        {accounts.map((a) => {
          const selected = a.id === value;
          const disabled = a.id === disabledId;
          return (
            <Pressable
              key={a.id}
              onPress={() => onChange(a.id)}
              disabled={disabled}
              style={[styles.item, selected && styles.selected, disabled && styles.disabled]}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
            >
              <Ionicons name={a.icon} size={20} color={colors.icon} />
              <View style={styles.text}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {a.name}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  Saldo {formatMoney(a.balance)}
                </AppText>
              </View>
              <Ionicons
                name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={selected ? colors.primary : colors.textTertiary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 10 },
  list: { gap: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: c.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selected: { borderColor: c.primary },
  disabled: { opacity: 0.4 },
  text: { flex: 1, gap: 2 },
}));
