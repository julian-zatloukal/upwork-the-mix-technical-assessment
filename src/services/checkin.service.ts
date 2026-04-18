import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

/**
 * Result shape returned by {@link fetchCheckInStatus}.
 */
export interface CheckInStatus {
  isCheckedIn: boolean;
}

/**
 * Fetches the current user's check-in status for the given venue.
 * Returns `{ isCheckedIn: false }` if the user has not
 * checked in, or `{ isCheckedIn: true }` when they have.
 *
 * @throws When the Amplify query fails.
 */
export async function fetchCheckInStatus(venueId: string): Promise<CheckInStatus> {
  const { userId } = await getCurrentUser();

  const { data: checkIn, errors } = await client.models.CheckIn.get({ userId, venueId });

  if (errors) {
    console.error('Error fetching check-in status:', errors);
  }

  if (checkIn) {
    return { isCheckedIn: true };
  }
  return { isCheckedIn: false };
}

/**
 * Creates a new check-in record for the current user at the given venue.
 *
 * @throws When the Amplify mutation fails.
 */
export async function createCheckIn(venueId: string): Promise<void> {
  const { userId } = await getCurrentUser();

  const { errors, data } = await client.models.CheckIn.create({
    userId,
    venueId,
    timestamp: new Date().toISOString(),
  });

  if (errors) {
    const errorMsg = errors[0].message;
    // Handle duplicate check-ins which will fail the unique constraint
    if (errorMsg.includes('conditional') || errorMsg.includes('already exists')) {
      throw new Error('You have already checked in to this venue.');
    }
    throw new Error(errorMsg);
  }
  if (!data) throw new Error('No data returned from CheckIn.create');
}

/**
 * Deletes an existing check-in record by venueId.
 *
 * @throws When the Amplify mutation fails.
 */
export async function deleteCheckIn(venueId: string): Promise<void> {
  const { userId } = await getCurrentUser();
  const { errors } = await client.models.CheckIn.delete({ userId, venueId });
  if (errors) throw new Error(errors[0].message);
}
