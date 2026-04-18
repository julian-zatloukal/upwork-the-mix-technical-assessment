import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
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
