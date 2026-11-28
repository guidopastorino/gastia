import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, View } from 'react-native';

import { useAuth } from '../../auth/AuthProvider';
import { Sparkline } from '../../components/charts/Sparkline';
import { Screen } from '../../components/layout/Screen';
import { AppText, Button, ProgressBar } from '../../components/ui';
import { greetingForHour } from '../../lib/date';
import { formatMoney, formatPercent } from '../../lib/format';
import { getFirstName } from '../../lib/user';
import type { RootStackParamList } from '../../navigation/types';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import type { HomeSummary } from '../finance/api';
import { BalanceHero } from './components/BalanceHero';
import { QuickActions, type QuickAction } from './components/QuickActions';
import { RecentTransactions } from './components/RecentTransactions';
import { RecommendationCard } from './components/RecommendationCard';
import { StatCard } from './components/StatCard';
import { recommendation } from './mock';
import { useHomeData } from './useHomeData';

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

/** Percent change from `previous` to `current`; 0 when there is nothing to compare with. */
function changePct(current: number, previous: number) {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
}

function statsFrom(s: HomeSummary) {
  const spentShare = s.incomeMonth > 0 ? Math.min(s.expensesMonth / s.incomeMonth, 1) : 0;
  return {
    balanceChangePct: changePct(s.balance, s.balance - s.monthNet),
    incomeFooter:
      s.incomePrevMonth > 0
        ? `${formatPercent(changePct(s.incomeMonth, s.incomePrevMonth))} vs. mes anterior`
        : 'Este mes',
    spentShare,
    expensesFooter:
      s.incomeMonth > 0 ? `${Math.round((s.expensesMonth / s.incomeMonth) * 100)}% de tus ingresos` : 'Este mes',
  };
}

export function HomeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { session } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { summary, transactions, error, loading, refreshing, refresh } = useHomeData();
  const [showRecommendation, setShowRecommendation] = useState(true);

  const actions: QuickAction[] = [
    { id: 'add', label: 'Ingresar', icon: 'add', primary: true, onPress: () => navigation.navigate('AddIncome') },
    { id: 'transfer', label: 'Transferir', icon: 'swap-horizontal', onPress: () => navigation.navigate('Transfer') },
    { id: 'analyze', label: 'Analizar', icon: 'sparkles-outline', onPress: comingSoon('Analizar con IA') },
    { id: 'more', label: 'Más', icon: 'ellipsis-horizontal', onPress: comingSoon('Más acciones') },
  ];

  const greeting = `${greetingForHour()}, ${getFirstName(session?.user)}`;

  if (!summary) {
    return (
      <Screen>
        <AppText tone="secondary">{greeting}</AppText>
        {loading ? (
          <ActivityIndicator color={colors.textSecondary} style={styles.loader} />
        ) : (
          <View style={styles.error}>
            <AppText tone="danger">{error}</AppText>
            <Button title="Reintentar" variant="secondary" onPress={refresh} />
          </View>
        )}
      </Screen>
    );
  }

  const stats = statsFrom(summary);

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <BalanceHero
        greeting={greeting}
        total={summary.balance}
        currency="USD"
        changePct={stats.balanceChangePct}
        changeAmount={summary.monthNet}
      />

      <QuickActions actions={actions} />

      {showRecommendation && (
        <RecommendationCard
          {...recommendation}
          onApply={comingSoon('Sugerencia')}
          onDismiss={() => setShowRecommendation(false)}
        />
      )}

      <View style={styles.stats}>
        <StatCard
          label="Ingresos del mes"
          value={formatMoney(summary.incomeMonth, { decimals: 0 })}
          footer={stats.incomeFooter}
        >
          <Sparkline data={summary.incomeTrend} />
        </StatCard>
        <StatCard
          label="Gastos del mes"
          value={formatMoney(summary.expensesMonth, { decimals: 0 })}
          footer={stats.expensesFooter}
        >
          <ProgressBar value={stats.spentShare} height={6} />
        </StatCard>
      </View>

      <RecentTransactions transactions={transactions} />
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  stats: { flexDirection: 'row', gap: 12 },
  loader: { marginTop: 40 },
  error: { gap: 16, alignItems: 'flex-start' },
}));
