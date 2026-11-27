import { View } from 'react-native';

import { AppText, Button, Card, IconCircle } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  title: string;
  when: string;
  text: string;
  onApply: () => void;
  onDismiss: () => void;
};

export function RecommendationCard({ title, when, text, onApply, onDismiss }: Props) {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <IconCircle icon="sparkles-outline" size={40} shape="rounded" />
        <View style={styles.body}>
          <View style={styles.header}>
            <AppText variant="overline" tone="secondary" style={styles.flex} numberOfLines={1}>
              {title}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {when}
            </AppText>
          </View>
          <AppText>{text}</AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="Aplicar sugerencia" icon="arrow-forward" iconPosition="right" size="sm" onPress={onApply} />
        <Button title="Descartar" variant="ghost" size="sm" onPress={onDismiss} />
      </View>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  body: { flex: 1, gap: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
}));
