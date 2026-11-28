import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Card } from '../../../components/ui';
import { formatMoney, formatPercent } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  periodLabel: string;
  income: number;
  expense: number;
  prevIncome: number;
  prevExpense: number;
};

/** Net savings of the period, with income and expenses compared to the previous period. */
export function SummaryCard({ periodLabel, income, expense, prevIncome, prevExpense }: Props) {
  const styles = useStyles();
  const net = income - expense;

  return (
    <View style={styles.container}>
      <View style={styles.headline}>
        <AppText variant="small" tone="secondary">
          Ahorro neto · {periodLabel}
        </AppText>
        <AppText variant="display" adjustsFontSizeToFit numberOfLines={1}>
          {formatMoney(net, { signed: net < 0 })}
        </AppText>
      </View>

      <View style={styles.row}>
        <Metric label="Ingresos" value={income} previous={prevIncome} upIsGood />
        <Metric label="Gastos" value={expense} previous={prevExpense} upIsGood={false} />
      </View>
    </View>
  );
}

function Metric({
  label,
  value,
  previous,
  upIsGood,
}: {
  label: string;
  value: number;
  previous: number;
  /** More income is good; more spending is not. */
  upIsGood: boolean;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const hasPrevious = previous > 0;
  const pct = hasPrevious ? ((value - previous) / previous) * 100 : 0;
  const up = pct >= 0;
  const good = up === upIsGood;

  return (
    <Card style={styles.metric}>
      <AppText variant="small" tone="secondary">
        {label}
      </AppText>
      <AppText variant="heading" adjustsFontSizeToFit numberOfLines={1}>
        {formatMoney(value)}
      </AppText>
      {hasPrevious ? (
        <View style={styles.delta}>
          <Ionicons
            name={up ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={good ? colors.success : colors.danger}
          />
          <AppText variant="caption" tone={good ? 'success' : 'danger'}>
            {formatPercent(Math.abs(pct), { signed: false })}
          </AppText>
          <AppText variant="caption" tone="tertiary" numberOfLines={1} style={styles.flex}>
            vs. anterior
          </AppText>
        </View>
      ) : (
        <AppText variant="caption" tone="tertiary">
          Sin periodo anterior
        </AppText>
      )}
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 16 },
  headline: { gap: 6 },
  row: { flexDirection: 'row', gap: 12 },
  metric: { flex: 1, gap: 4, padding: 18 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  flex: { flexShrink: 1 },
}));
