import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Card, Chip } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  periodLabel: string;
  total: number;
  delta: number;
  deltaLabel: string;
};

export function SpendingSummaryCard({ periodLabel, total, delta, deltaLabel }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="overline" tone="secondary">
          Gastos acumulados
        </AppText>
        <Chip label={periodLabel} dot />
      </View>
      <AppText variant="display">{formatMoney(total)}</AppText>
      <View style={styles.deltaRow}>
        <Ionicons name={delta <= 0 ? 'trending-down' : 'trending-up'} size={16} color={colors.text} />
        <AppText variant="smallStrong">{formatMoney(delta, { signed: true })}</AppText>
        <AppText variant="small" tone="secondary">
          {deltaLabel}
        </AppText>
      </View>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
}));
