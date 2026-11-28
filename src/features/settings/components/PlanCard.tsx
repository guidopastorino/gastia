import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, View } from 'react-native';

import { AppText, Button, Card, Chip } from '../../../components/ui';
import { dateTimeLabel } from '../../../lib/date';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { useSubscription } from '../../subscription/SubscriptionProvider';

/** "27 nov 2026" from an ISO date. */
function dayLabel(iso: string) {
  return dateTimeLabel(iso).split(',')[0];
}

/** The user's current plan: Pro with renewal info, or Free with the upgrade. */
export function PlanCard() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { status, isPro, proPackage, expiresAt, willRenew, purchasing, purchasePro, restore, manage } =
    useSubscription();

  if (status === 'loading') {
    return (
      <Card style={styles.card}>
        <ActivityIndicator color={colors.textSecondary} />
      </Card>
    );
  }

  if (isPro) {
    const renewal = expiresAt
      ? `${willRenew ? 'Se renueva' : 'Vence'} el ${dayLabel(expiresAt)}.`
      : 'Acceso de por vida.';
    return (
      <Card style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="sparkles" size={16} color={colors.text} />
          <AppText variant="smallStrong" style={styles.title}>
            Gastia Pro
          </AppText>
          <Chip label="Activo" dot />
        </View>
        <AppText tone="secondary">Tienes acceso al asistente con IA. {renewal}</AppText>
        <Button title="Gestionar suscripción" variant="secondary" size="sm" onPress={manage} style={styles.button} />
      </Card>
    );
  }

  const available = status === 'ready' && !!proPackage;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={16} color={colors.text} />
        <AppText variant="smallStrong" style={styles.title}>
          Plan Gratis
        </AppText>
        <Chip label="Actual" />
      </View>
      <AppText tone="secondary">Pásate a Gastia Pro para usar el asistente con IA.</AppText>
      <View style={styles.actions}>
        <Button
          title={available ? `Obtener Pro · ${proPackage.product.priceString}/mes` : 'Obtener Pro'}
          icon="sparkles"
          size="sm"
          loading={purchasing}
          disabled={!available}
          onPress={purchasePro}
        />
        {status === 'ready' && <Button title="Restaurar compras" variant="ghost" size="sm" onPress={restore} />}
      </View>
      {status === 'unavailable' && (
        <AppText variant="caption" tone="tertiary">
          Las suscripciones aún no están disponibles.
        </AppText>
      )}
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1 },
  button: { alignSelf: 'flex-start', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 },
}));
