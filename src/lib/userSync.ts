'use client';

import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

import type { Category, CategoryData } from '@/types';

import { auth, db } from './firebase';

/**
 * User sync interface for Firebase cloud persistence
 * Implements auto-merge strategy with timestamp-based conflict resolution
 */
export interface UserProjects {
  categories: Category[];
  categoryData: CategoryData[];
  syncedAt: Timestamp;
}

/**
 * Sync user projects to Firebase cloud storage
 * Auto-saves via separate CloudSync handlers for new/most recent changes
 */
export async function saveUserProjectsToCloud(
  userId: string,
  storeData: {
    categories: Category[];
    categoryData: CategoryData[];
    selectedCategory: string;
    pomodoroCount: number;
  },
): Promise<void> {
  if (!db) {
    console.warn('Firestore not initialized');
    return;
  }

  try {
    const userDocRef = doc(db, 'userProjects', userId);

    const userProjects: UserProjects = {
      categories: storeData.categories,
      categoryData: storeData.categoryData,
      syncedAt: Timestamp.now(),
    };

    await setDoc(userDocRef, userProjects, { merge: true });
    console.log(`✅ Projects synced to cloud for user: ${userId}`);
  } catch (error) {
    console.error('❌ Error syncing to cloud:', error);
    throw new Error('Cloud sync failed, data saved locally only');
  }
}

/**
 * Load user projects from Firebase cloud storage
 * Returns null if no cloud data exists (new user scenario)
 */
export async function loadUserProjectsFromCloud(userId: string): Promise<UserProjects | null> {
  if (!db) {
    console.warn('Firestore not initialized');
    return null;
  }

  try {
    const userDocRef = doc(db, 'userProjects', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const cloudData = userDocSnap.data() as UserProjects;
      console.log(`✅ Projects loaded from cloud for user: ${userId}`);
      return cloudData;
    }

    console.log(`📄 No cloud data exists for user: ${userId}`);
    return null;
  } catch (error) {
    console.error('❌ Error loading from cloud:', error);
    return null;
  }
}

/**
 * Smart merge strategy for cloud vs local data
 * Implements timestamp-based conflict resolution (latest changes win)
 */
export function mergeLocalWithCloud(
  localData: {
    categories: Category[];
    categoryData: CategoryData[];
  },
  cloudData: UserProjects,
): {
  categories: Category[];
  categoryData: CategoryData[];
} {
  // If cloud is newer, prioritize cloud data
  const cloudSyncedAt = cloudData.syncedAt?.toDate() || new Date(0);
  const localSyncedAt = localStorage.getItem('local-data-timestamp')
    ? new Date(localStorage.getItem('local-data-timestamp')!)
    : new Date(0);

  if (cloudSyncedAt >= localSyncedAt) {
    console.log('📱 Using cloud data (newer)');
    return {
      categories: cloudData.categories,
      categoryData: cloudData.categoryData,
    };
  }

  // Local is newer, but we still want to preserve cloud analytics
  console.log('💻 Using local data (newer), merging cloud analytics');

  // Merge analytics data - combine days data from both sources
  const mergedCategoryData: CategoryData[] = [];

  // Process all local categories first
  localData.categories.forEach((localCategory) => {
    const localAnalytics = localData.categoryData.find((cd) => cd.categoryId === localCategory.id);
    const cloudAnalytics = cloudData.categoryData.find((cd) => cd.categoryId === localCategory.id);

    if (localAnalytics && cloudAnalytics) {
      // Merge days data, taking most recent entries
      const combinedDays = [...(localAnalytics.days || []), ...(cloudAnalytics.days || [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      // Remove duplicated days (keep most recent)
      const uniqueDays = combinedDays.filter(
        (day, index, arr) => index === arr.findIndex((d) => d.date === day.date),
      );

      mergedCategoryData.push({
        categoryId: localCategory.id,
        days: uniqueDays,
      });
    } else {
      mergedCategoryData.push(
        localAnalytics ||
          cloudAnalytics || {
            categoryId: localCategory.id,
            days: [],
          },
      );
    }
  });

  // Add any cloud categories not in local
  cloudData.categories.forEach((cloudCategory) => {
    if (!localData.categories.find((lc) => lc.id === cloudCategory.id)) {
      const cloudAnalytics = cloudData.categoryData.find(
        (cd) => cd.categoryId === cloudCategory.id,
      );
      mergedCategoryData.push(
        cloudAnalytics || {
          categoryId: cloudCategory.id,
          days: [],
        },
      );
    }
  });

  return {
    categories: localData.categories,
    categoryData: mergedCategoryData,
  };
}

/**
 * Upgrade legacy migration with background localStorage timestamp
 * Indicates last local sync time and for clean timestamps
 */
export function markLocalDataTimestamp(): void {
  localStorage.setItem('local-data-timestamp', new Date().toISOString());
}

/**
 * Clear cloud data timestamp (used for complete rebuild migration)
 */
export function clearCloudDataTimestamp(): void {
  localStorage.removeItem('local-data-timestamp');
}
