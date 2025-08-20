'use client';

import { TimerMode, TimerState } from '@/types';

// This schema must be compatible with TimerStateShape in useTimer.ts
export interface TimerSession {
  timeLeft: number;
  timerState: TimerState;
  mode: TimerMode;
  selectedCategory: string;
  pomodorosCompleted: number;
  startedAt: number | null;
}

export function useTimerPersistence() {
  const saveSession = (session: TimerSession) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timerSession', JSON.stringify(session));
    }
  };

  const loadSession = (): Partial<TimerSession> | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem('timerSession');
      if (!saved) return null;

      const session = JSON.parse(saved) as TimerSession;

      // If timer was running when page was closed, calculate accurate remaining time
      if (session.timerState === 'running' && session.startedAt) {
        const elapsedSinceSave = Math.floor((Date.now() - session.startedAt) / 1000);
        const adjustedTimeLeft = Math.max(0, session.timeLeft - elapsedSinceSave);

        // If timer would have finished, set to 1 to trigger completion effect on next tick
        session.timeLeft = adjustedTimeLeft > 0 ? adjustedTimeLeft : 1;
      }

      // When loading, the timer is not running yet, so we reset startedAt.
      // The RESUME action in the reducer will set a new one if the user continues.
      session.startedAt = null;

      return session;
    } catch (error) {
      console.error('Error loading timer session:', error);
      clearSession(); // Clear corrupted data
      return null;
    }
  };

  const clearSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('timerSession');
    }
  };

  return { saveSession, loadSession, clearSession };
}
