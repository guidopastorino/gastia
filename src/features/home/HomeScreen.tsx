import { useState } from 'react';
import { Alert, View } from 'react-native';

import { useAuth } from '../../auth/AuthProvider';
import { Sparkline } from '../../components/charts/Sparkline';
import { Screen } from '../../components/layout/Screen';
import { ProgressBar } from '../../components/ui';
import { greetingForHour } from '../../lib/date';
import { formatMoney, formatPercent } from '../../lib/format';
import { getFirstName } from '../../lib/user';
import { makeStyles } from '../../theme/makeStyles';
import { BalanceHero } from './components/BalanceHero';
import { QuickActions, type QuickAction } from './components/QuickActions';
import { RecentTransactions } from './components/RecentTransactions';
import { RecommendationCard } from './components/RecommendationCard';
import { StatCard } from './components/StatCard';
import { balance, expenses, income, recentTransactions, recommendation } from './mock';

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

const ACTIONS: QuickAction[] = [
  { id: 'add', label: 'Ingresar', icon: 'add', primary: true, onPress: comingSoon('Ingresar') },
  { id: 'transfer', label: 'Transferir', icon: 'swap-horizontal', onPress: comingSoon('Transferir') },
  { id: 'analyze', label: 'Analizar', icon: 'sparkles-outline', onPress: comingSoon('Analizar con IA') },
  { id: 'more', label: 'Más', icon: 'ellipsis-horizontal', onPress: comingSoon('Más acciones') },
];

export function HomeScreen() {
  const styles = useStyles();
  const { session } = useAuth();
  const [showRecommendation, setShowRecommendation] = useState(true);
  const spentShare = expenses.amount / expenses.limit;

  return (
    <Screen>
      <BalanceHero greeting={`${greetingForHour()}, ${getFirstName(session?.user)}`} {...balance} />

      <QuickActions actions={ACTIONS} />

      {showRecommendation && (
        <RecommendationCard
          {...recommendation}
          onApply={comingSoon('Sugerencia')}
          onDismiss={() => setShowRecommendation(false)}
        />
      )}

      <View style={styles.stats}>
        <StatCard
          label="Ingresos"
          value={formatMoney(income.amount, { decimals: 0 })}
          footer={`${formatPercent(income.changePct)} vs. mes anterior`}
        >
          <Sparkline data={income.trend} />
        </StatCard>
        <StatCard
          label="Gastos del mes"
          value={formatMoney(expenses.amount, { decimals: 0 })}
          footer={`${Math.round(spentShare * 100)}% de ${formatMoney(expenses.limit, { decimals: 0 })}`}
        >
          <ProgressBar value={spentShare} height={6} />
        </StatCard>
      </View>

      <RecentTransactions transactions={recentTransactions} />
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  stats: { flexDirection: 'row', gap: 12 },
}));
