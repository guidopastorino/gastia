import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { palettes, type ColorScheme, type Colors } from './colors';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  scheme: ColorScheme;
  colors: Colors;
};

const STORAGE_KEY = 'theme-preference';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

// Overriding the app-wide appearance also themes native UI (alerts, keyboard, switches).
function applyPreference(preference: ThemePreference) {
  Appearance.setColorScheme(preference === 'system' ? 'auto' : preference);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);
  const systemOrOverride = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isPreference(stored)) {
          setPreferenceState(stored);
          applyPreference(stored);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    applyPreference(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme: ColorScheme =
    preference === 'system' ? (systemOrOverride === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({ preference, setPreference, scheme, colors: palettes[scheme] }),
    [preference, setPreference, scheme],
  );

  // Avoid a flash of the wrong theme while the stored preference loads.
  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
