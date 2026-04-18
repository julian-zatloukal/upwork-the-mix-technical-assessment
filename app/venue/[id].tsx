import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PRIMARY } from '../../constants/theme';
import { getVenueById } from '../../src/data/venues';
import { useCheckIn } from '../../src/hooks/useCheckIn';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const venueId = typeof id === 'string' ? id : null;
  const venue = venueId ? getVenueById(venueId) : undefined;

  const { isCheckingIn, isCheckedIn, isLoadingStatus, error, toggleCheckIn } =
    useCheckIn(venueId);

  if (!venue) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centeredMessage}>
          <Text style={styles.errorText}>Venue not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={venue.image} style={styles.coverImage}>
          <View style={[styles.headerOverlay, { paddingTop: Math.max(insets.top, 16) }]}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.title}>{venue.name}</Text>
          <Text style={styles.subtitle}>{venue.subtitle}</Text>
          <Text style={styles.description}>{venue.description}</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [
              styles.checkInButton,
              pressed && !isLoadingStatus && styles.checkInButtonPressed,
              (isCheckingIn || isLoadingStatus) && styles.checkInButtonDisabled,
            ]}
            onPress={toggleCheckIn}
            disabled={isCheckingIn || isLoadingStatus}
          >
            {isCheckingIn || isLoadingStatus ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.checkInButtonText}>
                {isCheckedIn ? 'Checked In ✓' : 'Check In'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centeredMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 350,
    justifyContent: 'flex-start',
  },
  headerOverlay: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  checkInButton: {
    backgroundColor: PRIMARY,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  checkInButtonPressed: {
    opacity: 0.8,
  },
  checkInButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkInButtonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});
