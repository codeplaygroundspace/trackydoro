'use client';

import { ReactNode } from 'react';

import { useCloudSync } from '@/hooks/useCloudSync';

interface CloudSyncProviderProps {
  children: ReactNode;
}

/**
 * CloudSyncProvider component that initializes cloud sync functionality at the app level.
 * This ensures that authentication state monitoring and cloud data loading happens
 * immediately when the app starts, regardless of user interaction with UI components.
 *
 * This component should be placed at the root level of the application to guarantee
 * that cloud sync is active from app initialization.
 */
export const CloudSyncProvider = ({ children }: CloudSyncProviderProps) => {
  // Initialize cloud sync hooks at app level
  // This will monitor Firebase auth state changes and automatically load user data
  useCloudSync();

  // Simply render children - the hook initialization is the main purpose
  return <>{children}</>;
};
