'use client';

import { useSettingsStore } from '@/store/useSettingsStore';
import { TimerMode, TimerState } from '@/types';

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

      // If timer was running, calculate accurate remaining time based on startedAt and settings-derived total duration
      if (session.timerState === 'working' || session.timerState === 'break') {
        const now = Date.now();
        const { pomodoro, shortBreak, longBreak } = useSettingsStore.getState();
        const total =
          session.currentMode === 'pomodoro'
            ? pomodoro * 60
            : session.currentMode === 'longBreak'
              ? longBreak * 60
              : shortBreak * 60;
        const elapsed = Math.floor((now - (session.startedAt || now)) / 1000);
        const adjustedTimeLeft = Math.max(0, total - elapsed);

        if (adjustedTimeLeft === 0) {
          return null; // Let the app handle completion and reset
        }

        session.timeLeft = adjustedTimeLeft;
      }

      // If paused, keep timeLeft unchanged
      if (session.timerState === 'paused') {
        // no-op; rely on stored timeLeft
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
