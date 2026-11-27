import Ionicons from '@expo/vector-icons/Ionicons';
import { createContext, useContext, useMemo, useState, type ComponentProps, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import appConfig from '../../app.json';
import { useAuth } from '../auth/AuthProvider';
import { SegmentedControl } from '../components/SegmentedControl';
import { supabase } from '../lib/supabase';
import type { Colors } from '../theme/colors';
import { useTheme, type ThemePreference } from '../theme/ThemeProvider';

type IconName = ComponentProps<typeof Ionicons>['name'];
type Styles = ReturnType<typeof createStyles>;

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
] as const satisfies readonly { value: ThemePreference; label: string }[];

const StylesContext = createContext<{ styles: Styles; colors: Colors } | null>(null);

function useStyles() {
  const ctx = useContext(StylesContext);
  if (!ctx) throw new Error('useStyles must be used inside SettingsScreen');
  return ctx;
}

const comingSoon = (feature: string) => () => Alert.alert(feature, 'Próximamente.');

export function SettingsScreen() {
  const { session } = useAuth();
  const { colors, preference, setPreference } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const email = session?.user.email ?? '';

  // Mock preferences: local state only, not persisted.
  const [notifications, setNotifications] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(false);

  function confirmSignOut() {
    Alert.alert('Cerrar sesión', '¿Seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  }

  return (
    <StylesContext.Provider value={{ styles, colors }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
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
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </Pressable>

        <Section title="Cuenta">
          <Row icon="person-outline" color="#0a84ff" label="Editar perfil" onPress={comingSoon('Editar perfil')} />
          <Row icon="key-outline" color="#8e8e93" label="Cambiar contraseña" onPress={comingSoon('Cambiar contraseña')} />
          <Row icon="star-outline" color="#ff9f0a" label="Plan" value="Gratis" onPress={comingSoon('Plan')} />
        </Section>

        <Section title="Preferencias">
          <Row icon="contrast-outline" color="#8e8e93" label="Tema">
            <SegmentedControl options={THEME_OPTIONS} value={preference} onChange={setPreference} />
          </Row>
          <Row icon="cash-outline" color="#30d158" label="Moneda" value="USD" onPress={comingSoon('Moneda')} />
          <Row icon="globe-outline" color="#5e5ce6" label="Idioma" value="Español" onPress={comingSoon('Idioma')} />
        </Section>

        <Section title="Notificaciones" footer="Te avisamos cuando te acercás a tu presupuesto.">
          <Row icon="notifications-outline" color="#ff375f" label="Notificaciones push">
            <Switch value={notifications} onValueChange={setNotifications} />
          </Row>
          <Row icon="calendar-outline" color="#ff9f0a" label="Resumen mensual">
            <Switch value={monthlySummary} onValueChange={setMonthlySummary} />
          </Row>
        </Section>

        <Section title="Soporte">
          <Row icon="help-circle-outline" color="#0a84ff" label="Ayuda" onPress={comingSoon('Ayuda')} />
          <Row icon="document-text-outline" color="#8e8e93" label="Términos y condiciones" onPress={comingSoon('Términos')} />
          <Row icon="shield-checkmark-outline" color="#30d158" label="Privacidad" onPress={comingSoon('Privacidad')} />
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
    </StylesContext.Provider>
  );
}

function Section({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  const { styles } = useStyles();
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
  const { styles, colors } = useStyles();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name={icon} size={ICON_SIZE} color={color} style={styles.icon} />
      <Text style={styles.rowLabel} numberOfLines={1}>
        {label}
      </Text>
      {children ?? (
        <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      )}
    </Pressable>
  );
}

const ICON_SIZE = 22;
const ROW_PADDING = 16;

function createStyles(colors: Colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.groupedBackground },
    content: { paddingVertical: 20, paddingHorizontal: 16, gap: 24 },
    pressed: { backgroundColor: colors.pressed },

    profile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { color: colors.onPrimary, fontSize: 24, fontWeight: '600' },
    profileText: { flex: 1, gap: 2 },
    profileName: { fontSize: 18, fontWeight: '600', color: colors.text },
    profileEmail: { fontSize: 14, color: colors.textTertiary },

    section: { gap: 6 },
    sectionTitle: { fontSize: 13, color: colors.textSecondary, paddingHorizontal: ROW_PADDING },
    sectionFooter: { fontSize: 13, color: colors.textSecondary, paddingHorizontal: ROW_PADDING },
    card: { backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden' },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.separator,
      marginLeft: ROW_PADDING + ICON_SIZE + 14,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      minHeight: 48,
      paddingHorizontal: ROW_PADDING,
      paddingVertical: 8,
      backgroundColor: colors.card,
    },
    icon: { width: ICON_SIZE, textAlign: 'center' },
    rowLabel: { flex: 1, fontSize: 16, color: colors.text },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowValue: { fontSize: 16, color: colors.textTertiary },

    signOut: { justifyContent: 'center' },
    signOutText: { fontSize: 16, color: colors.danger, fontWeight: '500' },

    version: { textAlign: 'center', fontSize: 13, color: colors.textTertiary },
  });
}
