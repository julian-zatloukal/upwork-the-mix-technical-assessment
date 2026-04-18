import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PRIMARY } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCheckIn = () => {
    console.log(`Checking into venue: ${id}`);
    alert(`Checked into venue: ${id}`);
  };

  // Hardcoded for now based on the requested detail
  const venueDetail = {
    name: 'Cozy Bar',
    subtitle: 'Intimate ambiance & craft cocktails',
    description: 'A hidden gem featuring dim lighting, plush seating, and an expansive menu of artisanal cocktails perfect for unwinding.',
    image: require('../../assets/images/cozy_bar.jpg'),
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={venueDetail.image} style={styles.coverImage}>
          <View style={[styles.headerOverlay, { paddingTop: Math.max(insets.top, 16) }]}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.title}>{venueDetail.name}</Text>
          <Text style={styles.subtitle}>{venueDetail.subtitle}</Text>
          <Text style={styles.description}>{venueDetail.description}</Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.checkInButton,
              pressed && styles.checkInButtonPressed,
            ]}
            onPress={handleCheckIn}
          >
            <Text style={styles.checkInButtonText}>Check In</Text>
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
    paddingVertical: 16,
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
});
