import { useState, useEffect } from 'react';
import {
  fetchCheckInStatus,
  createCheckIn,
  deleteCheckIn,
} from '../services/checkin.service';

interface UseCheckInState {
  /** Whether a check-in or check-out mutation is in flight. */
  isCheckingIn: boolean;
  /** True once the user is confirmed checked in at this venue. */
  isCheckedIn: boolean;
  /** True while the initial status query is loading. */
  isLoadingStatus: boolean;
  /** Non-null when the last toggle operation failed. */
  error: string | null;
  /** Triggers check-in if not checked in, or check-out if already checked in. */
  toggleCheckIn: () => Promise<void>;
}

/**
 * Manages check-in state for a single venue.
 *
 * - Fetches the current check-in status on mount.
 * - Exposes `toggleCheckIn` to create or delete the check-in record.
 * - All Amplify calls are delegated to `checkin.service.ts`.
 *
 * @param venueId The venue to track. Pass `null` / `undefined` to skip
 *   loading (e.g., while the route param is still resolving).
 */
export function useCheckIn(venueId: string | null | undefined): UseCheckInState {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentCheckInId, setCurrentCheckInId] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial check-in status whenever the venueId changes.
  useEffect(() => {
    if (!venueId) {
      setIsLoadingStatus(false);
      return;
    }

    let cancelled = false;
    setIsLoadingStatus(true);

    fetchCheckInStatus(venueId)
      .then(({ isCheckedIn: checked, checkInId }) => {
        if (cancelled) return;
        setIsCheckedIn(checked);
        setCurrentCheckInId(checkInId);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to fetch check-in status:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingStatus(false);
      });

    return () => {
      cancelled = true;
    };
  }, [venueId]);

  const toggleCheckIn = async () => {
    if (!venueId) return;

    setIsCheckingIn(true);
    setError(null);

    try {
      if (isCheckedIn && currentCheckInId) {
        // Development purpose: un-check-in
        await deleteCheckIn(currentCheckInId);
        setIsCheckedIn(false);
        setCurrentCheckInId(null);
      } else {
        const newId = await createCheckIn(venueId);
        setCurrentCheckInId(newId);
        setIsCheckedIn(true);
      }
    } catch (err: any) {
      console.error('Error toggling check-in status:', err);
      setError(err.message || 'Failed to update check-in status. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return { isCheckingIn, isCheckedIn, isLoadingStatus, error, toggleCheckIn };
}
