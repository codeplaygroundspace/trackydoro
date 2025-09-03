'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  timerFont:
    | 'Press Start 2P'
    | 'VT323'
    | 'Share Tech Mono'
    | 'Orbitron'
    | 'Rubik Mono One'
    | 'Fira Code';
  setPomodoro: (duration: number) => void;
  setShortBreak: (duration: number) => void;
  setLongBreak: (duration: number) => void;
  setTimerFont: (font: SettingsState['timerFont']) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      timerFont: 'Press Start 2P',
      setPomodoro: (duration) => set({ pomodoro: duration }),
      setShortBreak: (duration) => set({ shortBreak: duration }),
      setLongBreak: (duration) => set({ longBreak: duration }),
      setTimerFont: (font) => set({ timerFont: font }),
    }),
    {
      name: 'timer-settings',
    },
  ),
);
