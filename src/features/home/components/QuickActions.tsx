import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { AppText, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

export type QuickAction = {
  id: string;
  label: string;
  icon: IconName;
  /** The first action is usually the primary one (filled). */
  primary?: boolean;
  onPress: () => void;
};

type Props = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {actions.map((a) => (
        <Pressable
          key={a.id}
          onPress={a.onPress}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel={a.label}
        >
          <View style={[styles.circle, a.primary && styles.circlePrimary]}>
            <Ionicons name={a.icon} size={22} color={a.primary ? colors.onPrimary : colors.icon} />
          </View>
          <AppText variant="caption" tone="secondary">
            {a.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: 'row', gap: 12 },
  item: { flex: 1, alignItems: 'center', gap: 8 },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: c.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePrimary: { backgroundColor: c.primary },
}));
