import { Fragment } from 'react';
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
        title="Transacciones Recientes"
        variant="heading"
        count={transactions.length}
        action={{ label: 'Ver todas', onPress: () => Alert.alert('Transacciones', 'Próximamente.') }}
      />
      <Card style={styles.card}>
        {transactions.map((t, i) => (
          <Fragment key={t.id}>
            {i > 0 && <View style={styles.separator} />}
            <TransactionRow transaction={t} />
          </Fragment>
        ))}
      </Card>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 10 },
  card: { paddingVertical: 6 },
  separator: { height: 1, backgroundColor: c.separator, marginLeft: 58 },
}));
