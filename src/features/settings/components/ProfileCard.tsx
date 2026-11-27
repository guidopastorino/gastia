import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  name: string;
  email: string;
};

export function ProfileCard({ name, email }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.profile}>
        <Avatar name={name} size={64} />
        <View style={styles.texts}>
          <View style={styles.nameRow}>
            <AppText variant="heading" numberOfLines={1} style={styles.name}>
              {name}
            </AppText>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.text} />
          </View>
          <AppText variant="small" tone="secondary" numberOfLines={1}>
            {email}
          </AppText>
        </View>
      </View>

      <Card variant="muted" style={styles.plan}>
        <View style={styles.planHeader}>
          <Ionicons name="sparkles-outline" size={20} color={colors.text} />
          <AppText variant="overline" style={styles.planTitle}>
            Plan Gastia Pro
          </AppText>
          <Chip label="Activo" variant="outline" />
        </View>
        <AppText variant="small" tone="secondary">
          Asistente ilimitado y proyecciones en tiempo real
        </AppText>
        <Button
          title="Gestionar suscripción"
          icon="arrow-forward"
          iconPosition="right"
          variant="outline"
          size="sm"
          onPress={() => Alert.alert('Suscripción', 'Próximamente.')}
        />
      </Card>
    </Card>
  );
}

const useStyles = makeStyles((c) => ({
  card: { gap: 18 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  texts: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { flexShrink: 1 },
  plan: { gap: 12, padding: 16 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planTitle: { flex: 1, color: c.text },
}));
