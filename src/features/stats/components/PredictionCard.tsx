import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Card, ProgressBar, RichText } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  confidence: number;
  projected: number;
  target: number;
  note: string;
};

export function PredictionCard({ confidence, projected, target, note }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const progress = projected / target;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={colors.text} />
        <AppText variant="smallStrong" style={styles.flex}>
          Proyección de ahorro
        </AppText>
        <AppText variant="caption" tone="tertiary">
          {confidence}% confianza
        </AppText>
      </View>

      <View style={styles.amount}>
        <AppText variant="title">{formatMoney(projected)}</AppText>
        <AppText variant="small" tone="secondary">
          estimado a fin de mes · meta {formatMoney(target, { decimals: 0 })}
        </AppText>
      </View>

      <View style={styles.progress}>
        <ProgressBar value={progress} height={6} />
        <View style={styles.legend}>
          <AppText variant="caption" tone="secondary">
            {Math.round(progress * 100)}% de la meta
          </AppText>
          <AppText variant="caption" tone="secondary">
            Faltan {formatMoney(Math.max(target - projected, 0))}
          </AppText>
        </View>
      </View>

      <RichText variant="small" tone="secondary">
        {note}
      </RichText>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
  amount: { gap: 2 },
  progress: { gap: 8 },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
}));
