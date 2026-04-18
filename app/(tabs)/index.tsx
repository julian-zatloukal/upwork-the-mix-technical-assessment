import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { PRIMARY, PRIMARY_DARK } from '../../constants/theme';

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Pressable
        onPress={signOut}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <Authenticator>
      <SafeAreaView style={styles.container}>
        <SignOutButton />
        <View style={styles.content}>
          <Text style={styles.title}>The Mix</Text>
        </View>
      </SafeAreaView>
    </Authenticator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 8,
  },
  signOutButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
  },
});
