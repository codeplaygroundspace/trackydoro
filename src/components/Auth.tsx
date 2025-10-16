'use client';

import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';

import { MagicLinkSignIn } from './MagicLinkSignIn';

export function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get cloud sync status from store (managed by CloudSyncProvider)
  const isCloudSynced = useStore((state) => state.isCloudSynced);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (isLoading) {
    return <div className="w-24 h-8 bg-muted rounded-lg animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Hi, {user.email}</span>
        {isCloudSynced && <span className="text-xs text-green-500">✨ Synced</span>}
        <button
          onClick={handleSignOut}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // When logged out, only show the MagicLinkSignIn component
  return <MagicLinkSignIn />;
}
