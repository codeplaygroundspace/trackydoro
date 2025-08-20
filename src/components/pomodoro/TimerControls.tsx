'use client';

import { Category, TimerState } from '@/types';

interface TimerControlsProps {
  categories: Category[];
  selectedCategory: string;
  timerState: TimerState;
  onCategoryChange: (categoryId: string) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function TimerControls({
  categories,
  selectedCategory,
  timerState,
  onCategoryChange,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      {categories.length > 0 ? (
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={timerState !== 'idle'}
          className={
            'bg-secondary text-secondary-foreground px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 w-64 h-12 font-semibold'
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
        <div className="text-muted-foreground">Add a project to get started</div>
      )}

      <div className="flex flex-col gap-4">
        {timerState === 'idle' && categories.length > 0 && (
          <button
            onClick={onStart}
            disabled={!selectedCategory}
            className={
              'bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-64 h-12'
            }
            aria-label="Start timer (Spacebar)"
          >
            Start
          </button>
        )}

        {timerState === 'running' && (
          <button
            onClick={onPause}
            className={
              'bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer w-64 h-12'
            }
            aria-label="Pause timer (Spacebar)"
          >
            Pause
          </button>
        )}

        {timerState === 'paused' && (
          <button
            onClick={onResume}
            className={
              'bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer w-64 h-12'
            }
            aria-label="Resume timer (Spacebar)"
          >
            Resume
          </button>
        )}

        {timerState !== 'idle' && (
          <button
            onClick={onReset}
            className={
              'text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors cursor-pointer'
            }
            aria-label="Reset timer"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
