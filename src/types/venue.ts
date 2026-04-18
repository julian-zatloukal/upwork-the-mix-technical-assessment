import type { ImageSourcePropType } from 'react-native';

/**
 * Represents a single venue entry used throughout the app.
 * The `image` field accepts any value React Native's Image / ImageBackground
 * components accept: a `require()` result, a URI object, or a number.
 */
export interface Venue {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  category: string;
  description: string;
  image: ImageSourcePropType;
}
