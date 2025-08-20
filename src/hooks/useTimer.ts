'use client';

import { useEffect, useReducer, useRef } from 'react';

import { useSettingsStore } from '@/store/useSettingsStore';
import { TimerMode, TimerState } from '@/types';

import { useTimerPersistence } from './useTimerPersistence';

// 1. Define State and Action Types
interface TimerStateShape {
  timeLeft: number;
  timerState: TimerState;
  mode: TimerMode;
  selectedCategory: string;
  pomodorosCompleted: number;
  startedAt: number | null; // Timestamp for when the current running state began
}

type TimerAction =
  | { type: 'START'; payload: { categoryId: string } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'COMPLETE' }
  | { type: 'SWITCH_MODE'; payload: { mode: TimerMode } }
  | { type: 'INITIALIZE'; payload: Partial<TimerStateShape> };

interface UseTimerProps {
  onPomodoroComplete: (categoryId: string) => void;
  onTimerComplete?: () => void;
}

// 2. Initial State Logic
const getInitialTime = (mode: TimerMode): number => {
  const { pomodoro, shortBreak, longBreak } = useSettingsStore.getState();
  switch (mode) {
    case 'pomodoro':
      return pomodoro * 60;
    case 'shortBreak':
      return shortBreak * 60;
    case 'longBreak':
      return longBreak * 60;
  }
};

const initialState: TimerStateShape = {
  timeLeft: getInitialTime('pomodoro'),
  timerState: 'idle',
  mode: 'pomodoro',
  selectedCategory: '',
  pomodorosCompleted: 0,
  startedAt: null,
};

// 3. Reducer Function
const timerReducer = (state: TimerStateShape, action: TimerAction): TimerStateShape => {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        timerState: 'running',
        selectedCategory: action.payload.categoryId,
        timeLeft: getInitialTime(state.mode),
        startedAt: Date.now(),
      };
    case 'PAUSE':
      return {
        ...state,
        timerState: 'paused',
        startedAt: null,
      };
    case 'RESUME':
      return {
        ...state,
        timerState: 'running',
        startedAt: Date.now(),
      };
    case 'RESET':
      return {
        ...initialState, // Reset to the very beginning
        timeLeft: getInitialTime('pomodoro'),
      };
    case 'TICK':
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    case 'COMPLETE': {
      const isPomodoro = state.mode === 'pomodoro';
      const newPomodorosCompleted = isPomodoro
        ? state.pomodorosCompleted + 1
        : state.pomodorosCompleted;
      const nextMode = isPomodoro
        ? newPomodorosCompleted % 4 === 0
          ? 'longBreak'
          : 'shortBreak'
        : 'pomodoro';

      return {
        ...state,
        timerState: 'idle',
        mode: nextMode,
        timeLeft: getInitialTime(nextMode),
        pomodorosCompleted: newPomodorosCompleted,
        startedAt: null,
      };
    }
    case 'SWITCH_MODE':
      if (state.timerState !== 'idle') return state;
      return {
        ...state,
        mode: action.payload.mode,
        timeLeft: getInitialTime(action.payload.mode),
      };
    case 'INITIALIZE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

// 4. The Hook itself
export function useTimer({ onPomodoroComplete, onTimerComplete }: UseTimerProps) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const { saveSession, loadSession, clearSession } = useTimerPersistence();
  const isInitialized = useRef(false);

  // Load session on mount
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      dispatch({ type: 'INITIALIZE', payload: savedSession });
    }
    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  // Main timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.timerState === 'running') {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.timerState]);

  // Handle timer completion
  useEffect(() => {
    if (state.timeLeft <= 0 && state.timerState === 'running') {
      if (state.mode === 'pomodoro') {
        onPomodoroComplete(state.selectedCategory);
      }
      onTimerComplete?.();
      dispatch({ type: 'COMPLETE' });
    }
  }, [
    state.timeLeft,
    state.timerState,
    state.mode,
    state.selectedCategory,
    onPomodoroComplete,
    onTimerComplete,
  ]);

  // Persist state changes
  useEffect(() => {
    if (!isInitialized.current) return;

    if (state.timerState === 'idle' && state.pomodorosCompleted === 0) {
      clearSession();
    } else {
      saveSession(state);
    }
  }, [state, saveSession, clearSession]);

  const { pomodoro, shortBreak, longBreak } = useSettingsStore();

  // Effect to update timer when settings change while idle
  useEffect(() => {
    if (state.timerState === 'idle') {
      dispatch({ type: 'SWITCH_MODE', payload: { mode: state.mode } });
    }
  }, [pomodoro, shortBreak, longBreak, state.timerState, state.mode]);

  return {
    state,
    dispatch,
    isInitialized: isInitialized.current,
  };
}
