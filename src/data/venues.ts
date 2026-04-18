import type { Venue } from '../types/venue';

/**
 * Static venue data.
 *
 * In the future this could be fetched from the Amplify backend or a remote
 * API; keeping it here isolates every screen from the data source.
 */
export const VENUES: Venue[] = [
  {
    id: 'venue_123',
    name: 'Cozy Bar',
    subtitle: 'Intimate ambiance & craft cocktails',
    address: '123 Main St, San Antonio',
    category: 'Bar',
    description:
      'A hidden gem featuring dim lighting, plush seating, and an expansive menu of artisanal cocktails perfect for unwinding.',
    image: require('../../assets/images/cozy_bar.jpg'),
  },
];

/**
 * Look up a single venue by its ID.
 * Returns `undefined` if no match is found.
 */
export function getVenueById(id: string): Venue | undefined {
  return VENUES.find((v) => v.id === id);
}
