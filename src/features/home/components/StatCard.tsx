import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Card } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  label: string;
  /** Small element at the top-right of the card (dot, percentage...). */
  badge?: ReactNode;
  value: string;
  /** Visual between value and footer: sparkline, progress bar... */
  children?: ReactNode;
  footer: string;
};

export function StatCard({ label, badge, value, children, footer }: Props) {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="overline" tone="secondary">
          {label}
        </AppText>
        {badge}
      </View>
      <AppText variant="heading" style={styles.value} adjustsFontSizeToFit numberOfLines={1}>
        {value}
      </AppText>
      <View style={styles.visual}>{children}</View>
      <AppText variant="caption" tone="secondary" numberOfLines={1}>
        {footer}
      </AppText>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { flex: 1, gap: 10, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { fontSize: 24, fontWeight: '800' },
  visual: { minHeight: 44, justifyContent: 'center' },
}));
