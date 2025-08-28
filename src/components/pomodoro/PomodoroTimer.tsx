'use client';

import { useEffect, useState } from 'react';

import { useAudio } from '@/hooks/useAudio';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import useTabClock from '@/hooks/useTabClock';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/date-utils';
import { Category, TimerMode, TimerState } from '@/types';

import { CategoryDropdown } from './CategoryDropdown';
import { ModeSelector } from './ModeSelector';
import { TimerControlButtons } from './TimerControlButtons';
import { TimerDisplay } from './TimerDisplay';

interface PomodoroTimerProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onPomodoroComplete: (categoryId: string) => void;
  onTimerStateChange?: (timerState: TimerState) => void;
}

export function PomodoroTimer({
  categories,
  selectedCategory,
  onCategoryChange,
  onPomodoroComplete,
  onTimerStateChange,
}: PomodoroTimerProps) {
  const { playSound } = useAudio();

  const { state, dispatch, isInitialized } = useTimer({
    onPomodoroComplete,
    onTimerComplete: () => playSound('complete'),
  });

  const { timeLeft, timerState, mode: currentMode } = state;

  const categoryName = categories.find((c) => c.id === state.selectedCategory)?.name;

  useTabClock(formatTime(timeLeft), categoryName);

  // Notify parent component of timer state changes
  useEffect(() => {
    if (onTimerStateChange) {
      onTimerStateChange(timerState);
    }
  }, [timerState, onTimerStateChange]);

  // Effect to handle category selection persistence from the timer state
  useEffect(() => {
    if (isInitialized && state.selectedCategory) {
      const categoryExists = categories.some((c) => c.id === state.selectedCategory);
      if (categoryExists) {
        onCategoryChange(state.selectedCategory);
      }
    }
  }, [isInitialized, state.selectedCategory, categories, onCategoryChange]);

  // Effect to show browser alert when refreshing page with active timer
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (timerState === 'running' || timerState === 'paused') {
        // Modern browsers require interaction with the page before showing the dialog
        // and ignore custom messages for security reasons
        const message = 'You have an active timer session. Changes may be lost if you leave.';
        e.preventDefault();
        e.returnValue = message; // Required for Chrome
        return message; // For older browsers
      }
    };

    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timerState]);

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
    <div className="flex flex-col items-center">
      <div>
        {/* Category dropdown at top */}
        <div className="flex justify-center mb-16">
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            timerState={timerState}
            onCategoryChange={onCategoryChange}
          />
        </div>

        <TimerDisplay timeLeft={timeLeft} timerState={timerState} currentMode={currentMode} />

        {/* Mode selection buttons below timer */}
        {handleSwitchMode && (
          <ModeSelector
            currentMode={currentMode}
            timerState={timerState}
            onSwitchMode={handleSwitchMode}
          />
        )}

        {/* Timer control buttons below the timer */}
        <TimerControlButtons
          timerState={timerState}
          hasCategories={categories.length > 0}
          selectedCategory={selectedCategory}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
