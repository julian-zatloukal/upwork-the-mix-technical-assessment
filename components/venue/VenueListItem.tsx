import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Venue } from '../../src/types/venue';

interface VenueListItemProps {
  venue: Venue;
  onPress: (id: string) => void;
}

/**
 * A single card in the venue list.
 * Renders the venue image with a gradient-style overlay and name / subtitle.
 */
export const VenueListItem: React.FC<VenueListItemProps> = ({ venue, onPress }) => (
  <Pressable style={styles.container} onPress={() => onPress(venue.id)}>
    <ImageBackground
      source={venue.image}
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
        <Text style={styles.name}>{venue.name}</Text>
        <Text style={styles.subtitle}>{venue.subtitle}</Text>
      </View>
    </ImageBackground>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  name: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#dddddd',
    fontSize: 16,
  },
});
