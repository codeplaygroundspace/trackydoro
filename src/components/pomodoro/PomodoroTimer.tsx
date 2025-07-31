'use client';

import { useEffect } from 'react';

import { useAudio } from '@/hooks/useAudio';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePomodoroStyles } from '@/hooks/usePomodoroStyles'; // Import the new hook
import { useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils'; // Import the utility for conditional classes
import { Category } from '@/types';

import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';

interface PomodoroTimerProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onPomodoroComplete: (categoryId: string) => void;
  pomodoroCount: number;
}

export function PomodoroTimer({
  categories,
  selectedCategory,
  onCategoryChange,
  onPomodoroComplete,
  pomodoroCount,
}: PomodoroTimerProps) {
  const { playSound } = useAudio();

  const {
    timeLeft,
    timerState,
    currentMode,
    isInitialized,
    savedCategory,
    startTimer: startTimerBase,
    pauseTimer,
    resumeTimer: resumeTimerBase,
    resetTimer,
    switchMode,
  } = useTimer({
    selectedCategory,
    pomodoroCount,
    onPomodoroComplete,
    onTimerComplete: () => playSound('complete'),
  });

  // Get dynamic styles based on the session type
  const { cardClasses } = usePomodoroStyles(currentMode);

  // Load saved category on initialization
  useEffect(() => {
    if (isInitialized && savedCategory) {
      const categoryExists = categories.some((c) => c.id === savedCategory);
      if (categoryExists) {
        onCategoryChange(savedCategory);
      }
    }
  }, [isInitialized, savedCategory, categories, onCategoryChange]);

  const handleStart = () => {
    playSound('start');
    startTimerBase();
  };

  const handleResume = () => {
    playSound('start');
    resumeTimerBase();
  };

  // Keyboard shortcuts for timer controls
  useKeyboardShortcuts(
    [
      {
        key: ' ',
        handler: () => {
          if (timerState === 'idle' && selectedCategory && categories.length > 0) {
            handleStart();
          } else if (timerState === 'working' || timerState === 'break') {
            pauseTimer();
          } else if (timerState === 'paused') {
            handleResume();
          }
        },
      },
      {
        key: 'r',
        handler: () => {
          if (timerState === 'working' || timerState === 'break' || timerState === 'paused') {
            resetTimer();
          }
        },
      },
    ],
    isInitialized,
  );

  if (!isInitialized) {
    return (
      <div className="bg-card rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-48 h-24 bg-muted rounded-lg mx-auto mb-8" />
            <div className="w-64 h-10 bg-muted rounded-lg mx-auto mb-6" />
            <div className="flex justify-center gap-8">
              <div className="w-24 h-6 bg-muted rounded" />
              <div className="w-24 h-6 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl py-8 px-12 mb-8 shadow-2xl transition-colors duration-500',
        cardClasses,
      )}
    >
      <div className={cn('text-center')}>
        <TimerDisplay
          timeLeft={timeLeft}
          timerState={timerState}
          currentMode={currentMode}
          switchMode={switchMode}
        />

        <TimerControls
          categories={categories}
          selectedCategory={selectedCategory}
          timerState={timerState}
          isInitialized={isInitialized}
          onCategoryChange={onCategoryChange}
          onStart={handleStart}
          onPause={pauseTimer}
          onResume={handleResume}
          onReset={resetTimer}
        />
      </div>
    </div>
  );
}
