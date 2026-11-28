import { supabase } from '../lib/supabase';
import { signOutFromGoogle } from './googleSignIn';

/** Ends the Supabase session and forgets the Google account, if one was used. */
export async function signOut() {
  await signOutFromGoogle();
  await supabase.auth.signOut();
}
