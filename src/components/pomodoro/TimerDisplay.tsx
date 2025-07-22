'use client';

import { formatTime } from '@/lib/date-utils';
import { TimerState } from '@/types';

interface TimerDisplayProps {
  timeLeft: number;
  timerState: TimerState;
  sessionType: 'work' | 'break';
}

export function TimerDisplay({ timeLeft, timerState, sessionType }: TimerDisplayProps) {
  return (
    <>
      <div className="relative inline-block">
        <div className="text-7xl md:text-8xl font-black tabular-nums mb-8">
          {formatTime(timeLeft)}
        </div>
      </div>

      {timerState === 'break' && (
        <div className="text-base mb-6 text-muted-foreground">☕ Break Time</div>
      )}
    </>
  );
}
