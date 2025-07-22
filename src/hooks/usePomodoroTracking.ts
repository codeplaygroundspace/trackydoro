'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface TodayPomodoros {
  date: string;
  count: number;
}

export function usePomodoroTracking() {
  const [todayData, setTodayData] = useLocalStorage<TodayPomodoros | null>('todayPomodoros', null);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    if (todayData && todayData.date === today) {
      setPomodoroCount(todayData.count);
    } else {
      setPomodoroCount(0);
      setTodayData({ date: today, count: 0 });
    }
  }, [todayData, setTodayData]);

  const incrementPomodoro = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = pomodoroCount + 1;

    setPomodoroCount(newCount);
    setTodayData({ date: today, count: newCount });

    return newCount;
  };

  return {
    pomodoroCount,
    incrementPomodoro,
  };
}
