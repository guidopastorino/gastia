import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles } from '../../theme/makeStyles';
import { radius, spacing } from '../../theme/tokens';

type Props = {
  children: ReactNode;
  /** `muted` uses the surface fill, for blocks nested inside other cards. */
  variant?: 'default' | 'muted';
  padded?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, variant = 'default', padded = true, onPress, style }: Props) {
  const styles = useStyles();
  const cardStyle = [styles.base, variant === 'muted' && styles.muted, padded && styles.padded, style];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, pressed && { opacity: 0.75 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}

const useStyles = makeStyles((c) => ({
  base: {
    backgroundColor: c.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  muted: { backgroundColor: c.surface },
  padded: { padding: spacing.xl },
}));
