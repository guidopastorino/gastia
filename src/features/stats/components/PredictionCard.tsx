import { View } from 'react-native';

import { AppText, Card, Chip, ProgressBar, RichText } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  confidence: number;
  projected: number;
  target: number;
  note: string;
};

export function PredictionCard({ confidence, projected, target, note }: Props) {
  const styles = useStyles();
  const progress = projected / target;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Chip label="Algoritmo Predictivo" icon="sparkles-outline" />
        <AppText variant="caption">Confianza {confidence}%</AppText>
      </View>

      <View style={styles.block}>
        <AppText variant="small" tone="secondary">
          Proyección estimada de ahorro a fin de mes
        </AppText>
        <View style={styles.amountRow}>
          <AppText variant="title">{formatMoney(projected)}</AppText>
          <Chip label={`${Math.round(progress * 100)}% meta alcanzada`} size="md" />
        </View>
      </View>

      <View style={styles.block}>
        <ProgressBar value={progress} height={10} />
        <View style={styles.legend}>
          <AppText variant="caption">Ahorro objetivo: {formatMoney(target)}</AppText>
          <AppText variant="caption" tone="secondary">
            Faltan {formatMoney(Math.max(target - projected, 0))}
          </AppText>
        </View>
      </View>

      <Card variant="muted" style={styles.note}>
        <RichText variant="small" tone="secondary">
          {note}
        </RichText>
      </Card>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  block: { gap: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
  note: { padding: 14, borderRadius: 14 },
}));
