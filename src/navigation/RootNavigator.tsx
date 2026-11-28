import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform, Pressable } from 'react-native';

import { AppText } from '../components/ui';
import { AddIncomeScreen } from '../features/finance/AddIncomeScreen';
import { TransferScreen } from '../features/finance/TransferScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { TransactionsScreen } from '../features/transactions/TransactionsScreen';
import type { Colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';
import { AppTabs } from './AppTabs';
import { nativeHeaderOptions } from './headerOptions';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Sheet for short forms (ingresar, transferir). Solid header so content doesn't slide under it,
 * and "Cancelar" because iOS sheets have no back button.
 */
const formSheetOptions = (
  { navigation }: { navigation: { goBack: () => void } },
  colors: Colors,
): NativeStackNavigationOptions => ({
  presentation: 'modal',
  headerLargeTitleEnabled: false,
  headerTransparent: false,
  headerStyle: { backgroundColor: colors.background },
  headerLeft:
    Platform.OS === 'ios'
      ? () => (
          <Pressable onPress={navigation.goBack} hitSlop={10} accessibilityRole="button">
            <AppText>Cancelar</AppText>
          </Pressable>
        )
      : undefined,
});

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
      <Stack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Movimientos' }} />
      <Stack.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={(props) => ({ ...formSheetOptions(props, colors), title: 'Ingresar dinero' })}
      />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={(props) => ({ ...formSheetOptions(props, colors), title: 'Transferir' })}
      />
    </Stack.Navigator>
  );
}
