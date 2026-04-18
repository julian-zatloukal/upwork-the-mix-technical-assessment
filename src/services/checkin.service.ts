import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

/**
 * Result shape returned by {@link fetchCheckInStatus}.
 */
export interface CheckInStatus {
  isCheckedIn: boolean;
  checkInId: string | null;
}

/**
 * Fetches the current user's check-in status for the given venue.
 * Returns `{ isCheckedIn: false, checkInId: null }` if the user has not
 * checked in, or `{ isCheckedIn: true, checkInId }` when they have.
 *
 * @throws When the Amplify query fails.
 */
export async function fetchCheckInStatus(venueId: string): Promise<CheckInStatus> {
  const { userId } = await getCurrentUser();

  const { data: checkIns } = await client.models.CheckIn.list({
    filter: {
      and: [{ userId: { eq: userId } }, { venueId: { eq: venueId } }],
    },
  });

  if (checkIns && checkIns.length > 0) {
    return { isCheckedIn: true, checkInId: checkIns[0].id };
  }
  return { isCheckedIn: false, checkInId: null };
}

/**
 * Creates a new check-in record for the current user at the given venue.
 *
 * @returns The id of the newly created check-in.
 * @throws When the Amplify mutation fails.
 */
export async function createCheckIn(venueId: string): Promise<string> {
  const { userId } = await getCurrentUser();

  const { errors, data } = await client.models.CheckIn.create({
    userId,
    venueId,
    timestamp: new Date().toISOString(),
  });

  if (errors) throw new Error(errors[0].message);
  if (!data) throw new Error('No data returned from CheckIn.create');
  return data.id;
}

/**
 * Deletes an existing check-in record by its id.
 *
 * @throws When the Amplify mutation fails.
 */
export async function deleteCheckIn(checkInId: string): Promise<void> {
  const { errors } = await client.models.CheckIn.delete({ id: checkInId });
  if (errors) throw new Error(errors[0].message);
}
