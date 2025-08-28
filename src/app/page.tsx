'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { AnalyticsIcon, GearIcon, OutlineKeyboard } from '@/components/icons';
import { AppLayout } from '@/components/layouts';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { TimerSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppLoading } from '@/hooks';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/store/useStore';
import { TimerState } from '@/types';

export default function Home() {
  const router = useRouter();

  // Get state and actions from Zustand store
  const categories = useStore((state) => state.categories);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const recordPomodoro = useStore((state) => state.recordPomodoro);

  // Use consolidated loading hook
  const isLoading = useAppLoading();

  // State to track timer status from the PomodoroTimer component
  const [currentTimerState, setCurrentTimerState] = useState<TimerState>('idle');

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
      showFooter={false}
      onKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
      onSettings={() => setShowSettings(true)}
      showKeyboardShortcutsModal={showKeyboardShortcuts}
      showSettingsModal={showSettings}
      onCloseKeyboardShortcuts={() => setShowKeyboardShortcuts(false)}
      onCloseSettings={() => setShowSettings(false)}
      isHomePage={true}
    >
      {/* Timer section - calculated height excluding header */}
      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center w-full"
          style={{
            minHeight: 'calc(100vh - 8rem - 5rem)',
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
              onTimerStateChange={setCurrentTimerState}
            />
          )}
        </div>

        {currentTimerState !== 'running' && (
          <div className="fixed bottom-0 left-0 right-0 z-10 py-6 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex justify-center">
              <div className="flex items-center gap-3 bg-card/30 backdrop-blur-sm p-3 rounded-full shadow-lg">
                <button
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="hidden sm:flex bg-card hover:bg-card/70 p-3 rounded-full transition-all duration-200 cursor-pointer"
                  aria-label="View keyboard shortcuts (Press ? key)"
                  title="Keyboard shortcuts (?)"
                >
                  <OutlineKeyboard className="w-5 h-5 text-primary" />
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-card hover:bg-card/70 p-3 rounded-full transition-all duration-200 cursor-pointer"
                  aria-label="Open settings"
                  title="Settings"
                >
                  <GearIcon className="w-5 h-5 text-primary" />
                </button>

                <button
                  onClick={() => router.push('/analytics')}
                  className="bg-card hover:bg-card/70 p-3 rounded-full transition-all duration-200 cursor-pointer"
                  aria-label="View analytics"
                  title="Analytics"
                >
                  <AnalyticsIcon className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
