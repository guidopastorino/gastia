import { useState } from 'react';
import { Alert, View } from 'react-native';

import { AppText, Button, Card, Chip, IconButton } from '../../../components/ui';
import { formatMoney, formatPercent } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  total: number;
  currency: string;
  changePct: number;
  changeAmount: number;
};

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

export function BalanceCard({ total, currency, changePct, changeAmount }: Props) {
  const styles = useStyles();
  const [hidden, setHidden] = useState(false);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="overline" tone="secondary">
          Balance total consolidado
        </AppText>
        <IconButton
          icon={hidden ? 'eye-off-outline' : 'eye-outline'}
          accessibilityLabel={hidden ? 'Mostrar balance' : 'Ocultar balance'}
          onPress={() => setHidden((h) => !h)}
          style={styles.eye}
        />
      </View>

      <View style={styles.amountRow}>
        <AppText variant="display" adjustsFontSizeToFit numberOfLines={1}>
          {hidden ? '••••••' : formatMoney(total)}
        </AppText>
        <AppText variant="small" tone="secondary">
          {currency}
        </AppText>
      </View>

      <Chip
        icon={changePct >= 0 ? 'trending-up' : 'trending-down'}
        label={`${formatPercent(changePct)} este mes (${hidden ? '••••' : formatMoney(changeAmount, { signed: true, decimals: 0 })})`}
        size="md"
      />

      <View style={styles.actions}>
        <Button title="Ingresar" icon="add" size="sm" style={styles.action} onPress={comingSoon('Ingresar')} />
        <Button
          title="Transferir"
          icon="swap-horizontal"
          variant="secondary"
          size="sm"
          style={styles.action}
          onPress={comingSoon('Transferir')}
        />
        <Button
          title="Analizar IA"
          icon="sparkles-outline"
          variant="secondary"
          size="sm"
          style={styles.action}
          onPress={comingSoon('Analizar IA')}
        />
      </View>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eye: { marginRight: -8, marginVertical: -8 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  action: { flex: 1, paddingHorizontal: 6 },
}));
