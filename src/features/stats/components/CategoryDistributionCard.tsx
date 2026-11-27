import { View } from 'react-native';

import { AppText, Card, IconCircle, ProgressBar } from '../../../components/ui';
import { withAlpha } from '../../../lib/color';
import { formatMoney } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import type { ExpenseCategory } from '../../../types/finance';

type Props = {
  categories: ExpenseCategory[];
};

// Monochrome scale: biggest category darkest.
const SHADES = [1, 0.72, 0.5, 0.3, 0.16];

export function CategoryDistributionCard({ categories }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const shade = (i: number) => withAlpha(colors.text, SHADES[i] ?? 0.1);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="heading">Distribución por Categorías</AppText>
        <AppText variant="caption" tone="secondary">
          {categories.length} grupos activos
        </AppText>
      </View>

      <View style={styles.stack}>
        {categories.map((cat, i) => (
          <View key={cat.id} style={{ flex: cat.share, backgroundColor: shade(i) }} />
        ))}
      </View>

      {categories.map((cat, i) => (
        <View key={cat.id} style={styles.item}>
          <View style={styles.itemRow}>
            <IconCircle icon={cat.icon} size={36} shape="rounded" />
            <View style={styles.itemText}>
              <AppText numberOfLines={1}>{cat.name}</AppText>
              <AppText variant="caption" tone="secondary">
                {Math.round(cat.share * 100)}% de los egresos
              </AppText>
            </View>
            <AppText variant="bodyStrong">{formatMoney(cat.amount)}</AppText>
          </View>
          <ProgressBar value={cat.share} height={6} color={shade(i)} />
        </View>
      ))}
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stack: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 },
  item: { gap: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemText: { flex: 1, gap: 2 },
}));
