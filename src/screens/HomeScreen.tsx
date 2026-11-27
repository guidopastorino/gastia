import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import type { Colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { session } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  if (!session) return null;
  const { user } = session;

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Hola 👋</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.card}>
        <Row styles={styles} label="User ID" value={user.id} />
        <Row styles={styles} label="Creado" value={new Date(user.created_at).toLocaleString()} />
        {session.expires_at && (
          <Row styles={styles} label="Sesión expira" value={new Date(session.expires_at * 1000).toLocaleString()} />
        )}
      </View>

      <Pressable style={styles.button} onPress={handleSignOut} disabled={signingOut}>
        <Text style={styles.buttonText}>{signingOut ? 'Saliendo…' : 'Cerrar sesión'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({
  styles,
  label,
  value,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} selectable>
        {value}
      </Text>
    </View>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 12 },
    title: { fontSize: 20, fontWeight: '600', color: colors.text },
    email: { fontSize: 15, color: colors.textSecondary, marginTop: -8 },
    card: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 16,
      gap: 10,
      marginTop: 8,
    },
    row: { gap: 2 },
    label: { fontSize: 12, color: colors.textTertiary },
    value: { fontSize: 14, color: colors.text },
    button: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: { fontWeight: '600', fontSize: 16, color: colors.text },
  });
}
