import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText, Avatar, Card } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  name: string;
  email: string;
  onPress: () => void;
};

/** Tappable summary of the signed-in user; opens the profile. */
export function ProfileCard({ name, email, onPress }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} style={styles.card}>
      <Avatar name={name} size={56} />
      <View style={styles.texts}>
        <AppText variant="heading" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="small" tone="secondary" numberOfLines={1}>
          {email}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18 },
  texts: { flex: 1, gap: 2 },
}));
