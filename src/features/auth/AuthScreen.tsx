import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GastiaLogo } from '../../components/brand/GastiaLogo';
import { AppText, Button, Card, Chip } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { AuthField } from './components/AuthField';
import { InfoNote } from './components/InfoNote';

type Mode = 'signIn' | 'signUp';

const comingSoon = (title: string) => () => Alert.alert(title, 'Próximamente.');

export function AuthScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInputInstance>(null);

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignIn = mode === 'signIn';
  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const credentials = { email: email.trim(), password };
    // On success the session listener in AuthProvider switches to the tabs.
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
      ]}
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        <GastiaLogo size={88} />
        <Chip label="Inteligencia algorítmica" icon="sparkles-outline" uppercase size="md" />
        <AppText variant="title" style={styles.center}>
          Gastia
        </AppText>
        <AppText tone="secondary" style={styles.center}>
          Tus finanzas inteligentes, simplificadas al extremo
        </AppText>
      </View>

      <Card style={styles.form}>
        <AuthField
          label="Correo electrónico"
          icon="at"
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
          icon="lock-open-outline"
          placeholder={isSignIn ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
          secure
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          textContentType={isSignIn ? 'password' : 'newPassword'}
          returnKeyType="go"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          labelAction={
            isSignIn ? { text: '¿Olvidaste tu contraseña?', onPress: comingSoon('Recuperar contraseña') } : undefined
          }
        />

        {error && (
          <AppText variant="small" tone="danger">
            {error}
          </AppText>
        )}

        <Button
          title={isSignIn ? 'Iniciar Sesión' : 'Crear cuenta'}
          icon="arrow-forward"
          iconPosition="right"
          size="lg"
          loading={loading}
          disabled={!canSubmit}
          onPress={handleSubmit}
        />
        {isSignIn && (
          <Button
            title="Ingresar con Face ID"
            icon="happy-outline"
            variant="secondary"
            size="lg"
            onPress={comingSoon('Face ID')}
          />
        )}
      </Card>

      <InfoNote
        icon="analytics-outline"
        title="Privacidad por diseño"
        text="Tus datos financieros son solo tuyos: nunca los compartimos."
      />

      <View style={styles.footer}>
        <Pressable onPress={toggleMode} disabled={loading} style={styles.switchRow} hitSlop={8}>
          <AppText tone="secondary">{isSignIn ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</AppText>
          <AppText style={styles.switchLink}>{isSignIn ? 'Regístrate gratis' : 'Inicia sesión'}</AppText>
        </Pressable>
        <View style={styles.securityRow}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textTertiary} />
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
  content: { paddingHorizontal: 20, gap: 24 },
  hero: { alignItems: 'center', gap: 12 },
  center: { textAlign: 'center' },
  form: { gap: 18 },
  footer: { alignItems: 'center', gap: 16, marginTop: 8 },
  switchRow: { flexDirection: 'row', gap: 6 },
  switchLink: { fontWeight: '600', textDecorationLine: 'underline', color: c.text },
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
}));
