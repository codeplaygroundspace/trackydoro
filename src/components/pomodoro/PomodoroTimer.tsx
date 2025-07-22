'use client';

import { useEffect } from 'react';
import { Category } from '@/types';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';

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
    sessionType,
    isInitialized,
    savedCategory,
    startTimer: startTimerBase,
    pauseTimer,
    resumeTimer: resumeTimerBase,
    resetTimer: resetTimerBase,
  } = useTimer({
    selectedCategory,
    pomodoroCount,
    onPomodoroComplete,
    onTimerComplete: () => playSound('complete'),
  });

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

  const handleReset = () => {
    playSound('reset');
    resetTimerBase();
  };

  if (!isInitialized) {
    return (
      <div className="bg-card rounded-2xl p-8 mb-8 shadow-2xl border border-border">
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
    <div className="bg-card rounded-2xl p-8 mb-8 shadow-2xl border border-border">
      <div className="text-center">
        <TimerDisplay timeLeft={timeLeft} timerState={timerState} sessionType={sessionType} />

        <TimerControls
          categories={categories}
          selectedCategory={selectedCategory}
          timerState={timerState}
          isInitialized={isInitialized}
          onCategoryChange={onCategoryChange}
          onStart={handleStart}
          onPause={pauseTimer}
          onResume={handleResume}
          onReset={handleReset}
        />

        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
          <div>Today: {pomodoroCount} 🍅</div>
          <div>Streak: {pomodoroCount > 0 ? Math.floor(pomodoroCount / 4) : 0} cycles</div>
        </div>
      </div>
    </div>
  );
}
