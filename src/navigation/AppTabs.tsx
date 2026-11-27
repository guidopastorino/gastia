import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';

import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type AppTabsParamList = {
  Home: undefined;
  Settings: undefined;
};

type IconName = ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<keyof AppTabsParamList, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? ICONS[route.name].active : ICONS[route.name].inactive}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
}
