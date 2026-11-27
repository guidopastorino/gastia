import Ionicons from '@expo/vector-icons/Ionicons';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabIcon,
} from '@react-navigation/bottom-tabs/unstable';
import { useEffect, useState, type ComponentProps } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../theme/ThemeProvider';

export type AppTabsParamList = {
  Home: undefined;
  Settings: undefined;
};

type TabName = keyof AppTabsParamList;
type IoniconName = ComponentProps<typeof Ionicons>['name'];
type SFSymbol = Extract<NativeBottomTabIcon, { type: 'sfSymbol' }>['name'];

// iOS uses SF Symbols (native look, Liquid Glass on iOS 26+).
// Android has no SF Symbols, so Ionicons are rendered to images and tinted natively.
const ICONS: Record<TabName, { sf: SFSymbol; sfFocused: SFSymbol; android: IoniconName }> = {
  Home: { sf: 'house', sfFocused: 'house.fill', android: 'home' },
  Settings: { sf: 'gearshape', sfFocused: 'gearshape.fill', android: 'settings' },
};

const Tab = createNativeBottomTabNavigator<AppTabsParamList>();

function useAndroidIcons() {
  const [icons, setIcons] = useState<Partial<Record<TabName, ImageSourcePropType>> | null>(
    Platform.OS === 'android' ? null : {},
  );

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const names = Object.keys(ICONS) as TabName[];
    Promise.all(names.map((name) => Ionicons.getImageSource(ICONS[name].android, 24, 'black'))).then(
      (sources) => {
        const loaded: Partial<Record<TabName, ImageSourcePropType>> = {};
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

function tabIcon(
  name: TabName,
  androidIcons: Partial<Record<TabName, ImageSourcePropType>>,
): ({ focused }: { focused: boolean }) => NativeBottomTabIcon {
  return ({ focused }) => {
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
        headerShown: true,
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
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes', tabBarIcon: tabIcon('Settings', androidIcons) }}
      />
    </Tab.Navigator>
  );
}
