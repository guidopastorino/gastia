import type { ReactNode, Ref } from 'react';
import {
  ScrollView,
  View,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/tokens';
import { AppHeader } from './AppHeader';

type Props = {
  title: string;
  children: ReactNode;
  scrollRef?: Ref<ScrollViewInstance>;
  contentStyle?: StyleProp<ViewStyle>;
  onContentSizeChange?: (width: number, height: number) => void;
};

/** Tab screen layout: app header on top, scrollable content below (insets handled for the native tab bar). */
export function TabScreen({ title, children, scrollRef, contentStyle, onContentSizeChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title={title} />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={[
          { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl * 2 },
          contentStyle,
        ]}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={onContentSizeChange}
      >
        {children}
      </ScrollView>
    </View>
  );
}
