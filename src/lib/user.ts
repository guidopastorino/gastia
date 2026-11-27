import type { User } from '@supabase/supabase-js';

/** Name from profile metadata, falling back to a cleaned-up email prefix. */
export function getDisplayName(user: User | null | undefined) {
  const meta = user?.user_metadata?.full_name ?? user?.user_metadata?.name;
  if (typeof meta === 'string' && meta.trim()) return meta.trim();

  const prefix = user?.email?.split('@')[0] ?? '';
  const cleaned = prefix
    .replace(/[._-]+/g, ' ')
    .replace(/\d+/g, '')
    .trim();
  if (!cleaned) return 'Usuario';
  return cleaned.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

export function getFirstName(user: User | null | undefined) {
  return getDisplayName(user).split(' ')[0];
}
