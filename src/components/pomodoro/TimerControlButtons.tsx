'use client';

import { PauseIcon, PlayIcon, ResetIcon } from '@/components/icons';
import { TimerState } from '@/types';

interface TimerControlButtonsProps {
  timerState: TimerState;
  hasCategories: boolean;
  selectedCategory: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function TimerControlButtons({
  timerState,
  hasCategories,
  selectedCategory,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlButtonsProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4">
        {/* Main control button */}
        <div>
          {timerState === 'idle' && hasCategories && (
            <button
              onClick={onStart}
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
              onClick={onPause}
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
              onClick={onResume}
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
            onClick={onReset}
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
  );
}
