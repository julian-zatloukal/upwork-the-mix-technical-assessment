import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { PRIMARY } from '../../constants/theme';

/**
 * A pressable button that calls Amplify's `signOut` action.
 * Must be rendered inside an `<Authenticator.Provider>`.
 */
export const SignOutButton: React.FC = () => {
  const { signOut } = useAuthenticator();

  return (
    <Pressable
      onPress={signOut}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>Sign Out</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
