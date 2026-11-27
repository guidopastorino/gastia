import { useNavigation, type NavigationProp } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import { getDisplayName } from '../../lib/user';
import type { RootStackParamList } from '../../navigation/types';
import { Avatar } from '../ui';

/** Avatar shown at the right of tab headers; opens the profile. */
export function HeaderAvatar() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { session } = useAuth();

  return <Avatar name={getDisplayName(session?.user)} size={34} onPress={() => navigation.navigate('Profile')} />;
}
