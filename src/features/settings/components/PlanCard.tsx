import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Button, Card, Chip } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  onManage: () => void;
};

export function PlanCard({ onManage }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={colors.text} />
        <AppText variant="smallStrong" style={styles.title}>
          Gastia Pro
        </AppText>
        <Chip label="Activo" dot />
      </View>
      <AppText tone="secondary">Asistente ilimitado y proyecciones en tiempo real.</AppText>
      <Button
        title="Gestionar suscripción"
        variant="secondary"
        size="sm"
        onPress={onManage}
        style={styles.button}
      />
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1 },
  button: { alignSelf: 'flex-start', marginTop: 4 },
}));
