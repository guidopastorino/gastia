import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';

type Props = {
  icon: IconName;
  title: string;
  text: string;
};

export function InfoNote({ icon, title, text }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={colors.icon} />
      </View>
      <View style={styles.texts}>
        <AppText variant="overline" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="small" tone="secondary" numberOfLines={2}>
          {text}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: c.surface,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: 2 },
  title: { color: c.text },
}));
