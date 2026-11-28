import type { ReactElement, ReactNode, Ref } from 'react';
import {
  ScrollView,
  type RefreshControlProps,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { SCREEN_PADDING, spacing } from '../../theme/tokens';

type Props = {
  children: ReactNode;
  scrollRef?: Ref<ScrollViewInstance>;
  contentStyle?: StyleProp<ViewStyle>;
  onContentSizeChange?: (width: number, height: number) => void;
  /** Pull-to-refresh, e.g. `<RefreshControl refreshing={...} onRefresh={...} />`. */
  refreshControl?: ReactElement<RefreshControlProps>;
};

/**
 * Scrollable screen body under the native header. `automatic` insets let the
 * iOS large title collapse on scroll and keep content clear of the tab bar.
 */
export function Screen({ children, scrollRef, contentStyle, onContentSizeChange, refreshControl }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        {
          paddingHorizontal: SCREEN_PADDING,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xxxl,
          gap: spacing.xxl,
        },
        contentStyle,
      ]}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      // Number pads have no return key; dragging the content hides the keyboard.
      keyboardDismissMode="interactive"
      onContentSizeChange={onContentSizeChange}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  );
}
