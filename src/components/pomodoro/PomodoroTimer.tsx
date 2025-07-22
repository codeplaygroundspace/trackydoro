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
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const resetAudioRef = useRef<HTMLAudioElement | null>(null);
  const { saveSession, loadSession, clearSession } = useTimerPersistence();

  // Initialize audio and load saved session
  useEffect(() => {
    audioRef.current = new Audio('/sounds/sound-run-time.wav');
    startAudioRef.current = new Audio('/sounds/pomo-start.wav');
    resetAudioRef.current = new Audio('/sounds/UI_reset.wav');

    // Load saved timer session
    const savedSession = loadSession();
    if (savedSession) {
      setTimeLeft(savedSession.timeLeft);
      setTimerState(savedSession.timerState);
      setSessionType(savedSession.sessionType || 'work');
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
    // Play sound with error handling
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing timer completion sound:', error);
      });
    }
    clearSession(); // Clear saved session when timer completes

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
  }, [timerState, selectedCategory, pomodoroCount, onPomodoroComplete, clearSession]);

  useEffect(() => {
    if (timerState === 'working' || timerState === 'break') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer has completed, trigger completion in next tick to ensure audio plays
            setTimeout(() => {
              handleTimerComplete();
            }, 0);
            return 0;
          }
          const newTimeLeft = prev - 1;

          // Save session every second while timer is running
          const totalSeconds =
            sessionType === 'work'
              ? TIMER_CONSTANTS.WORK_MINUTES * 60
              : (pomodoroCount % 4 === 0
                  ? TIMER_CONSTANTS.LONG_BREAK
                  : TIMER_CONSTANTS.SHORT_BREAK) * 60;
          const elapsedSeconds = totalSeconds - newTimeLeft;

          saveSession({
            timeLeft: newTimeLeft,
            timerState,
            selectedCategory,
            sessionType,
            startedAt: Date.now() - elapsedSeconds * 1000,
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
  }, [
    timerState,
    handleTimerComplete,
    selectedCategory,
    pomodoroCount,
    saveSession,
    clearSession,
    sessionType,
  ]);

  const startTimer = () => {
    if (!selectedCategory) return;
    startAudioRef.current?.play().catch((error) => {
      console.error('Error playing start sound:', error);
    });
    setTimerState('working');
    setSessionType('work');
  };

  const pauseTimer = () => {
    setTimerState('paused');
    // Save paused state
    saveSession({
      timeLeft,
      timerState: 'paused',
      selectedCategory,
      sessionType,
      pausedAt: Date.now(),
    });
  };

  const resumeTimer = () => {
    startAudioRef.current?.play().catch((error) => {
      console.error('Error playing start sound:', error);
    });
    setTimerState(sessionType === 'work' ? 'working' : 'break');
  };

  const resetTimer = () => {
    resetAudioRef.current?.play().catch((error) => {
      console.error('Error playing reset sound:', error);
    });
    setTimerState('idle');
    setTimeLeft(TIMER_CONSTANTS.WORK_MINUTES * 60);
    setSessionType('work');
    clearSession();
  };

  return (
    <div className="bg-card rounded-2xl p-8 mb-8 shadow-2xl border border-border">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="text-7xl md:text-8xl font-black mb-4 tabular-nums font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="text-base mb-6 text-muted-foreground">
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
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
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
            <div className="text-muted-foreground">Add a category to get started</div>
          ) : null}

          {timerState === 'idle' && categories.length > 0 && (
            <button
              onClick={startTimer}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              Start Pomodoro
            </button>
          )}

          {(timerState === 'working' || timerState === 'break') && (
            <button
              onClick={pauseTimer}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              Pause
            </button>
          )}

          {timerState === 'paused' && (
            <button
              onClick={resumeTimer}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              Resume
            </button>
          )}

          {timerState !== 'idle' && (
            <button
              onClick={resetTimer}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
          <div>Today: {pomodoroCount} 🍅</div>
          <div>Streak: {pomodoroCount > 0 ? Math.floor(pomodoroCount / 4) : 0} cycles</div>
        </div>
      </div>
    </div>
  );
}
