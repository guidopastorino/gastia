import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, View } from 'react-native';

import { Screen } from '../../components/layout/Screen';
import { AppText, Button, SegmentedControl } from '../../components/ui';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import type { Period } from './api';
import { balancePoints, periodLabel } from './chartData';
import { BalanceChartCard } from './components/BalanceChartCard';
import { ProjectionCard } from './components/ProjectionCard';
import { SummaryCard } from './components/SummaryCard';
import { useStats } from './useStats';

const PERIOD_OPTIONS = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
] as const satisfies readonly { value: Period; label: string }[];

export function StatsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [period, setPeriod] = useState<Period>('month');
  const { stats, error, loading, refreshing, refresh } = useStats(period);
  const points = useMemo(() => (stats ? balancePoints(period, stats.buckets) : []), [period, stats]);

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />

      {loading && <ActivityIndicator color={colors.textSecondary} style={styles.loader} />}

      {!loading && !stats && (
        <View style={styles.error}>
          <AppText tone="danger">{error}</AppText>
          <Button title="Reintentar" variant="secondary" onPress={refresh} />
        </View>
      )}

      {stats && (
        <>
          <SummaryCard
            periodLabel={periodLabel(period)}
            income={stats.income}
            expense={stats.expense}
            prevIncome={stats.prevIncome}
            prevExpense={stats.prevExpense}
          />

          <BalanceChartCard points={points} chartKey={period} />

          {period === 'month' && (
            <ProjectionCard
              monthNet={stats.income - stats.expense}
              daysElapsed={stats.daysElapsed}
              daysInMonth={stats.daysInMonth}
            />
          )}

          <Button
            title="Exportar informe"
            icon="download-outline"
            variant="outline"
            size="lg"
            onPress={() => Alert.alert('Exportar informe', 'Próximamente.')}
          />
        </>
      )}
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  loader: { marginTop: 40 },
  error: { gap: 16, alignItems: 'flex-start' },
}));
