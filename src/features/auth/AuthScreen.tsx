import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signInWithGoogle } from '../../auth/googleSignIn';
import { GastiaLogo } from '../../components/brand/GastiaLogo';
import { AppText, Button } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { SCREEN_PADDING } from '../../theme/tokens';
import { AuthField } from './components/AuthField';

type Mode = 'signIn' | 'signUp';

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

/** Trims and collapses inner whitespace: "  ana   pérez " -> "ana pérez". */
function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

export function AuthScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const [mode, setMode] = useState<Mode>('signIn');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignIn = mode === 'signIn';
  const nameValid = isSignIn || normalizeName(fullName).length >= 2;
  const busy = loading || googleLoading;
  const canSubmit = nameValid && email.trim().length > 0 && password.length >= 6 && !busy;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const credentials = { email: email.trim(), password };
    // On success the session listener in AuthProvider switches to the tabs.
    // The name is stored in the auth user's metadata (read by lib/user getDisplayName).
    const { error } = isSignIn
      ? await supabase.auth.signInWithPassword(credentials)
      : await supabase.auth.signUp({
          ...credentials,
          options: { data: { full_name: normalizeName(fullName) } },
        });

    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleGoogle() {
    if (busy) return;
    setGoogleLoading(true);
    setError(null);
    // On success the session listener in AuthProvider switches to the tabs.
    const result = await signInWithGoogle();
    if (result.status === 'error') setError(result.message);
    setGoogleLoading(false);
  }

  function toggleMode() {
    setMode(isSignIn ? 'signUp' : 'signIn');
    setError(null);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 },
      ]}
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        <GastiaLogo size={64} />
        <View style={styles.heroText}>
          <AppText variant="title">{isSignIn ? 'Bienvenido a Gastia' : 'Crea tu cuenta'}</AppText>
          <AppText tone="secondary">
            {isSignIn ? 'Tus finanzas, simples e inteligentes.' : 'Empieza a ordenar tus gastos en minutos.'}
          </AppText>
        </View>
      </View>

      <View style={styles.form}>
        {!isSignIn && (
          <AuthField
            label="Nombre completo"
            icon="person-outline"
            placeholder="Tu nombre y apellido"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            value={fullName}
            onChangeText={setFullName}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
        <AuthField
          ref={emailRef}
          label="Email"
          icon="mail-outline"
          placeholder="correo@ejemplo.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <AuthField
          ref={passwordRef}
          label="Contraseña"
          icon="lock-closed-outline"
          placeholder={isSignIn ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
          secure
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          textContentType={isSignIn ? 'password' : 'newPassword'}
          returnKeyType="go"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          labelAction={
            isSignIn ? { text: '¿La olvidaste?', onPress: comingSoon('Recuperar contraseña') } : undefined
          }
        />

        {error && (
          <AppText variant="small" tone="danger">
            {error}
          </AppText>
        )}
      </View>

      <Button
        title={isSignIn ? 'Iniciar sesión' : 'Crear cuenta'}
        size="lg"
        loading={loading}
        disabled={!canSubmit}
        onPress={handleSubmit}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <AppText variant="caption" tone="tertiary">
          o
        </AppText>
        <View style={styles.dividerLine} />
      </View>

      <Button
        title="Continuar con Google"
        variant="outline"
        size="lg"
        icon="logo-google"
        loading={googleLoading}
        disabled={loading}
        onPress={handleGoogle}
      />

      <View style={styles.footer}>
        <Pressable onPress={toggleMode} disabled={busy} style={styles.switchRow} hitSlop={10}>
          <AppText tone="secondary">{isSignIn ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</AppText>
          <AppText variant="bodyStrong">{isSignIn ? 'Regístrate' : 'Inicia sesión'}</AppText>
        </Pressable>
        <View style={styles.securityRow}>
          <Ionicons name="lock-closed" size={12} color={colors.textTertiary} />
          <AppText variant="caption" tone="tertiary">
            Conexión segura y cifrada
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((c) => ({
  screen: { flex: 1, backgroundColor: c.background },
  content: { flexGrow: 1, paddingHorizontal: SCREEN_PADDING + 4, gap: 36 },
  hero: { gap: 24 },
  heroText: { gap: 8 },
  form: { gap: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: -20 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: c.border },
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
  switchRow: { flexDirection: 'row', gap: 6 },
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
}));
