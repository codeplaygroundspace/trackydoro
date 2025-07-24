'use client';

import { useEffect, useRef } from 'react';
import { formatTime } from '@/lib/date-utils';
import { TimerState } from '@/types';

interface TimerDisplayProps {
  timeLeft: number;
  timerState: TimerState;
  sessionType: 'work' | 'break';
}

export function TimerDisplay({ timeLeft, timerState, sessionType }: TimerDisplayProps) {
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
      <div className="relative inline-block">
        <div
          className="text-7xl md:text-8xl font-black tabular-nums mb-8"
          aria-label={`Timer showing ${minutes} minutes and ${seconds} seconds`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Live region for timer announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {getStatusMessage()}
        </div>
      </div>

      {sessionType === 'break' &&
        (timerState === 'idle' || timerState === 'break' || timerState === 'paused') && (
          <div className="text-base mb-6 text-muted-foreground">☕ Break Time</div>
        )}
    </>
  );
}
