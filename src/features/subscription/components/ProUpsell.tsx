import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Button, IconCircle, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { useSubscription } from '../SubscriptionProvider';

const FEATURES: { icon: IconName; text: string }[] = [
  { icon: 'chatbubbles-outline', text: 'Pregúntale lo que quieras sobre tus finanzas' },
  { icon: 'sparkles-outline', text: 'Sugerencias personalizadas para ahorrar' },
  { icon: 'trending-up-outline', text: 'Análisis y proyecciones de tus gastos' },
];

type Props = {
  title: string;
  subtitle: string;
};

/** Shown in place of a Pro feature for Free users, with the upgrade right there. */
export function ProUpsell({ title, subtitle }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { status, proPackage, purchasing, purchasePro, restore } = useSubscription();
  const available = status === 'ready' && !!proPackage;

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <IconCircle icon="lock-closed-outline" size={64} />
        <AppText variant="title" style={styles.center}>
          {title}
        </AppText>
        <AppText tone="secondary" style={styles.center}>
          {subtitle}
        </AppText>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f.text} style={styles.feature}>
            <Ionicons name={f.icon} size={20} color={colors.icon} />
            <AppText style={styles.flex}>{f.text}</AppText>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title={available ? `Obtener Pro · ${proPackage.product.priceString}/mes` : 'Obtener Pro'}
          icon="sparkles"
          size="lg"
          loading={purchasing}
          disabled={!available}
          onPress={purchasePro}
        />
        {status === 'unavailable' ? (
          <AppText variant="caption" tone="tertiary" style={styles.center}>
            Las suscripciones aún no están disponibles.
          </AppText>
        ) : (
          <Button title="Restaurar compras" variant="ghost" size="sm" onPress={restore} />
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 32, paddingTop: 24 },
  hero: { alignItems: 'center', gap: 12 },
  center: { textAlign: 'center' },
  features: { gap: 16, paddingHorizontal: 8 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  flex: { flex: 1 },
  actions: { gap: 8 },
}));
