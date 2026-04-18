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
import { useEffect, useState } from 'react';
import outputs from '../amplify_outputs.json';
import { AuthColors, PRIMARY_SCALE } from '../constants/theme';

Amplify.configure(outputs);

const amplifyDarkTheme = {
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: 'dark' as const,
      tokens: {
        colors: {
          // Override the full primary scale — this is what Amplify's buttons,
          // links, and focus rings actually reference (primary.80 / .90 / .100).
          primary: {
            10:  { value: PRIMARY_SCALE[10] },
            20:  { value: PRIMARY_SCALE[20] },
            40:  { value: PRIMARY_SCALE[40] },
            60:  { value: PRIMARY_SCALE[60] },
            80:  { value: PRIMARY_SCALE[80] },
            90:  { value: PRIMARY_SCALE[90] },
            100: { value: PRIMARY_SCALE[100] },
          },
          background: {
            primary:   { value: AuthColors.bgPrimary },
            secondary: { value: AuthColors.bgSecondary },
            tertiary:  { value: AuthColors.bgTertiary },
          },
          font: {
            primary:   { value: AuthColors.fontPrimary },
            secondary: { value: AuthColors.fontSecondary },
            tertiary:  { value: AuthColors.fontTertiary },
          },
          border: {
            primary:   { value: AuthColors.borderPrimary },
            secondary: { value: AuthColors.borderSecondary },
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shouldShow = isPending && SIGN_IN_ROUTES.has(route);
    
    if (shouldShow) {
      setVisible(true);
      // SAFETY HATCH: If the Amplify state machine gets stuck (e.g. during Expo 
      // fast refresh or network hang), auto-hide the overlay after 8 seconds 
      // so the app doesn't become permanently frozen.
      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isPending, route]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={overlayStyles.backdrop}>
        <View style={overlayStyles.card}>
          <ActivityIndicator size="large" color={AuthColors.brand} />
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
    backgroundColor: AuthColors.overlayCard,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: AuthColors.overlayBorder,
    shadowColor: AuthColors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  label: {
    color: AuthColors.fontSecondary,
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
