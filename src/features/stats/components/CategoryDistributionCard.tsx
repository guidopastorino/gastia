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
const SHADES = [1, 0.7, 0.48, 0.3, 0.16];

export function CategoryDistributionCard({ categories }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const shade = (i: number) => withAlpha(colors.text, SHADES[i] ?? 0.1);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="heading">Categorías</AppText>
        <AppText variant="caption" tone="secondary">
          {categories.length} activas
        </AppText>
      </View>

      <View style={styles.stack}>
        {categories.map((cat, i) => (
          <View key={cat.id} style={{ flex: cat.share, backgroundColor: shade(i) }} />
        ))}
      </View>

      <View style={styles.list}>
        {categories.map((cat, i) => (
          <View key={cat.id} style={styles.item}>
            <IconCircle icon={cat.icon} size={40} />
            <View style={styles.itemBody}>
              <View style={styles.itemRow}>
                <AppText variant="bodyStrong" numberOfLines={1} style={styles.itemName}>
                  {cat.name}
                </AppText>
                <AppText variant="bodyStrong">{formatMoney(cat.amount)}</AppText>
              </View>
              <View style={styles.itemRow}>
                <ProgressBar value={cat.share} height={4} color={shade(i)} style={styles.itemBar} />
                <AppText variant="caption" tone="tertiary" style={styles.pct}>
                  {Math.round(cat.share * 100)}%
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 20 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  stack: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', gap: 3 },
  list: { gap: 18 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  itemBody: { flex: 1, gap: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemName: { flex: 1 },
  itemBar: { flex: 1 },
  pct: { width: 34, textAlign: 'right' },
}));
