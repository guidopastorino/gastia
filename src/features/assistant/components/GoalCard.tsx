import { Alert, View } from 'react-native';

import { AppText, Button, IconCircle, ProgressBar } from '../../../components/ui';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import type { SavingsGoal } from '../../../types/finance';

type Props = {
  goal: SavingsGoal;
};

export function GoalCard({ goal }: Props) {
  const styles = useStyles();
  const progress = goal.saved / goal.target;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <IconCircle icon={goal.icon} size={40} shape="rounded" />
        <View style={styles.titles}>
          <AppText variant="bodyStrong">{goal.title}</AppText>
          <AppText variant="caption" tone="secondary">
            {goal.status}
          </AppText>
        </View>
        <AppText variant="bodyStrong">{Math.round(progress * 100)}%</AppText>
      </View>
      <ProgressBar value={progress} />
      <View style={styles.legend}>
        <AppText variant="caption" tone="secondary">
          Acumulado: <AppText variant="caption">{formatMoney(goal.saved)}</AppText>
        </AppText>
        <AppText variant="caption" tone="secondary">
          Meta: <AppText variant="caption">{formatMoney(goal.target)}</AppText>
        </AppText>
      </View>
      <Button
        title="Ajustar presupuesto de ocio"
        icon="options-outline"
        size="sm"
        onPress={() => Alert.alert('Ajustar presupuesto', 'Próximamente.')}
      />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.separator,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titles: { flex: 1, gap: 2 },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
}));
