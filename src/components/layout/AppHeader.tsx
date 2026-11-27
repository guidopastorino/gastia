import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../auth/AuthProvider';
import { getDisplayName } from '../../lib/user';
import type { AppTabsParamList } from '../../navigation/types';
import { makeStyles } from '../../theme/makeStyles';
import { GastiaLogo } from '../brand/GastiaLogo';
import { AppText, Avatar, IconButton } from '../ui';

type Props = {
  title: string;
};

export function AppHeader({ title }: Props) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<AppTabsParamList>>();
  const { session } = useAuth();
  const name = getDisplayName(session?.user);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <GastiaLogo size={40} />
      <View style={styles.titles}>
        <AppText variant="overline" tone="secondary">
          gastia
        </AppText>
        <AppText variant="heading" numberOfLines={1} accessibilityRole="header">
          {title}
        </AppText>
      </View>
      <IconButton
        icon="notifications-outline"
        accessibilityLabel="Notificaciones"
        onPress={() => Alert.alert('Notificaciones', 'No tenés notificaciones nuevas.')}
      />
      <Avatar name={name} size={38} onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: c.header,
    borderBottomWidth: 1,
    borderBottomColor: c.separator,
  },
  titles: { flex: 1, gap: 1 },
}));
