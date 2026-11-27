import { View } from 'react-native';

import { AppText, IconCircle } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import type { Transaction } from '../../../types/finance';

type Props = {
  transaction: Transaction;
};

export function TransactionRow({ transaction: t }: Props) {
  const styles = useStyles();
  const income = t.amount > 0;

  return (
    <View style={styles.row}>
      <IconCircle icon={t.icon} size={42} />
      <View style={styles.main}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {t.title}
        </AppText>
        <AppText variant="caption" tone="secondary" numberOfLines={1}>
          {t.subtitle}
        </AppText>
      </View>
      <View style={styles.amountCol}>
        <AppText variant="bodyStrong" tone={income ? 'success' : 'default'} style={styles.amount}>
          {formatMoney(t.amount, { signed: true })}
        </AppText>
        <AppText variant="caption" tone="tertiary" numberOfLines={1}>
          {t.method}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  main: { flex: 1, gap: 2 },
  amountCol: { alignItems: 'flex-end', gap: 2, maxWidth: '42%' },
  amount: { fontVariant: ['tabular-nums'] },
}));
