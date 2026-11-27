import { useState } from 'react';
import { Alert, View } from 'react-native';

import { useAuth } from '../../auth/AuthProvider';
import { Sparkline } from '../../components/charts/Sparkline';
import { TabScreen } from '../../components/layout/TabScreen';
import { AppText, ProgressBar } from '../../components/ui';
import { formatMoney, formatPercent } from '../../lib/format';
import { getFirstName } from '../../lib/user';
import { makeStyles } from '../../theme/makeStyles';
import { BalanceCard } from './components/BalanceCard';
import { HomeGreeting } from './components/HomeGreeting';
import { RecentTransactions } from './components/RecentTransactions';
import { RecommendationCard } from './components/RecommendationCard';
import { StatCard } from './components/StatCard';
import { balance, expenses, income, recentTransactions, recommendation } from './mock';

export function HomeScreen() {
  const styles = useStyles();
  const { session } = useAuth();
  const [showRecommendation, setShowRecommendation] = useState(true);
  const spentShare = expenses.amount / expenses.limit;

  return (
    <TabScreen title="Inicio">
      <HomeGreeting firstName={getFirstName(session?.user)} />

      <BalanceCard {...balance} />

      {showRecommendation && (
        <RecommendationCard
          {...recommendation}
          onApply={() => Alert.alert('Sugerencia aplicada', 'Próximamente.')}
          onDismiss={() => setShowRecommendation(false)}
        />
      )}

      <View style={styles.stats}>
        <StatCard
          label="Ingresos"
          badge={<View style={styles.dot} />}
          value={formatMoney(income.amount)}
          footer={`${formatPercent(income.changePct)} vs prev.`}
        >
          <Sparkline data={income.trend} />
        </StatCard>
        <StatCard
          label="Gastos mes"
          badge={
            <AppText variant="caption" tone="secondary">
              {Math.round(spentShare * 100)}%
            </AppText>
          }
          value={formatMoney(expenses.amount)}
          footer={`Límite: ${formatMoney(expenses.limit)}`}
        >
          <ProgressBar value={spentShare} />
        </StatCard>
      </View>

      <RecentTransactions transactions={recentTransactions} />
    </TabScreen>
  );
}

const useStyles = makeStyles((c) => ({
  stats: { flexDirection: 'row', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.text },
}));
