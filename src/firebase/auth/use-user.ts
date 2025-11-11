
'use client';

import { useContext } from 'react';
import { User } from 'firebase/auth';
import { FirebaseContext, FirebaseContextState } from '@/firebase/provider';

// Return type for useUser() - specific to user auth state
export interface UserHookResult {
  user: User | null;
  isLoading: boolean; // Renamed for consistency
  error: Error | null; // Renamed for consistency
}

/**
 * Hook to access just the user authentication state.
 * This is a lightweight hook for components that only need user info.
 */
export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }

  return {
    user: context.user,
    isLoading: context.isUserLoading,
    error: context.userError,
  };
};
