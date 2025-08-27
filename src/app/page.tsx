'use client';

import { useCallback, useState } from 'react';

import { AppLayout } from '@/components/layouts';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { TimerSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppLoading } from '@/hooks';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/store/useStore';

export default function Home() {
  // Get state and actions from Zustand store
  const categories = useStore((state) => state.categories);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const recordPomodoro = useStore((state) => state.recordPomodoro);

  // Use consolidated loading hook
  const isLoading = useAppLoading();

  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handlePomodoroComplete = (categoryId: string) => {
    recordPomodoro(categoryId);
  };

  const { modifierKey } = useGlobalKeyboardShortcuts();

  // Handle category navigation with arrow keys
  const handleCategoryNavigation = useCallback(
    (direction: 'up' | 'down') => {
      if (categories.length === 0) return;

      const currentIndex = categories.findIndex((cat) => cat.id === selectedCategory);
      let newIndex: number;

      if (direction === 'up') {
        newIndex = currentIndex <= 0 ? categories.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex >= categories.length - 1 ? 0 : currentIndex + 1;
      }

      setSelectedCategory(categories[newIndex].id);
    },
    [categories, selectedCategory, setSelectedCategory],
  );

  // Keyboard shortcuts for timer
  useKeyboardShortcuts(
    [
      {
        key: 'ArrowUp',
        handler: () => handleCategoryNavigation('up'),
      },
      {
        key: 'ArrowDown',
        handler: () => handleCategoryNavigation('down'),
      },
      {
        key: '?',
        handler: () => setShowKeyboardShortcuts(true),
      },
      {
        key: 's',
        handler: () => setShowSettings(true),
      },
      // Number keys for quick category selection
      ...Array.from({ length: 9 }, (_, i) => ({
        key: String(i + 1),
        handler: () => {
          if (categories[i]) {
            setSelectedCategory(categories[i].id);
          }
        },
      })),
    ],
    !isLoading,
  );

  return (
    <AppLayout
      showFooter={!isLoading}
      onKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
      onSettings={() => setShowSettings(true)}
      isHomePage={true}
    >
      {/* Timer section - calculated height excluding header and footer */}
      <div
        className="flex items-center justify-center"
        style={{
          minHeight: 'calc(100vh - 8rem - 3rem)', // Header: ~8rem, Footer: ~3rem
        }}
      >
        {isLoading ? (
          <TimerSkeleton />
        ) : (
          <PomodoroTimer
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onPomodoroComplete={handlePomodoroComplete}
          />
        )}
      </div>
    </AppLayout>
  );
}
