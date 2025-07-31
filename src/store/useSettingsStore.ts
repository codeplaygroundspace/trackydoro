'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  setPomodoro: (duration: number) => void;
  setShortBreak: (duration: number) => void;
  setLongBreak: (duration: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      setPomodoro: (duration) => set({ pomodoro: duration }),
      setShortBreak: (duration) => set({ shortBreak: duration }),
      setLongBreak: (duration) => set({ longBreak: duration }),
    }),
    {
      name: 'timer-settings',
    },
  ),
);
