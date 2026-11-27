import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

type Props = {
  title: string;
  /** `overline` for small section labels, `heading` for list titles. */
  variant?: 'overline' | 'heading';
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, variant = 'heading', action }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant={variant} tone={variant === 'overline' ? 'tertiary' : 'default'}>
        {title}
      </AppText>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={10}>
          <AppText variant="smallStrong" tone="secondary">
            {action.label}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});
