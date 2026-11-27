import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { API_URL, getHealth, type HealthResponse } from './src/lib/api';

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; data: HealthResponse }
  | { kind: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  const check = useCallback(async () => {
    setState({ kind: 'loading' });
    try {
      setState({ kind: 'ok', data: await getHealth() });
    } catch (e) {
      setState({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API health</Text>
      <Text style={styles.url}>{API_URL}/health</Text>

      {state.kind === 'loading' && <ActivityIndicator />}
      {state.kind === 'ok' && (
        <>
          <Text style={[styles.status, styles.ok]}>{state.data.status}</Text>
          <Text style={styles.meta}>{state.data.timestamp}</Text>
        </>
      )}
      {state.kind === 'error' && (
        <Text style={[styles.status, styles.error]}>{state.message}</Text>
      )}

      <Pressable style={styles.button} onPress={check}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: '600' },
  url: { fontSize: 13, color: '#666' },
  status: { fontSize: 18, fontWeight: '600' },
  ok: { color: '#1a7f37' },
  error: { color: '#cf222e' },
  meta: { fontSize: 12, color: '#888' },
  button: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
