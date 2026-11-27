import { Alert, View } from 'react-native';

import { Card, SectionHeader } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import type { Transaction } from '../../../types/finance';
import { TransactionRow } from './TransactionRow';

type Props = {
  transactions: Transaction[];
};

export function RecentTransactions({ transactions }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Movimientos recientes"
        action={{ label: 'Ver todo', onPress: () => Alert.alert('Movimientos', 'Próximamente.') }}
      />
      <Card style={styles.card}>
        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} />
        ))}
      </Card>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 12 },
  card: { paddingVertical: 8 },
}));
