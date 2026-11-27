import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import appConfig from '../../app.json';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';

type IconName = ComponentProps<typeof Ionicons>['name'];

const comingSoon = (feature: string) => () => Alert.alert(feature, 'Próximamente.');

export function SettingsScreen() {
  const { session } = useAuth();
  const email = session?.user.email ?? '';

  // Mock preferences: local state only, not persisted.
  const [notifications, setNotifications] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  function confirmSignOut() {
    Alert.alert('Cerrar sesión', '¿Seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable
        style={({ pressed }) => [styles.profile, pressed && styles.pressed]}
        onPress={comingSoon('Perfil')}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{email.charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.profileName} numberOfLines={1}>
            {email.split('@')[0]}
          </Text>
          <Text style={styles.profileEmail} numberOfLines={1}>
            {email}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#c7c7cc" />
      </Pressable>

      <Section title="Cuenta">
        <Row icon="person" color="#0a84ff" label="Editar perfil" onPress={comingSoon('Editar perfil')} />
        <Row icon="key" color="#8e8e93" label="Cambiar contraseña" onPress={comingSoon('Cambiar contraseña')} />
        <Row icon="star" color="#ff9f0a" label="Plan" value="Gratis" onPress={comingSoon('Plan')} />
      </Section>

      <Section title="Preferencias">
        <Row icon="cash" color="#30d158" label="Moneda" value="USD" onPress={comingSoon('Moneda')} />
        <Row icon="globe" color="#5e5ce6" label="Idioma" value="Español" onPress={comingSoon('Idioma')} />
        <Row icon="moon" color="#1c1c1e" label="Modo oscuro">
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </Row>
      </Section>

      <Section title="Notificaciones" footer="Te avisamos cuando te acercás a tu presupuesto.">
        <Row icon="notifications" color="#ff375f" label="Notificaciones push">
          <Switch value={notifications} onValueChange={setNotifications} />
        </Row>
        <Row icon="calendar" color="#ff9f0a" label="Resumen mensual">
          <Switch value={monthlySummary} onValueChange={setMonthlySummary} />
        </Row>
      </Section>

      <Section title="Soporte">
        <Row icon="help-circle" color="#0a84ff" label="Ayuda" onPress={comingSoon('Ayuda')} />
        <Row icon="document-text" color="#8e8e93" label="Términos y condiciones" onPress={comingSoon('Términos')} />
        <Row icon="shield-checkmark" color="#30d158" label="Privacidad" onPress={comingSoon('Privacidad')} />
      </Section>

      <Section>
        <Pressable
          style={({ pressed }) => [styles.row, styles.signOut, pressed && styles.pressed]}
          onPress={confirmSignOut}
        >
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </Pressable>
      </Section>

      <Text style={styles.version}>
        {appConfig.expo.name} v{appConfig.expo.version}
      </Text>
    </ScrollView>
  );
}

function Section({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  const rows = Array.isArray(children) ? children.filter(Boolean) : [children];
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>}
      <View style={styles.card}>
        {rows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={styles.separator} />}
            {row}
          </View>
        ))}
      </View>
      {footer && <Text style={styles.sectionFooter}>{footer}</Text>}
    </View>
  );
}

type RowProps = {
  icon: IconName;
  color: string;
  label: string;
  value?: string;
  onPress?: () => void;
  children?: ReactNode;
};

function Row({ icon, color, label, value, onPress, children }: RowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <Text style={styles.rowLabel} numberOfLines={1}>
        {label}
      </Text>
      {children ?? (
        <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={18} color="#c7c7cc" />
        </View>
      )}
    </Pressable>
  );
}

const ICON_BOX = 29;
const ROW_PADDING = 16;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { paddingVertical: 20, paddingHorizontal: 16, gap: 24 },
  pressed: { backgroundColor: '#e5e5ea' },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '600' },
  profileText: { flex: 1, gap: 2 },
  profileName: { fontSize: 18, fontWeight: '600' },
  profileEmail: { fontSize: 14, color: '#8e8e93' },

  section: { gap: 6 },
  sectionTitle: { fontSize: 13, color: '#6d6d72', paddingHorizontal: ROW_PADDING },
  sectionFooter: { fontSize: 13, color: '#6d6d72', paddingHorizontal: ROW_PADDING },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c6c6c8',
    marginLeft: ROW_PADDING + ICON_BOX + 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: ROW_PADDING,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontSize: 16, color: '#000' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 16, color: '#8e8e93' },

  signOut: { justifyContent: 'center' },
  signOutText: { fontSize: 16, color: '#ff3b30', fontWeight: '500' },

  version: { textAlign: 'center', fontSize: 13, color: '#8e8e93' },
});
