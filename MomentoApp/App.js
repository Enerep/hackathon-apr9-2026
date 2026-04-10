import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/useAuth';
import { AppStateProvider } from './src/hooks/useAppState';
import { ToastProvider } from './src/components/Toast';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <AppStateProvider>
            <ToastProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </ToastProvider>
          </AppStateProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
