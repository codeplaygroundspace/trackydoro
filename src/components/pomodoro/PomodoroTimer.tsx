'use client';

import { useEffect } from 'react';

import { useAudio } from '@/hooks/useAudio';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePomodoroStyles } from '@/hooks/usePomodoroStyles';
import useTabClock from '@/hooks/useTabClock';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Category, TimerMode } from '@/types';

import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';

interface PomodoroTimerProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onPomodoroComplete: (categoryId: string) => void;
}

export function PomodoroTimer({
  categories,
  selectedCategory,
  onCategoryChange,
  onPomodoroComplete,
}: PomodoroTimerProps) {
  const { playSound } = useAudio();

  const { state, dispatch, isInitialized } = useTimer({
    onPomodoroComplete,
    onTimerComplete: () => playSound('complete'),
  });

  const { timeLeft, timerState, mode: currentMode } = state;

  const categoryName = categories.find((c) => c.id === state.selectedCategory)?.name;

  useTabClock(formatTime(timeLeft), categoryName);

  const { cardClasses } = usePomodoroStyles(currentMode);

  // Effect to handle category selection persistence from the timer state
  useEffect(() => {
    if (isInitialized && state.selectedCategory) {
      const categoryExists = categories.some((c) => c.id === state.selectedCategory);
      if (categoryExists) {
        onCategoryChange(state.selectedCategory);
      }
    }
  }, [isInitialized, state.selectedCategory, categories, onCategoryChange]);

  const handleStart = () => {
    if (!selectedCategory) return;
    playSound('start');
    dispatch({ type: 'START', payload: { categoryId: selectedCategory } });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const handleResume = () => {
    playSound('start');
    dispatch({ type: 'RESUME' });
  };

  const handleReset = () => {
    playSound('reset');
    dispatch({ type: 'RESET' });
  };

  const handleSwitchMode = (mode: TimerMode) => {
    dispatch({ type: 'SWITCH_MODE', payload: { mode } });
  };

  useKeyboardShortcuts(
    [
      {
        key: ' ',
        handler: () => {
          if (timerState === 'idle' && selectedCategory && categories.length > 0) {
            handleStart();
          } else if (timerState === 'running') {
            handlePause();
          } else if (timerState === 'paused') {
            handleResume();
          }
        },
      },
      {
        key: 'r',
        handler: () => {
          if (timerState !== 'idle') {
            handleReset();
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
          switchMode={handleSwitchMode}
        />

        <TimerControls
          categories={categories}
          selectedCategory={selectedCategory}
          timerState={timerState}
          onCategoryChange={onCategoryChange}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
