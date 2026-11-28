import { View } from 'react-native';

import { LineChart } from '../../../components/charts/LineChart';
import { AppText, Card } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import type { ChartPoint } from '../../../types/finance';

type Props = {
  points: ChartPoint[];
  /** Changes when the period changes, so the chart resets its selection to the latest point. */
  chartKey: string;
};

export function BalanceChartCard({ points, chartKey }: Props) {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      <View style={styles.titles}>
        <AppText variant="heading">Evolución del saldo</AppText>
        <AppText variant="caption" tone="secondary">
          Desliza sobre el gráfico para ver cada día
        </AppText>
      </View>
      {points.length > 1 ? (
        <LineChart key={chartKey} data={points} formatValue={(v) => formatMoney(v, { decimals: 0 })} />
      ) : (
        <AppText tone="secondary">Aún no hay suficientes días para dibujar el gráfico.</AppText>
      )}
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 20 },
  titles: { gap: 2 },
}));
