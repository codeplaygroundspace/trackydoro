export type Category = {
  id: string;
  name: string;
  color: string;
  target: number;
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

export type TimerState = 'idle' | 'working' | 'break' | 'paused';

export const TIMER_CONSTANTS = {
  WORK_MINUTES: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
} as const;

export const COLORS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#14b8a6',
  '#ec4899',
  '#6366f1',
  '#84cc16',
  '#f97316',
] as const;
