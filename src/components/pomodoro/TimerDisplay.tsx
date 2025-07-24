'use client';

import { useEffect, useRef } from 'react';
import { formatTime } from '@/lib/date-utils';
import { TimerState } from '@/types';

interface TimerDisplayProps {
  timeLeft: number;
  timerState: TimerState;
  sessionType: 'work' | 'break';
  switchMode?: (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => void;
}

export function TimerDisplay({ timeLeft, timerState, sessionType, switchMode }: TimerDisplayProps) {
  const prevTimeRef = useRef(timeLeft);
  const prevStateRef = useRef(timerState);

  // Calculate minutes for announcements
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Announce significant time updates
  useEffect(() => {
    const prevMinutes = Math.floor(prevTimeRef.current / 60);

    // Announce every 5 minutes, at 1 minute, and at completion
    if (timerState === 'working' || timerState === 'break') {
      if (minutes !== prevMinutes && (minutes % 5 === 0 || minutes === 1)) {
        // Will be announced by live region
      }
    }

    prevTimeRef.current = timeLeft;
  }, [timeLeft, minutes, timerState]);

  // Announce state changes
  useEffect(() => {
    if (prevStateRef.current !== timerState) {
      prevStateRef.current = timerState;
    }
  }, [timerState]);

  const getStatusMessage = () => {
    if (timerState === 'idle') return 'Timer ready';
    if (timerState === 'paused') return 'Timer paused';
    if (seconds === 0 && minutes === 0) return 'Session complete!';

    const sessionName = sessionType === 'work' ? 'Work session' : 'Break time';

    // Announce at specific intervals
    if (minutes === 1 && seconds === 0) {
      return `${sessionName}: 1 minute remaining`;
    }
    if (seconds === 0 && minutes % 5 === 0) {
      return `${sessionName}: ${minutes} minutes remaining`;
    }

    return '';
  };

  return (
    <>
      {/* Mode selection buttons */}
      {switchMode && (
        <div className="flex gap-2 justify-center mb-16">
          <button
            onClick={() => switchMode('pomodoro')}
            disabled={timerState !== 'idle'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              sessionType === 'work' && timeLeft === 25 * 60
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-secondary/50 text-secondary-foreground/70 hover:bg-secondary/70'
            } ${timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Switch to Pomodoro mode (25 minutes)"
          >
            Pomodoro
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            disabled={timerState !== 'idle'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              sessionType === 'break' && timeLeft === 5 * 60
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-secondary/50 text-secondary-foreground/70 hover:bg-secondary/70'
            } ${timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Switch to Short Break mode (5 minutes)"
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            disabled={timerState !== 'idle'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              sessionType === 'break' && timeLeft === 15 * 60
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-secondary/50 text-secondary-foreground/70 hover:bg-secondary/70'
            } ${timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Switch to Long Break mode (15 minutes)"
          >
            Long Break
          </button>
        </div>
      )}

      <div className="relative inline-block">
        <div
          className="text-7xl md:text-8xl font-black tabular-nums mb-16"
          aria-label={`Timer showing ${minutes} minutes and ${seconds} seconds`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Live region for timer announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {getStatusMessage()}
        </div>
      </div>
    </>
  );
}
