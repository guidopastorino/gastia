import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Card } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  label: string;
  value: string;
  /** Visual under the value: sparkline, progress bar... */
  children?: ReactNode;
  footer: string;
};

export function StatCard({ label, value, children, footer }: Props) {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      <AppText variant="small" tone="secondary">
        {label}
      </AppText>
      <AppText variant="heading" style={styles.value} adjustsFontSizeToFit numberOfLines={1}>
        {value}
      </AppText>
      <View style={styles.visual}>{children}</View>
      <AppText variant="caption" tone="tertiary" numberOfLines={1}>
        {footer}
      </AppText>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { flex: 1, gap: 6, padding: 18 },
  value: { fontSize: 22, lineHeight: 28, letterSpacing: -0.6 },
  visual: { height: 40, justifyContent: 'center', marginVertical: 6 },
}));
