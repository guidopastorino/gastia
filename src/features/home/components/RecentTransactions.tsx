import { Alert, View } from 'react-native';

import { AppText, Card, SectionHeader, type IconName } from '../../../components/ui';
import { relativeDateTimeLabel } from '../../../lib/date';
import { makeStyles } from '../../../theme/makeStyles';
import type { Transaction } from '../../../types/finance';
import type { TransactionKind, TransactionRecord } from '../../finance/api';
import { TransactionRow } from './TransactionRow';

const KIND: Record<TransactionKind, { icon: IconName; label: string }> = {
  income: { icon: 'cash-outline', label: 'Ingreso' },
  expense: { icon: 'bag-handle-outline', label: 'Gasto' },
  transfer: { icon: 'swap-horizontal', label: 'Transferencia' },
};

function toRow(t: TransactionRecord): Transaction {
  return {
    id: t.id,
    title: t.title,
    subtitle: `${relativeDateTimeLabel(t.occurredAt)} • ${t.accountName}`,
    amount: t.amount,
    method: KIND[t.kind].label,
    icon: KIND[t.kind].icon,
  };
}

type Props = {
  transactions: TransactionRecord[];
};

export function RecentTransactions({ transactions }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Movimientos recientes"
        action={
          transactions.length > 0
            ? { label: 'Ver todo', onPress: () => Alert.alert('Movimientos', 'Próximamente.') }
            : undefined
        }
      />
      <Card style={styles.card}>
        {transactions.length === 0 ? (
          <AppText tone="secondary" style={styles.empty}>
            Todavía no tienes movimientos. Registra tu primer ingreso con “Ingresar”.
          </AppText>
        ) : (
          transactions.map((t) => <TransactionRow key={t.id} transaction={toRow(t)} />)
        )}
      </Card>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 12 },
  card: { paddingVertical: 8 },
  empty: { paddingVertical: 12 },
}));
