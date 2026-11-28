import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import appConfig from '../../../app.json';
import { useAuth } from '../../auth/AuthProvider';
import { Screen } from '../../components/layout/Screen';
import { AppText, ListRow, ListSection } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { getDisplayName } from '../../lib/user';
import type { RootStackParamList } from '../../navigation/types';
import { AdviceLevelRow, type AdviceLevel } from './components/AdviceLevelRow';
import { PlanCard } from './components/PlanCard';
import { ProfileCard } from './components/ProfileCard';
import { ThemeRow } from './components/ThemeRow';

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

export function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { session } = useAuth();
  const user = session?.user;

  // Mock preferences: local state only, not persisted.
  const [autonomousAi, setAutonomousAi] = useState(true);
  const [adviceLevel, setAdviceLevel] = useState<AdviceLevel>('moderate');
  const [biometrics, setBiometrics] = useState(true);

  function confirmSignOut() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  }

  return (
    <Screen>
      <ProfileCard
        name={getDisplayName(user)}
        email={user?.email ?? ''}
        onPress={() => navigation.navigate('Profile')}
      />

      <PlanCard />

      <ListSection title="Inteligencia artificial">
        <ListRow
          icon="flash-outline"
          title="Modo autónomo"
          subtitle="Alertas proactivas y detección de fugas de dinero"
          toggle={{ value: autonomousAi, onChange: setAutonomousAi }}
        />
        <AdviceLevelRow value={adviceLevel} onChange={setAdviceLevel} />
        <ListRow
          icon="business-outline"
          title="Cuentas bancarias"
          value="3 vinculadas"
          onPress={comingSoon('Cuentas bancarias')}
        />
      </ListSection>

      <ListSection title="Preferencias">
        <ListRow icon="cash-outline" title="Moneda principal" value="USD" onPress={comingSoon('Moneda principal')} />
        <ThemeRow />
        <ListRow
          icon="notifications-outline"
          title="Notificaciones"
          subtitle="Push y reportes semanales"
          onPress={comingSoon('Notificaciones')}
        />
      </ListSection>

      <ListSection title="Seguridad y privacidad">
        <ListRow
          icon="scan-outline"
          title="Face ID"
          subtitle="Requerido para transferencias"
          toggle={{ value: biometrics, onChange: setBiometrics }}
        />
        <ListRow icon="shield-checkmark-outline" title="Privacidad de datos" onPress={comingSoon('Privacidad')} />
        <ListRow icon="download-outline" title="Exportar mis datos" onPress={comingSoon('Exportar datos')} />
      </ListSection>

      <ListSection inset={false}>
        <ListRow title="Cerrar sesión" destructive onPress={confirmSignOut} />
      </ListSection>

      <View style={{ alignItems: 'center', gap: 2 }}>
        <AppText variant="caption" tone="tertiary">
          Gastia v{appConfig.expo.version}
        </AppText>
      </View>
    </Screen>
  );
}
