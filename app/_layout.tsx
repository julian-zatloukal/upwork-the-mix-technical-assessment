import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  ThemeProvider as AmplifyThemeProvider,
} from '@aws-amplify/ui-react-native';

import outputs from '../amplify_outputs.json';
import { amplifyDarkTheme } from '../src/config/amplify-theme';
import { GlobalAuthLoadingOverlay } from '../components/auth/GlobalAuthLoadingOverlay';

Amplify.configure(outputs);

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
