import { View } from 'react-native';

import { useAuth } from '../../auth/AuthProvider';
import { Screen } from '../../components/layout/Screen';
import { AppText, Avatar, Chip, ListSection } from '../../components/ui';
import { dateTimeLabel } from '../../lib/date';
import { getDisplayName } from '../../lib/user';
import { makeStyles } from '../../theme/makeStyles';
import { InfoRow } from './components/InfoRow';

const PROVIDER_LABELS: Record<string, string> = {
  email: 'Email y contraseña',
  google: 'Google',
  apple: 'Apple',
};

export function ProfileScreen() {
  const styles = useStyles();
  const { session } = useAuth();
  const user = session?.user;
  const name = getDisplayName(user);
  const provider = user?.app_metadata?.provider;
  const verified = !!user?.email_confirmed_at;

  return (
    <Screen>
      <View style={styles.hero}>
        <Avatar name={name} size={88} />
        <View style={styles.heroText}>
          <AppText variant="title">{name}</AppText>
          <AppText tone="secondary">{user?.email}</AppText>
        </View>
        <Chip
          label={verified ? 'Email verificado' : 'Email sin verificar'}
          icon={verified ? 'checkmark-circle' : 'alert-circle-outline'}
          style={styles.chip}
        />
      </View>

      <ListSection title="Cuenta">
        <InfoRow icon="person-outline" label="Nombre" value={name} />
        <InfoRow icon="mail-outline" label="Email" value={user?.email ?? ''} />
        <InfoRow icon="finger-print-outline" label="ID de usuario" value={user?.id ?? ''} />
      </ListSection>

      <ListSection title="Actividad">
        <InfoRow icon="calendar-outline" label="Miembro desde" value={dateTimeLabel(user?.created_at)} />
        <InfoRow icon="time-outline" label="Último acceso" value={dateTimeLabel(user?.last_sign_in_at)} />
        <InfoRow
          icon="hourglass-outline"
          label="La sesión expira"
          value={session?.expires_at ? dateTimeLabel(new Date(session.expires_at * 1000).toISOString()) : ''}
        />
      </ListSection>

      <ListSection title="Acceso">
        <InfoRow
          icon="key-outline"
          label="Método de inicio de sesión"
          value={(provider && PROVIDER_LABELS[provider]) || provider || ''}
        />
      </ListSection>
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  hero: { alignItems: 'center', gap: 14, paddingTop: 8 },
  heroText: { alignItems: 'center', gap: 4 },
  chip: { alignSelf: 'center' },
}));
