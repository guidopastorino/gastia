import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '../features/profile/ProfileScreen';
import { useTheme } from '../theme/ThemeProvider';
import { AppTabs } from './AppTabs';
import { nativeHeaderOptions } from './headerOptions';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Tabs at the root, with full-screen pages (profile...) pushed on top. */
export function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...nativeHeaderOptions(colors),
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}
