'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Category, TimerState, TIMER_CONSTANTS } from '@/types';
import { formatTime } from '@/lib/utils';
import { useTimerPersistence } from '@/hooks/useTimerPersistence';

interface PomodoroTimerProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onPomodoroComplete: (categoryId: string) => void;
  pomodoroCount: number;
}

export function PomodoroTimer({
  categories,
  selectedCategory,
  onCategoryChange,
  onPomodoroComplete,
  pomodoroCount,
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_CONSTANTS.WORK_MINUTES * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [isInitialized, setIsInitialized] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { saveSession, loadSession, clearSession } = useTimerPersistence();

  // Initialize audio and load saved session
  useEffect(() => {
    audioRef.current = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
    );

    // Load saved timer session
    const savedSession = loadSession();
    if (savedSession) {
      setTimeLeft(savedSession.timeLeft);
      setTimerState(savedSession.timerState);
      if (
        savedSession.selectedCategory &&
        categories.some((c) => c.id === savedSession.selectedCategory)
      ) {
        onCategoryChange(savedSession.selectedCategory);
      }
    }

    setIsInitialized(true);
  }, [categories, loadSession, onCategoryChange]);

  const handleTimerComplete = useCallback(() => {
    audioRef.current?.play();
    clearSession(); // Clear saved session when timer completes

    if (timerState === 'working') {
      onPomodoroComplete(selectedCategory);

      const newCount = pomodoroCount + 1;
      const isLongBreak = newCount % 4 === 0;
      setTimeLeft((isLongBreak ? TIMER_CONSTANTS.LONG_BREAK : TIMER_CONSTANTS.SHORT_BREAK) * 60);
      setTimerState('break');
    } else {
      setTimeLeft(TIMER_CONSTANTS.WORK_MINUTES * 60);
      setTimerState('idle');
    }
  }, [timerState, selectedCategory, pomodoroCount, onPomodoroComplete, clearSession]);

  useEffect(() => {
    if (timerState === 'working' || timerState === 'break') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          const newTimeLeft = prev - 1;

          // Save session every second while timer is running
          saveSession({
            timeLeft: newTimeLeft,
            timerState,
            selectedCategory,
            startedAt:
              Date.now() -
              ((timerState === 'working'
                ? TIMER_CONSTANTS.WORK_MINUTES
                : timerState === 'break'
                  ? pomodoroCount % 4 === 0
                    ? TIMER_CONSTANTS.LONG_BREAK
                    : TIMER_CONSTANTS.SHORT_BREAK
                  : TIMER_CONSTANTS.WORK_MINUTES) *
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

      // Clear session when timer is idle or paused
      if (timerState === 'idle') {
        clearSession();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState, handleTimerComplete, selectedCategory, pomodoroCount, saveSession, clearSession]);

  const startTimer = () => {
    if (!selectedCategory) return;
    setTimerState('working');
  };

  const pauseTimer = () => {
    setTimerState('paused');
    // Save paused state
    saveSession({
      timeLeft,
      timerState: 'paused',
      selectedCategory,
      pausedAt: Date.now(),
    });
  };

  const resumeTimer = () => {
    setTimerState(timeLeft === TIMER_CONSTANTS.WORK_MINUTES * 60 ? 'working' : 'break');
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(TIMER_CONSTANTS.WORK_MINUTES * 60);
    clearSession();
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="text-7xl md:text-8xl font-mono font-bold mb-4 tabular-nums">
            {formatTime(timeLeft)}
          </div>
          {timerState === 'working' && (
            <div className="absolute -right-2 -top-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>

        <div className="text-xl mb-6 text-gray-300">
          {timerState === 'working'
            ? '🎯 Focus Time'
            : timerState === 'break'
              ? '☕ Break Time'
              : '⏳ Ready to Focus'}
        </div>

        <div className="flex gap-4 justify-center mb-6 flex-wrap">
          {categories.length > 0 && isInitialized ? (
            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={timerState !== 'idle'}
              className="bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : categories.length === 0 ? (
            <div className="text-gray-400">Add a category to get started</div>
          ) : null}

          {timerState === 'idle' && categories.length > 0 && (
            <button
              onClick={startTimer}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Pomodoro
            </button>
          )}

          {(timerState === 'working' || timerState === 'break') && (
            <button
              onClick={pauseTimer}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Pause
            </button>
          )}

          {timerState === 'paused' && (
            <button
              onClick={resumeTimer}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Resume
            </button>
          )}

          {timerState !== 'idle' && (
            <button
              onClick={resetTimer}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex justify-center gap-8 text-sm text-gray-400">
          <div>Today: {pomodoroCount} 🍅</div>
          <div>Streak: {pomodoroCount > 0 ? Math.floor(pomodoroCount / 4) : 0} cycles</div>
        </div>
      </div>
    </div>
  );
}
