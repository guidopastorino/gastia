import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Card } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  /** Income minus expenses so far this month. */
  monthNet: number;
  daysElapsed: number;
  daysInMonth: number;
};

/** Straight-line projection: if the month keeps its current daily pace, where does it end? */
export function ProjectionCard({ monthNet, daysElapsed, daysInMonth }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const daily = monthNet / Math.max(daysElapsed, 1);
  const projected = daily * daysInMonth;
  const daysLeft = daysInMonth - daysElapsed;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={16} color={colors.text} />
        <AppText variant="smallStrong">Proyección del mes</AppText>
      </View>

      <View style={styles.amount}>
        <AppText variant="title">{formatMoney(projected, { signed: projected < 0 })}</AppText>
        <AppText variant="small" tone="secondary">
          ahorro estimado a fin de mes
        </AppText>
      </View>

      <AppText variant="small" tone="secondary">
        Llevas un ritmo de {formatMoney(daily, { signed: daily < 0 })} por día.{' '}
        {daysLeft > 0
          ? `Si lo mantienes los ${daysLeft} días que quedan, cerrarás el mes con este ahorro.`
          : 'Hoy es el último día del mes.'}
      </AppText>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { gap: 2 },
}));
