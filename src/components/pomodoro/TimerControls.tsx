'use client';

import { Category, TimerState } from '@/types';

interface TimerControlsProps {
  categories: Category[];
  selectedCategory: string;
  timerState: TimerState;
  isInitialized: boolean;
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
  isInitialized,
  onCategoryChange,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4 justify-center mb-6 flex-wrap">
      {categories.length > 0 && isInitialized ? (
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={timerState !== 'idle'}
          className="bg-secondary text-secondary-foreground pl-4 pr-12 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      ) : categories.length === 0 ? (
        <div className="text-muted-foreground">Add a category to get started</div>
      ) : null}

      {timerState === 'idle' && categories.length > 0 && (
        <button
          onClick={onStart}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
        >
          Start Pomodoro
        </button>
      )}

      {(timerState === 'working' || timerState === 'break') && (
        <button
          onClick={onPause}
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
        >
          Pause
        </button>
      )}

      {timerState === 'paused' && (
        <button
          onClick={onResume}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
        >
          Resume
        </button>
      )}

      {timerState !== 'idle' && (
        <button
          onClick={onReset}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
        >
          Reset
        </button>
      )}
    </div>
  );
}
