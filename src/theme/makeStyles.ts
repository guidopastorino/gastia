import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import type { Colors } from './colors';
import { useTheme } from './ThemeProvider';

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

/**
 * Creates a hook that returns theme-aware styles, memoized per palette.
 *
 *   const useStyles = makeStyles((c) => ({ box: { backgroundColor: c.card } }));
 *   const styles = useStyles();
 */
export function makeStyles<T extends NamedStyles>(factory: (colors: Colors) => T) {
  return function useStyles(): Readonly<T> {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
