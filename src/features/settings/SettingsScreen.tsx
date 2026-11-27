import { useState } from 'react';
import { Alert, View } from 'react-native';

import appConfig from '../../../app.json';
import { useAuth } from '../../auth/AuthProvider';
import { TabScreen } from '../../components/layout/TabScreen';
import { AppText, Button } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { getDisplayName } from '../../lib/user';
import { AdviceLevelRow, type AdviceLevel } from './components/AdviceLevelRow';
import { ProfileCard } from './components/ProfileCard';
import { SettingsRow } from './components/SettingsRow';
import { SettingsSection } from './components/SettingsSection';
import { ThemeRow } from './components/ThemeRow';

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

export function SettingsScreen() {
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
    <TabScreen title="Ajustes" contentStyle={{ gap: 24 }}>
      <ProfileCard name={getDisplayName(user)} email={user?.email ?? ''} />

      <SettingsSection title="Inteligencia artificial" icon="hardware-chip-outline">
        <SettingsRow
          title="Modo Autónomo de IA"
          subtitle="Permitir alertas proactivas y detección de fugas de dinero"
          toggle={{ value: autonomousAi, onChange: setAutonomousAi }}
        />
        <AdviceLevelRow value={adviceLevel} onChange={setAdviceLevel} />
        <SettingsRow
          icon="business-outline"
          title="Vincular nuevas cuentas bancarias"
          badge="3 bancos"
          onPress={comingSoon('Vincular cuentas')}
        />
      </SettingsSection>

      <SettingsSection title="Preferencias y apariencia" icon="options-outline">
        <SettingsRow
          icon="logo-usd"
          title="Moneda Principal"
          value="USD ($)"
          onPress={comingSoon('Moneda principal')}
        />
        <ThemeRow />
        <SettingsRow
          icon="notifications-outline"
          title="Notificaciones y Alertas de gasto"
          subtitle="Push y reportes semanales"
          onPress={comingSoon('Notificaciones')}
        />
      </SettingsSection>

      <SettingsSection title="Seguridad y privacidad" icon="lock-closed-outline">
        <SettingsRow
          icon="happy-outline"
          title="Face ID / Biometría"
          subtitle="Requerido para transferencias"
          toggle={{ value: biometrics, onChange: setBiometrics }}
        />
        <SettingsRow
          icon="shield-half-outline"
          title="Privacidad de datos e IA"
          onPress={comingSoon('Privacidad')}
        />
        <SettingsRow
          icon="download-outline"
          title="Exportar datos personales"
          onPress={comingSoon('Exportar datos')}
        />
      </SettingsSection>

      <View style={{ gap: 14 }}>
        <Button title="Cerrar Sesión" icon="log-out-outline" variant="outline" size="lg" onPress={confirmSignOut} />
        <View style={{ alignItems: 'center', gap: 2 }}>
          <AppText variant="caption" tone="secondary">
            Gastia v{appConfig.expo.version}
          </AppText>
          <AppText variant="caption" tone="tertiary">
            Diseñado con precisión matemática
          </AppText>
        </View>
      </View>
    </TabScreen>
  );
}
