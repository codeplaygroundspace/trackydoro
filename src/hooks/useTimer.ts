'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TIMER_CONSTANTS } from '@/types';
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
  sessionType: 'work' | 'break';
  isInitialized: boolean;
  savedCategory?: string;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
}

export function useTimer({
  selectedCategory,
  pomodoroCount,
  onPomodoroComplete,
  onTimerComplete,
}: UseTimerProps): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(TIMER_CONSTANTS.WORK_MINUTES * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [savedCategory, setSavedCategory] = useState<string | undefined>();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { saveSession, loadSession, clearSession } = useTimerPersistence();

  // Load saved session on mount
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      setTimeLeft(savedSession.timeLeft);
      setTimerState(savedSession.timerState);
      setSessionType(savedSession.sessionType || 'work');
      setSavedCategory(savedSession.selectedCategory);
    }
    setIsInitialized(true);
  }, [loadSession]);

  const handleTimerComplete = useCallback(() => {
    clearSession();
    onTimerComplete?.();

    if (timerState === 'working') {
      onPomodoroComplete(selectedCategory);

      const newCount = pomodoroCount + 1;
      const isLongBreak = newCount % 4 === 0;
      setTimeLeft((isLongBreak ? TIMER_CONSTANTS.LONG_BREAK : TIMER_CONSTANTS.SHORT_BREAK) * 60);
      setTimerState('break');
      setSessionType('break');
    } else {
      setTimeLeft(TIMER_CONSTANTS.WORK_MINUTES * 60);
      setTimerState('idle');
      setSessionType('work');
    }
  }, [
    timerState,
    selectedCategory,
    pomodoroCount,
    onPomodoroComplete,
    clearSession,
    onTimerComplete,
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
            sessionType,
            startedAt:
              Date.now() -
              (sessionType === 'work'
                ? TIMER_CONSTANTS.WORK_MINUTES * 60
                : (pomodoroCount % 4 === 0
                    ? TIMER_CONSTANTS.LONG_BREAK
                    : TIMER_CONSTANTS.SHORT_BREAK) *
                    60 -
                  newTimeLeft) *
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
    sessionType,
  ]);

  const startTimer = useCallback(() => {
    if (!selectedCategory) return;
    setTimerState('working');
    setSessionType('work');

    saveSession({
      timeLeft: TIMER_CONSTANTS.WORK_MINUTES * 60,
      timerState: 'working',
      selectedCategory,
      sessionType: 'work',
      startedAt: Date.now(),
    });
  }, [selectedCategory, saveSession]);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
    saveSession({
      timeLeft,
      timerState: 'paused',
      selectedCategory,
      sessionType,
      pausedAt: Date.now(),
    });
  }, [timeLeft, selectedCategory, sessionType, saveSession]);

  const resumeTimer = useCallback(() => {
    const newTimerState = sessionType === 'work' ? 'working' : 'break';
    setTimerState(newTimerState);

    const totalSeconds =
      sessionType === 'work'
        ? TIMER_CONSTANTS.WORK_MINUTES * 60
        : (pomodoroCount % 4 === 0 ? TIMER_CONSTANTS.LONG_BREAK : TIMER_CONSTANTS.SHORT_BREAK) * 60;
    const elapsedSeconds = totalSeconds - timeLeft;

    saveSession({
      timeLeft,
      timerState: newTimerState,
      selectedCategory,
      sessionType,
      startedAt: Date.now() - elapsedSeconds * 1000,
    });
  }, [sessionType, pomodoroCount, timeLeft, selectedCategory, saveSession]);

  const resetTimer = useCallback(() => {
    setTimerState('idle');
    setTimeLeft(TIMER_CONSTANTS.WORK_MINUTES * 60);
    setSessionType('work');
    clearSession();
  }, [clearSession]);

  return {
    timeLeft,
    timerState,
    sessionType,
    isInitialized,
    savedCategory,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
}
