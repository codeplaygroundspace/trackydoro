'use client';

import { cn } from '@/lib/utils';
import { TimerMode, TimerState } from '@/types';

interface ModeSelectorProps {
  currentMode: TimerMode;
  timerState: TimerState;
  onSwitchMode: (mode: TimerMode) => void;
}

export function ModeSelector({ currentMode, timerState, onSwitchMode }: ModeSelectorProps) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      <button
        onClick={() => onSwitchMode('pomodoro')}
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
        onClick={() => onSwitchMode('shortBreak')}
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
        onClick={() => onSwitchMode('longBreak')}
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
  );
}
