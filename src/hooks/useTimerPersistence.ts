'use client';

import { TimerState } from '@/types';

interface TimerSession {
  timeLeft: number;
  timerState: TimerState;
  selectedCategory: string;
  startedAt?: number;
  pausedAt?: number;
}

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
        session.timeLeft = Math.max(0, session.timeLeft - elapsed);

        // If time ran out while away, mark as completed
        if (session.timeLeft === 0) {
          return null; // Let the timer start fresh
        }
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
