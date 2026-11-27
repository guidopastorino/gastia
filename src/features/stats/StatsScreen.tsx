import { useState } from 'react';
import { Alert } from 'react-native';

import { Screen } from '../../components/layout/Screen';
import { Button, SegmentedControl } from '../../components/ui';
import { CategoryDistributionCard } from './components/CategoryDistributionCard';
import { FlowChartCard } from './components/FlowChartCard';
import { PredictionCard } from './components/PredictionCard';
import { SpendingSummaryCard } from './components/SpendingSummaryCard';
import { categories, PERIOD_OPTIONS, prediction, statsByPeriod, type Period } from './mock';

export function StatsScreen() {
  const [period, setPeriod] = useState<Period>('month');
  const stats = statsByPeriod[period];

  return (
    <Screen>
      <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />

      <SpendingSummaryCard
        periodLabel={stats.label}
        total={stats.total}
        delta={stats.delta}
        deltaLabel={stats.deltaLabel}
      />

      <FlowChartCard stats={stats} />

      <CategoryDistributionCard categories={categories} />

      <PredictionCard {...prediction} />

      <Button
        title="Exportar informe"
        icon="download-outline"
        variant="outline"
        size="lg"
        onPress={() => Alert.alert('Exportar informe', 'Próximamente.')}
      />
    </Screen>
  );
}
