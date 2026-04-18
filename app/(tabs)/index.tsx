import React from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { PRIMARY } from '../../constants/theme';

const VENUES = [
  {
    id: 'venue_123',
    name: 'Cozy Bar',
    subtitle: 'Intimate ambiance & craft cocktails',
    address: '123 Main St, San Antonio',
    category: 'Bar',
    description: 'A hidden gem featuring dim lighting, plush seating, and an expansive menu of artisanal cocktails perfect for unwinding.',
    image: require('../../assets/images/cozy_bar.jpg'),
  },
];

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <Pressable
      onPress={signOut}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>Sign Out</Text>
    </Pressable>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => router.push(`/venue/${item.id}`)}
    >
      <ImageBackground
        source={item.image}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>
      </ImageBackground>
    </Pressable>
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemContainer: {
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
  itemName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemSubtitle: {
    color: '#dddddd',
    fontSize: 16,
  },
});
