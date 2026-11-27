import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  periodLabel: string;
  total: number;
  delta: number;
  deltaLabel: string;
};

/** Headline total for the selected period (spending less is good, so it shows in green). */
export function SpendingSummaryCard({ periodLabel, total, delta, deltaLabel }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const less = delta <= 0;

  return (
    <View style={styles.container}>
      <AppText variant="small" tone="secondary">
        Gastos · {periodLabel}
      </AppText>
      <AppText variant="display">{formatMoney(total)}</AppText>
      <View style={styles.deltaRow}>
        <Ionicons name={less ? 'arrow-down' : 'arrow-up'} size={14} color={less ? colors.success : colors.danger} />
        <AppText variant="smallStrong" tone={less ? 'success' : 'danger'}>
          {formatMoney(Math.abs(delta))}
        </AppText>
        <AppText variant="small" tone="secondary">
          {deltaLabel}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 6 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
}));
