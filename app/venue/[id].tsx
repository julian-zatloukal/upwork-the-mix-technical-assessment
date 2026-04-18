import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PRIMARY } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentCheckInId, setCurrentCheckInId] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckInStatus = async () => {
      if (!id || typeof id !== 'string') {
        setIsLoadingStatus(false);
        return;
      }
      
      try {
        const { userId } = await getCurrentUser();
        
        const { data: checkIns } = await client.models.CheckIn.list({
          filter: {
            and: [
              { userId: { eq: userId } },
              { venueId: { eq: id } }
            ]
          }
        });
        
        if (checkIns && checkIns.length > 0) {
          setIsCheckedIn(true);
          setCurrentCheckInId(checkIns[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch check-in status:', err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    
    fetchCheckInStatus();
  }, [id]);

  const handleToggleCheckIn = async () => {
    if (!id || typeof id !== 'string') return;

    setIsCheckingIn(true);
    setError(null);

    try {
      if (isCheckedIn && currentCheckInId) {
        // Development purpose: uncheck in
        const { errors } = await client.models.CheckIn.delete({
          id: currentCheckInId,
        });

        if (errors) {
          throw new Error(errors[0].message);
        }

        setIsCheckedIn(false);
        setCurrentCheckInId(null);
      } else {
        // Regular check in
        const { userId } = await getCurrentUser();
        
        const { errors, data } = await client.models.CheckIn.create({
          userId,
          venueId: id,
          timestamp: new Date().toISOString(),
        });
        
        if (errors) {
          throw new Error(errors[0].message);
        }
        
        if (data) {
          setCurrentCheckInId(data.id);
        }
        setIsCheckedIn(true);
      }
    } catch (err: any) {
      console.error('Error toggling check-in status:', err);
      setError(err.message || 'Failed to update check-in status. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
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
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Pressable
            style={({ pressed }) => [
              styles.checkInButton,
              pressed && !isLoadingStatus && styles.checkInButtonPressed,
              (isCheckingIn || isLoadingStatus) && styles.checkInButtonDisabled,
            ]}
            onPress={handleToggleCheckIn}
            disabled={isCheckingIn || isLoadingStatus}
          >
            {(isCheckingIn || isLoadingStatus) ? (
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
