import { Platform } from 'react-native';

import type { Colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/**
 * Native header look shared by tabs and stack screens:
 * iOS large title that collapses on scroll over the page background,
 * flat Material toolbar on Android.
 */
export function nativeHeaderOptions(colors: Colors) {
  return {
    headerShown: true,
    headerLargeTitleEnabled: true,
    headerTransparent: Platform.OS === 'ios',
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    headerTintColor: colors.text,
    headerStyle: Platform.OS === 'ios' ? undefined : { backgroundColor: colors.background },
    headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
    headerLargeTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
  } as const;
}
