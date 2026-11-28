import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, SectionList, View } from 'react-native';

import { AppText, Button } from '../../components/ui';
import { dayHeaderLabel, dayKey } from '../../lib/date';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, SCREEN_PADDING, spacing } from '../../theme/tokens';
import type { TransactionKind, TransactionRecord } from '../finance/api';
import { TransactionRow } from '../finance/components/TransactionRow';
import { toTransactionRow } from '../finance/transactionDisplay';
import { useTransactions } from './useTransactions';

type Filter = 'all' | TransactionKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Gastos' },
  { value: 'transfer', label: 'Transferencias' },
];

const EMPTY_TEXT: Record<Filter, string> = {
  all: 'Todavía no tienes movimientos.',
  income: 'No hay ingresos registrados.',
  expense: 'No hay gastos registrados.',
  transfer: 'No hay transferencias registradas.',
};

type Section = { key: string; title: string; data: TransactionRecord[] };

/** Consecutive movements of the same local day go in one section (the list is newest first). */
function groupByDay(items: TransactionRecord[]): Section[] {
  const sections: Section[] = [];
  for (const t of items) {
    const key = dayKey(t.occurredAt);
    const last = sections[sections.length - 1];
    if (last?.key === key) last.data.push(t);
    else sections.push({ key, title: dayHeaderLabel(t.occurredAt), data: [t] });
  }
  return sections;
}

export function TransactionsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const { items, loading, loadingMore, refreshing, error, refresh, loadMore } = useTransactions(
    filter === 'all' ? undefined : filter,
  );
  const sections = useMemo(() => groupByDay(items), [items]);

  const filters = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
      {FILTERS.map((f) => {
        const selected = f.value === filter;
        return (
          <Pressable
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={[styles.pill, selected && styles.pillSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <AppText variant="smallStrong" tone={selected ? 'inverse' : 'secondary'}>
              {f.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  let empty = null;
  if (loading) {
    empty = <ActivityIndicator color={colors.textSecondary} style={styles.state} />;
  } else if (error && items.length === 0) {
    empty = (
      <View style={[styles.state, styles.error]}>
        <AppText tone="danger">{error}</AppText>
        <Button title="Reintentar" variant="secondary" onPress={refresh} />
      </View>
    );
  } else {
    empty = (
      <AppText tone="secondary" style={styles.state}>
        {EMPTY_TEXT[filter]}
      </AppText>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(t) => t.id}
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={filters}
      ListEmptyComponent={empty}
      renderSectionHeader={({ section }) => (
        <AppText variant="overline" tone="tertiary" style={styles.sectionTitle}>
          {section.title}
        </AppText>
      )}
      renderItem={({ item, index, section }) => (
        <View
          style={[
            styles.row,
            index === 0 && styles.rowFirst,
            index === section.data.length - 1 && styles.rowLast,
          ]}
        >
          <TransactionRow transaction={toTransactionRow(item, { timeOnly: true })} />
        </View>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator color={colors.textSecondary} style={styles.footer} /> : undefined
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    />
  );
}

const useStyles = makeStyles((c) => ({
  screen: { flex: 1, backgroundColor: c.background },
  content: { paddingHorizontal: SCREEN_PADDING, paddingBottom: spacing.xxxl },
  filters: { gap: 8, paddingTop: spacing.sm, paddingBottom: spacing.xs },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: c.card,
  },
  pillSelected: { backgroundColor: c.primary },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: 4 },
  row: { backgroundColor: c.card, paddingHorizontal: spacing.lg },
  rowFirst: { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: 6 },
  rowLast: { borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg, paddingBottom: 6 },
  state: { marginTop: spacing.xxl },
  error: { gap: 16, alignItems: 'flex-start' },
  footer: { marginTop: spacing.xl },
}));
