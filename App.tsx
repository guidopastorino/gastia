import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { AppTabs } from './src/navigation/AppTabs';
import { AuthScreen } from './src/screens/AuthScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Root />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { session, loading } = useAuth();
  const { scheme, colors } = useTheme();

  const navigationTheme = useMemo<Theme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.separator,
      },
    };
  }, [scheme, colors]);

  let content;
  if (loading) {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.textSecondary} />
      </View>
    );
  } else if (!session) {
    content = <AuthScreen />;
  } else {
    content = (
      <NavigationContainer theme={navigationTheme}>
        <AppTabs />
      </NavigationContainer>
    );
  }

  return (
    <>
      {content}
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
