import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { AppTabs } from './src/navigation/AppTabs';
import { AuthScreen } from './src/screens/AuthScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Root />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});
