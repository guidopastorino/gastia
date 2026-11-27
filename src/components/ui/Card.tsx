import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles } from '../../theme/makeStyles';
import { radius, spacing } from '../../theme/tokens';

type Props = {
  children: ReactNode;
  /** `muted` uses the surface fill, for cards nested inside other cards. */
  variant?: 'default' | 'muted';
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, variant = 'default', padded = true, style }: Props) {
  const styles = useStyles();
  return (
    <View style={[styles.base, variant === 'muted' && styles.muted, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  base: {
    backgroundColor: c.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.separator,
    overflow: 'hidden',
  },
  muted: { backgroundColor: c.surface, borderColor: 'transparent' },
  padded: { padding: spacing.xl },
}));
