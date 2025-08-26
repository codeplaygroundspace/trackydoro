'use client';

import { useEffect } from 'react';

import { PauseIcon, PlayIcon, ResetIcon } from '@/components/icons';
import { useAudio } from '@/hooks/useAudio';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
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
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div>
        {/* Category dropdown at top */}
        <div className="flex justify-center mb-16">
          {categories.length > 0 ? (
            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={timerState !== 'idle'}
              className={
                'bg-secondary text-secondary-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 text-xs font-medium'
              }
              aria-label="Select project for timer"
            >
              <option value="" disabled>
                Select a project
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-muted-foreground text-xs">Add a project to get started</div>
          )}
        </div>

        <TimerDisplay timeLeft={timeLeft} timerState={timerState} currentMode={currentMode} />

        {/* Mode selection buttons below timer */}
        {handleSwitchMode && (
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => handleSwitchMode('pomodoro')}
              disabled={timerState !== 'idle'}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                currentMode === 'pomodoro'
                  ? 'bg-secondary/50 text-secondary-foreground'
                  : 'text-secondary-foreground/70 hover:bg-secondary/20 hover:text-secondary-foreground',
                timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              )}
              aria-label="Switch to Focus mode"
            >
              Focus
            </button>
            <button
              onClick={() => handleSwitchMode('shortBreak')}
              disabled={timerState !== 'idle'}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                currentMode === 'shortBreak'
                  ? 'bg-secondary/50 text-secondary-foreground'
                  : 'text-secondary-foreground/70 hover:bg-secondary/20 hover:text-secondary-foreground',
                timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              )}
              aria-label="Switch to Short Break mode"
            >
              Short Break
            </button>
            <button
              onClick={() => handleSwitchMode('longBreak')}
              disabled={timerState !== 'idle'}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                currentMode === 'longBreak'
                  ? 'bg-secondary/50 text-secondary-foreground'
                  : 'text-secondary-foreground/70 hover:bg-secondary/20 hover:text-secondary-foreground',
                timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              )}
              aria-label="Switch to Long Break mode"
            >
              Long Break
            </button>
          </div>
        )}

        {/* Timer control buttons below the timer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            {/* Main control button */}
            <div>
              {timerState === 'idle' && categories.length > 0 && (
                <button
                  onClick={handleStart}
                  disabled={!selectedCategory}
                  className={
                    'bg-white/40 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-200 transform shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-16 h-16 flex items-center justify-center'
                  }
                  aria-label="Start timer (Spacebar)"
                >
                  <PlayIcon className="size-8 text-white" />
                </button>
              )}

              {timerState === 'running' && (
                <button
                  onClick={handlePause}
                  className={
                    'bg-white/40 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-200 transform shadow-lg cursor-pointer w-16 h-16 flex items-center justify-center'
                  }
                  aria-label="Pause timer (Spacebar)"
                >
                  <PauseIcon className="size-8 text-white" />
                </button>
              )}

              {timerState === 'paused' && (
                <button
                  onClick={handleResume}
                  className={
                    'bg-white/40 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-200 transform shadow-lg cursor-pointer w-16 h-16 flex items-center justify-center'
                  }
                  aria-label="Resume timer (Spacebar)"
                >
                  <PlayIcon className="size-8 text-white" />
                </button>
              )}
            </div>

            {/* Reset button */}
            {timerState === 'paused' && (
              <button
                onClick={handleReset}
                className={
                  'bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 transform shadow-lg cursor-pointer w-12 h-12 flex items-center justify-center'
                }
                aria-label="Reset timer"
              >
                <ResetIcon className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
