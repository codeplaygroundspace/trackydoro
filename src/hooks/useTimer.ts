'use client';

/**
 * Manages the core logic and state for the Pomodoro timer.
 *
 * This hook acts as a self-contained state machine for the timer, handling
 * the countdown, state transitions (TimerState), and the current timer mode
 * (TimerMode: pomodoro, shortBreak, longBreak).
 *
 * It pulls timer durations from the global `useSettingsStore` to allow for
 * user customization, and leverages the `useTimerPersistence` hook to save
 * and load the active timer session to and from localStorage.
 *
 * Note: While settings are sourced globally, this hook encapsulates the
 * timer's high-frequency state changes (e.g., the second-by-second countdown)
 * to keep them local and optimize performance.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSettingsStore } from '@/store/useSettingsStore';
import { TimerMode, TimerState } from '@/types';

import { useTimerPersistence } from './useTimerPersistence';

interface UseTimerProps {
  selectedCategory: string;
  pomodoroCount: number;
  onPomodoroComplete: (categoryId: string) => void;
  onTimerComplete?: () => void;
}

interface UseTimerReturn {
  timeLeft: number;
  timerState: TimerState;
  currentMode: TimerMode;
  isInitialized: boolean;
  savedCategory?: string;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
}

export function useTimer({
  selectedCategory,
  pomodoroCount,
  onPomodoroComplete,
  onTimerComplete,
}: UseTimerProps): UseTimerReturn {
  const { pomodoro, shortBreak, longBreak } = useSettingsStore();

  const [timeLeft, setTimeLeft] = useState(pomodoro * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro');
  const [isInitialized, setIsInitialized] = useState(false);
  const [savedCategory, setSavedCategory] = useState<string | undefined>();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { saveSession, loadSession, clearSession } = useTimerPersistence();

  // Load saved session on mount
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      setTimeLeft(savedSession.timeLeft);
      setTimerState(savedSession.timerState);
      setCurrentMode(savedSession.currentMode || 'pomodoro');
      setSavedCategory(savedSession.selectedCategory);
    }
    setIsInitialized(true);
  }, [loadSession]);

  // Effect to update timer when settings change
  useEffect(() => {
    if (timerState === 'idle') {
      switch (currentMode) {
        case 'pomodoro':
          setTimeLeft(pomodoro * 60);
          break;
        case 'shortBreak':
          setTimeLeft(shortBreak * 60);
          break;
        case 'longBreak':
          setTimeLeft(longBreak * 60);
          break;
      }
    }
  }, [pomodoro, shortBreak, longBreak, timerState, currentMode]);

  const handleTimerComplete = useCallback(() => {
    clearSession();
    onTimerComplete?.();

    if (timerState === 'working') {
      onPomodoroComplete(selectedCategory);

      const newCount = pomodoroCount + 1;
      const isLongBreak = newCount % 4 === 0;
      const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
      const nextDuration = (isLongBreak ? longBreak : shortBreak) * 60;

      setTimerState('idle');
      setCurrentMode(nextMode);
      setTimeLeft(nextDuration);
    } else {
      // Break completed, go back to work mode
      setTimerState('idle');
      setCurrentMode('pomodoro');
      setTimeLeft(pomodoro * 60);
    }
  }, [
    timerState,
    selectedCategory,
    pomodoroCount,
    onPomodoroComplete,
    clearSession,
    onTimerComplete,
    pomodoro,
    shortBreak,
    longBreak,
  ]);

  // Timer interval effect
  useEffect(() => {
    if (timerState === 'working' || timerState === 'break') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimeout(() => {
              handleTimerComplete();
            }, 0);
            return 0;
          }
          const newTimeLeft = prev - 1;

          // Save session state
          saveSession({
            timeLeft: newTimeLeft,
            timerState,
            selectedCategory,
            currentMode,
            startedAt:
              Date.now() -
              (currentMode === 'pomodoro'
                ? pomodoro * 60
                : (currentMode === 'longBreak' ? longBreak : shortBreak) * 60 - newTimeLeft) *
                1000,
          });

          return newTimeLeft;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (timerState === 'idle') {
        clearSession();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    timerState,
    handleTimerComplete,
    selectedCategory,
    pomodoroCount,
    saveSession,
    clearSession,
    currentMode,
    pomodoro,
    shortBreak,
    longBreak,
  ]);

  const startTimer = useCallback(() => {
    if (!selectedCategory) return;

    const sessionType = currentMode === 'pomodoro' ? 'working' : 'break';
    setTimerState(sessionType);

    const duration = {
      pomodoro: pomodoro * 60,
      shortBreak: shortBreak * 60,
      longBreak: longBreak * 60,
    }[currentMode];

    saveSession({
      timeLeft: duration,
      timerState: sessionType,
      selectedCategory,
      currentMode,
      startedAt: Date.now(),
    });
  }, [selectedCategory, currentMode, pomodoro, shortBreak, longBreak, saveSession]);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
    saveSession({
      timeLeft,
      timerState: 'paused',
      selectedCategory,
      currentMode,
      pausedAt: Date.now(),
    });
  }, [timeLeft, selectedCategory, currentMode, saveSession]);

  const resumeTimer = useCallback(() => {
    const newTimerState = currentMode === 'pomodoro' ? 'working' : 'break';
    setTimerState(newTimerState);

    const totalSeconds =
      currentMode === 'pomodoro'
        ? pomodoro * 60
        : (currentMode === 'longBreak' ? longBreak : shortBreak) * 60;
    const elapsedSeconds = totalSeconds - timeLeft;

    saveSession({
      timeLeft,
      timerState: newTimerState,
      selectedCategory,
      currentMode,
      startedAt: Date.now() - elapsedSeconds * 1000,
    });
  }, [currentMode, pomodoro, shortBreak, longBreak, timeLeft, selectedCategory, saveSession]);

  const resetTimer = useCallback(() => {
    setTimerState('idle');
    setCurrentMode('pomodoro');
    setTimeLeft(pomodoro * 60);
    clearSession();
  }, [clearSession, pomodoro]);

  const switchMode = useCallback(
    (mode: TimerMode) => {
      if (timerState !== 'idle') return;

      clearSession();
      setCurrentMode(mode);

      switch (mode) {
        case 'pomodoro':
          setTimeLeft(pomodoro * 60);
          break;
        case 'shortBreak':
          setTimeLeft(shortBreak * 60);
          break;
        case 'longBreak':
          setTimeLeft(longBreak * 60);
          break;
      }
    },
    [timerState, clearSession, pomodoro, shortBreak, longBreak],
  );

  return {
    timeLeft,
    timerState,
    currentMode,
    isInitialized,
    savedCategory,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    switchMode,
  };
}
