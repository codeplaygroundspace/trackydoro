'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { Settings } from '@/components/Settings';
import { KeyboardShortcuts, Modal } from '@/components/ui';
import { TimerSkeleton } from '@/components/ui/LoadingSkeleton';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/hooks/useStore';

export default function Home() {
  const router = useRouter();

  // Get state and actions from Zustand store
  const categories = useStore((state) => state.categories);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const recordPomodoro = useStore((state) => state.recordPomodoro);
  const isLoading = useStore((state) => state.isLoading);
  const setLoading = useStore((state) => state.setLoading);

  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Simulate initial loading
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [setLoading]);

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
    <>
      <main className="text-foreground relative" role="main">
        {/* Wallpaper background */}
        <div className="fixed inset-0 bg-background">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/img/wallpaper02.jpeg)' }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Header - Fixed at top */}
        <div className="relative z-10 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AppHeader
              onKeyboardClick={() => setShowKeyboardShortcuts(true)}
              onSettingsClick={() => setShowSettings(true)}
              onAnalyticsClick={() => router.push('/analytics')}
            />
          </div>
        </div>

        {/* Timer section - calculated height excluding header and footer */}
        <div
          className="relative z-10 flex items-center justify-center"
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

        {/* Footer section */}
        <div className="relative z-10">{!isLoading && <Footer />}</div>

        {/* Keyboard modal */}
        <Modal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)}>
          <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
        </Modal>

        {/* Settings modal */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
          <Settings onClose={() => setShowSettings(false)} />
        </Modal>
      </main>
    </>
  );
}
