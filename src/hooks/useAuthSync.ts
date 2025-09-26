'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';

/**
 * Authentication sync hook
 * Handles automatic data migration on Firebase authentication state changes
 * Implements the user story: Device switching triggers seamless cloud migration
 */
export function useAuthSync() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { loadFromCloud, syncToCloud, isCloudSynced } = useStore();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);

      // User logged in - migration logic
      if (currentUser && currentUser !== user) {
        console.log('🔄 Auth state changed: ', isCloudSynced ? 'Already synced' : 'Needs sync');

        if (!isCloudSynced) {
          // Auto-load cloud data (migrates existing local + cloud)
          await loadFromCloud(currentUser.uid);
        }
      }

      // User logged out - no longer cloud-synced
      if (!currentUser && user !== null) {
        console.log('👋 User logged out');
      }

      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, loadFromCloud, isCloudSynced]);

  // Trigger cloud save before page unload/logout if authenticated
  useEffect(() => {
    if (!user) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Trigger background sync before leaving
      syncToCloud();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, syncToCloud]);

  return {
    user,
    isAuthLoading: isLoading,
    isCloudSynced,
    isAuthenticated: !!user,
  };
}
