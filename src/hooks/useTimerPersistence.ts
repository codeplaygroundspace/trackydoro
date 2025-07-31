'use client';

import { TimerMode,TimerState } from '@/types';

interface TimerSession {
  timeLeft: number;
  timerState: TimerState;
  selectedCategory: string;
  currentMode: TimerMode;
  sessionType?: 'work' | 'break';
  startedAt?: number;
  pausedAt?: number;
}

/**
 * A hook that provides an interface for interacting with the timer's session state
 * stored in `localStorage`. It handles the logic for saving the current timer
 * state, loading it when the application re-opens, and clearing it when a session
 * is completed or reset.
 *
 * This abstraction is crucial for ensuring that the timer's state can survive
 * page reloads, providing a seamless user experience.
 */
export function useTimerPersistence() {
  const saveSession = (session: TimerSession) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timerSession', JSON.stringify(session));
    }
  };

  const loadSession = (): TimerSession | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem('timerSession');
      if (!saved) return null;

      const session = JSON.parse(saved) as TimerSession;

      // If timer was running, calculate elapsed time
      if (session.timerState === 'working' || session.timerState === 'break') {
        const now = Date.now();
        const elapsed = Math.floor((now - (session.startedAt || now)) / 1000);
        const adjustedTimeLeft = Math.max(0, session.timeLeft - elapsed);

        // If time ran out while away, mark as completed
        if (adjustedTimeLeft === 0) {
          return null; // Let the timer start fresh
        }

        // Return the adjusted time
        session.timeLeft = adjustedTimeLeft;
      }

      return session;
    } catch (error) {
      console.error('Error loading timer session:', error);
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
