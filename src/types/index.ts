export type TimerState = 'idle' | 'working' | 'paused' | 'break';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export type Category = {
  id: string;
  name: string;
  color: string;
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
