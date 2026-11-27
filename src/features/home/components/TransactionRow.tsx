import { View } from 'react-native';

import { AppText, Chip, IconCircle } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import type { Transaction } from '../../../types/finance';

type Props = {
  transaction: Transaction;
};

export function TransactionRow({ transaction: t }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <IconCircle icon={t.icon} size={46} />
      <View style={styles.main}>
        <View style={styles.titleRow}>
          <AppText style={styles.title} numberOfLines={1}>
            {t.title}
          </AppText>
          {t.tag && <Chip label={t.tag} uppercase />}
        </View>
        <AppText variant="small" tone="secondary" numberOfLines={1}>
          {t.subtitle}
        </AppText>
      </View>
      <View style={styles.amountCol}>
        <AppText style={[styles.amount, t.amount > 0 && styles.income]}>
          {formatMoney(t.amount, { signed: true })}
        </AppText>
        <AppText variant="caption" tone="secondary" numberOfLines={1}>
          {t.method}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  main: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flexShrink: 1 },
  amountCol: { alignItems: 'flex-end', gap: 3, maxWidth: '40%' },
  amount: { fontVariant: ['tabular-nums'] },
  income: { fontWeight: '700' },
}));
