'use client';

import { useEffect } from 'react';

import { useStore } from '@/store/useStore';

/**
 * Custom hook to handle the initial app loading simulation
 * Consolidates the loading pattern used across pages
 */
export const useAppLoading = (delay: number = 300) => {
  const isLoading = useStore((state) => state.isLoading);
  const setLoading = useStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [setLoading, delay]);

  return isLoading;
};
