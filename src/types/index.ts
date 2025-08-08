export type TimerState = 'idle' | 'working' | 'paused' | 'break';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

import type { CategoryColorKey } from '@/lib/theme-colors';

export type Category = {
  id: string;
  name: string;
  colorKey: CategoryColorKey;
  target: number;
};

export type PomodoroLog = {
  id: string;
  date: string;
  categoryId: string;
  completedAt: string;
};

export type DayData = {
  date: string;
  minutes: number;
  pomodoros: number;
};

export type CategoryData = {
  categoryId: string;
  days: DayData[];
};
