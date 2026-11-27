import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';

export function HomeScreen() {
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hola 👋</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.card}>
        <Row label="User ID" value={user.id} />
        <Row label="Creado" value={new Date(user.created_at).toLocaleString()} />
        {session.expires_at && (
          <Row label="Sesión expira" value={new Date(session.expires_at * 1000).toLocaleString()} />
        )}
      </View>

      <Pressable style={styles.button} onPress={handleSignOut} disabled={signingOut}>
        <Text style={styles.buttonText}>{signingOut ? 'Saliendo…' : 'Cerrar sesión'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  email: { fontSize: 16, color: '#555' },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 16, gap: 10, marginTop: 8 },
  row: { gap: 2 },
  label: { fontSize: 12, color: '#888' },
  value: { fontSize: 14 },
  button: {
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { fontWeight: '600', fontSize: 16 },
});
