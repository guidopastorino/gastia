import { View } from 'react-native';

import { LineChart } from '../../../components/charts/LineChart';
import { AppText, Card } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import type { PeriodStats } from '../mock';

type Props = {
  stats: PeriodStats;
};

export function FlowChartCard({ stats }: Props) {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titles}>
          <AppText variant="heading">{stats.flowTitle}</AppText>
          <AppText variant="caption" tone="secondary">
            Toca el gráfico para ver detalles
          </AppText>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendLine} />
          <AppText variant="caption" tone="secondary">
            {stats.averageLabel}
          </AppText>
        </View>
      </View>
      <LineChart
        // Remount per period so the selection resets to that period's peak.
        key={stats.flowTitle}
        data={stats.flow}
        average={stats.average}
        initialIndex={stats.peakIndex}
        formatValue={(v) => formatMoney(v, { decimals: 0 })}
      />
    </Card>
  );
}

const useStyles = makeStyles((c) => ({
  card: { gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  titles: { flex: 1, gap: 2 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 4 },
  legendLine: { width: 14, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: c.textTertiary },
}));
