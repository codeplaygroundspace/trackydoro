'use client';

import { useCallback, useEffect } from 'react';

import { useStore } from '@/store/useStore';

import { useAuthSync } from './useAuthSync';

/**
 * Main cloud sync hook
 * Orchestrates all cloud sync functionality automatically
 * Handles auth state change → cloud data migration → cloud sync
 */
export function useCloudSync() {
  const { user, isAuthLoading, isAuthenticated, isCloudSynced } = useAuthSync();

  // Get sync methods from store
  const { syncToCloud, loadFromCloud } = useStore();

  // Auto-sync on successful authentication change
  const handleSync = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    console.log('🔄 Cloud sync check for user:', user.uid);
    if (!isCloudSynced) {
      console.log('📱 Loading cloud data on auth change');
      await loadFromCloud(user.uid);
    }
  }, [user, isAuthenticated, isCloudSynced, loadFromCloud]);

  useEffect(() => {
    handleSync();
  }, [handleSync]);

  // Periodic analytics sync for batch optimization
  useEffect(() => {
    if (!isAuthenticated || !isCloudSynced) return;

    // Every 30 seconds, sync if authenticated
    const intervalId = setInterval(async () => {
      try {
        await syncToCloud();
      } catch (error) {
        // Silent failure - don't interrupt user workflow
        console.warn('Background sync failed:', error);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, isCloudSynced, syncToCloud]);

  return {
    isAuthenticated,
    isAuthLoading,
    isCloudSynced,
    user,
    onManualSync: syncToCloud,
  };
}
