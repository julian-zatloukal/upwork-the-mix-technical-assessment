import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { AuthColors } from '../../constants/theme';
import { SIGN_IN_ROUTES } from '../../src/config/amplify-theme';

/**
 * Always mounted inside `<Authenticator.Provider>`, so `isPending` fires
 * during sign-in / sign-up — unlike children of `<Authenticator>` which only
 * render once the user is already authenticated.
 *
 * A safety-hatch timer auto-hides the overlay after 8 s in case the Amplify
 * state machine gets stuck (e.g., during Expo fast-refresh or a network hang).
 */
export const GlobalAuthLoadingOverlay: React.FC = () => {
  const { isPending, route } = useAuthenticator();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shouldShow = isPending && SIGN_IN_ROUTES.has(route);

    if (shouldShow) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 8_000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isPending, route]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={AuthColors.brand} />
          <Text style={styles.label}>Signing in…</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    gap: 14,
  },
  label: {
    color: AuthColors.fontSecondary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
