import React, { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Authenticator } from '@aws-amplify/ui-react-native';

import { VENUES } from '../../src/data/venues';
import type { Venue } from '../../src/types/venue';
import { SignOutButton } from '../../components/auth/SignOutButton';
import { VenueListItem } from '../../components/venue/VenueListItem';

/** Minimum time (ms) between successive navigation pushes. */
const NAV_DEBOUNCE_MS = 800;

export default function HomeScreen() {
  const router = useRouter();
  const isNavigating = useRef(false);

  const handleVenuePress = (id: string) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    router.push(`/venue/${id}`);
    // Reset after the debounce window so back-navigation re-enables tapping.
    setTimeout(() => {
      isNavigating.current = false;
    }, NAV_DEBOUNCE_MS);
  };

  const renderItem = ({ item }: { item: Venue }) => (
    <VenueListItem venue={item} onPress={handleVenuePress} />
  );

  return (
    <Authenticator>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navTitle}>My reservations</Text>
          <SignOutButton />
        </View>
        <FlatList
          data={VENUES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </Authenticator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navBar: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  navTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
