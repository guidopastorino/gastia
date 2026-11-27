import { Alert, View } from 'react-native';

import { AppText, Card, Chip, IconButton } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { AssistantAvatar } from './AssistantAvatar';

export function AssistantHeaderCard() {
  const styles = useStyles();

  return (
    <Card variant="muted" style={styles.card}>
      <AssistantAvatar size={46} online />
      <View style={styles.texts}>
        <View style={styles.titleRow}>
          <AppText variant="bodyStrong" numberOfLines={1} style={styles.title}>
            Gastia IA
          </AppText>
          <Chip label="Beta" variant="outline" />
        </View>
        <AppText variant="caption" tone="secondary" numberOfLines={1}>
          En línea • Analizando tus finanzas
        </AppText>
      </View>
      <IconButton
        icon="time-outline"
        accessibilityLabel="Historial de conversaciones"
        onPress={() => Alert.alert('Historial', 'Próximamente.')}
      />
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  texts: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flexShrink: 1, fontSize: 17 },
}));
