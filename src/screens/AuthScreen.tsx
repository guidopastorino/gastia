import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { supabase } from '../lib/supabase';
import type { Colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

type Mode = 'signIn' | 'signUp';

export function AuthScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignIn = mode === 'signIn';
  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const credentials = { email: email.trim(), password };
    // On success the session listener in AuthProvider switches to the home screen.
    const { error } = isSignIn
      ? await supabase.auth.signInWithPassword(credentials)
      : await supabase.auth.signUp(credentials);

    if (error) setError(error.message);
    setLoading(false);
  }

  function toggleMode() {
    setMode(isSignIn ? 'signUp' : 'signIn');
    setError(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.title}>{isSignIn ? 'Iniciar sesión' : 'Crear cuenta'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña (mínimo 6 caracteres)"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          textContentType={isSignIn ? 'password' : 'newPassword'}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={() => canSubmit && handleSubmit()}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>{isSignIn ? 'Entrar' : 'Registrarme'}</Text>
          )}
        </Pressable>

        <Pressable onPress={toggleMode} disabled={loading}>
          <Text style={styles.link}>
            {isSignIn ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
    form: { gap: 12 },
    title: { fontSize: 26, fontWeight: '700', marginBottom: 8, color: colors.text },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
    },
    error: { color: colors.danger },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4,
    },
    buttonDisabled: { opacity: 0.4 },
    buttonText: { color: colors.onPrimary, fontWeight: '600', fontSize: 16 },
    link: { textAlign: 'center', color: colors.link, marginTop: 8 },
  });
}
