import { View } from 'react-native';

import { AppText, Card, SectionHeader } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import type { TransactionRecord } from '../../finance/api';
import { toTransactionRow } from '../../finance/transactionDisplay';
import { TransactionRow } from '../../finance/components/TransactionRow';

type Props = {
  transactions: TransactionRecord[];
  onSeeAll: () => void;
};

export function RecentTransactions({ transactions, onSeeAll }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Movimientos recientes"
        action={transactions.length > 0 ? { label: 'Ver todo', onPress: onSeeAll } : undefined}
      />
      <Card style={styles.card}>
        {transactions.length === 0 ? (
          <AppText tone="secondary" style={styles.empty}>
            Todavía no tienes movimientos. Registra tu primer ingreso con “Ingresar”.
          </AppText>
        ) : (
          transactions.map((t) => <TransactionRow key={t.id} transaction={toTransactionRow(t)} />)
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
