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
            {stats.flowSubtitle}
          </AppText>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendLine} />
          <AppText variant="caption">{stats.averageLabel}</AppText>
        </View>
      </View>
      <LineChart
        data={stats.flow}
        average={stats.average}
        highlightIndex={stats.peakIndex}
        formatValue={(v) => `Pico ${formatMoney(v, { decimals: 0 })}`}
      />
    </Card>
  );
}

const useStyles = makeStyles((c) => ({
  card: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  titles: { flex: 1, gap: 2 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 4 },
  legendLine: { width: 14, height: 2, backgroundColor: c.text },
}));
