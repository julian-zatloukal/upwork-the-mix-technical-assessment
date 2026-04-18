import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react-native';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </Authenticator.Provider>
  );
}
