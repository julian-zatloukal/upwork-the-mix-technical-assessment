import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  ThemeProvider as AmplifyThemeProvider,
  defaultDarkModeOverride,
  useAuthenticator,
} from '@aws-amplify/ui-react-native';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const amplifyDarkTheme = {
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: 'dark' as const,
      tokens: {
        colors: {
          background: {
            primary: { value: '#0a0a0a' },
            secondary: { value: '#111111' },
            tertiary: { value: '#1a1a1a' },
          },
          font: {
            primary: { value: '#ffffff' },
            secondary: { value: '#e0e0e0' },
            tertiary: { value: '#a0a0a0' },
          },
          border: {
            primary: { value: '#333333' },
            secondary: { value: '#222222' },
          },
        },
      },
    },
  ],
};

/**
 * Always mounted inside Authenticator.Provider, so isPending fires
 * during sign-in/sign-up — unlike children of <Authenticator> which
 * only render once the user is already authenticated.
 */
// Auth routes where a pending state means a sign-in/sign-up action is in flight.
// When signing out, route is 'authenticated', so we explicitly exclude it.
const SIGN_IN_ROUTES = new Set([
  'signIn',
  'signUp',
  'confirmSignIn',
  'confirmSignUp',
  'forceNewPassword',
  'resetPassword',
  'confirmResetPassword',
  'setupTotp',
  'verifyUser',
  'confirmVerifyUser',
]);

const GlobalAuthLoadingOverlay = () => {
  const { isPending, route } = useAuthenticator();
  const visible = isPending && SIGN_IN_ROUTES.has(route);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={overlayStyles.backdrop}>
        <View style={overlayStyles.card}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={overlayStyles.label}>Signing in…</Text>
        </View>
      </View>
    </Modal>
  );
};

const overlayStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  label: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AmplifyThemeProvider theme={amplifyDarkTheme} colorMode="dark">
      <Authenticator.Provider>
        <GlobalAuthLoadingOverlay />
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </Authenticator.Provider>
    </AmplifyThemeProvider>
  );
}
