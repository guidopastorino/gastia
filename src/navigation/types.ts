import type { NavigatorScreenParams } from '@react-navigation/native';

export type AppTabsParamList = {
  Home: undefined;
  Stats: undefined;
  Assistant: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<AppTabsParamList>;
  Profile: undefined;
};
