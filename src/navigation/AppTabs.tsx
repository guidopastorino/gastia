import Ionicons from '@expo/vector-icons/Ionicons';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabIcon,
} from '@react-navigation/bottom-tabs/unstable';
import { useEffect, useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';

import type { IconName } from '../components/ui';
import { AssistantScreen } from '../features/assistant/AssistantScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { StatsScreen } from '../features/stats/StatsScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { AppTabsParamList } from './types';

type TabName = keyof AppTabsParamList;
type SFSymbol = Extract<NativeBottomTabIcon, { type: 'sfSymbol' }>['name'];
type AndroidIcons = Partial<Record<TabName, ImageSourcePropType>>;

// iOS uses SF Symbols (native look, Liquid Glass on iOS 26+).
// Android has no SF Symbols, so Ionicons are rendered to images and tinted natively.
const ICONS: Record<TabName, { sf: SFSymbol; sfFocused: SFSymbol; android: IconName }> = {
  Home: { sf: 'house', sfFocused: 'house.fill', android: 'home-outline' },
  Stats: { sf: 'chart.bar', sfFocused: 'chart.bar.fill', android: 'stats-chart-outline' },
  Assistant: { sf: 'sparkles', sfFocused: 'sparkles', android: 'sparkles-outline' },
  Settings: { sf: 'slider.horizontal.3', sfFocused: 'slider.horizontal.3', android: 'options-outline' },
};

const Tab = createNativeBottomTabNavigator<AppTabsParamList>();

function useAndroidIcons() {
  const [icons, setIcons] = useState<AndroidIcons | null>(Platform.OS === 'android' ? null : {});

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const names = Object.keys(ICONS) as TabName[];
    Promise.all(names.map((name) => Ionicons.getImageSource(ICONS[name].android, 24, 'black'))).then(
      (sources) => {
        const loaded: AndroidIcons = {};
        names.forEach((name, i) => {
          const source = sources[i];
          if (source) loaded[name] = source;
        });
        setIcons(loaded);
      },
    );
  }, []);

  return icons;
}

function tabIcon(name: TabName, androidIcons: AndroidIcons) {
  return ({ focused }: { focused: boolean }): NativeBottomTabIcon => {
    const androidSource = androidIcons[name];
    if (Platform.OS === 'android' && androidSource) {
      return { type: 'image', source: androidSource };
    }
    return { type: 'sfSymbol', name: focused ? ICONS[name].sfFocused : ICONS[name].sf };
  };
}

export function AppTabs() {
  const { colors } = useTheme();
  const androidIcons = useAndroidIcons();

  // Wait for Android icon images so the tab bar doesn't render without icons.
  if (!androidIcons) return null;

  return (
    <Tab.Navigator
      screenOptions={{
        // Screens render their own AppHeader (logo, title, actions).
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio', tabBarIcon: tabIcon('Home', androidIcons) }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: 'Estadísticas', tabBarIcon: tabIcon('Stats', androidIcons) }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{ title: 'Asistente IA', tabBarIcon: tabIcon('Assistant', androidIcons) }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes', tabBarIcon: tabIcon('Settings', androidIcons) }}
      />
    </Tab.Navigator>
  );
}
