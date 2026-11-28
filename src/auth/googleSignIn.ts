import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { supabase } from '../lib/supabase';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!webClientId) {
    throw new Error('Falta EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en el .env.');
  }
  // webClientId makes Google issue an ID token whose audience is the Web client,
  // which is the client ID Supabase checks first.
  GoogleSignin.configure({ webClientId, iosClientId });
  configured = true;
}

export type GoogleSignInResult = { status: 'success' } | { status: 'cancelled' } | { status: 'error'; message: string };

/**
 * Opens the native Google account picker and exchanges the ID token for a Supabase session.
 * On success the AuthProvider session listener takes over.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  try {
    ensureConfigured();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return { status: 'cancelled' };

    const { idToken } = response.data;
    if (!idToken) {
      return { status: 'error', message: 'Google no devolvió un token de identidad.' };
    }

    const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
    if (error) return { status: 'error', message: error.message };

    return { status: 'success' };
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return { status: 'cancelled' };
        case statusCodes.IN_PROGRESS:
          return { status: 'error', message: 'Ya hay un inicio de sesión en curso.' };
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return { status: 'error', message: 'Google Play Services no está disponible en este dispositivo.' };
      }
    }
    const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión con Google.';
    return { status: 'error', message };
  }
}

/** Clears the cached Google account so the picker shows again on the next sign-in. */
export async function signOutFromGoogle() {
  if (!webClientId) return;
  try {
    ensureConfigured();
    await GoogleSignin.signOut();
  } catch {
    // Not signed in with Google: nothing to clear.
  }
}
