import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { AuthScreen } from './src/features/auth/AuthScreen';
import { SubscriptionProvider } from './src/features/subscription/SubscriptionProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { fontAssets, fonts } from './src/theme/typography';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  // Render nothing until fonts are ready so text never flashes in the system font.
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Root />
          </SubscriptionProvider>
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
        card: colors.background,
        text: colors.text,
        border: colors.separator,
      },
      fonts: {
        regular: { fontFamily: fonts.regular, fontWeight: '400' },
        medium: { fontFamily: fonts.medium, fontWeight: '500' },
        bold: { fontFamily: fonts.semibold, fontWeight: '600' },
        heavy: { fontFamily: fonts.bold, fontWeight: '700' },
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
        <RootNavigator />
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
