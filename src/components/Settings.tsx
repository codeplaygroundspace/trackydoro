'use client';

import { useState } from 'react';

import { MAX_DURATION, MIN_DURATION } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/useSettingsStore';

import { Auth } from './Auth';
import { ThemeToggle } from './theme';

interface SettingsModalProps {
  onClose: () => void;
}

/**
 * A modal component that allows users to configure the durations for the Pomodoro timer,
 * manage their account, and change the application theme.
 */
export function Settings({ onClose }: SettingsModalProps) {
  const {
    pomodoro: initialPomodoro,
    shortBreak: initialShortBreak,
    longBreak: initialLongBreak,
    setPomodoro,
    setShortBreak,
    setLongBreak,
  } = useSettingsStore();

  const [pomodoroTime, setPomodoroTime] = useState(String(initialPomodoro));
  const [shortBreakTime, setShortBreakTime] = useState(String(initialShortBreak));
  const [longBreakTime, setLongBreakTime] = useState(String(initialLongBreak));

  const validate = (value: string) => {
    if (value.trim() === '') return false; // Disallow empty strings
    const num = Number(value);
    return !isNaN(num) && num >= MIN_DURATION && num <= MAX_DURATION && Number.isInteger(num);
  };

  const isPomodoroValid = validate(pomodoroTime);
  const isShortBreakValid = validate(shortBreakTime);
  const isLongBreakValid = validate(longBreakTime);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPomodoroValid && isShortBreakValid && isLongBreakValid) {
      setPomodoro(Number(pomodoroTime));
      setShortBreak(Number(shortBreakTime));
      setLongBreak(Number(longBreakTime));
      onClose();
    }
  };

  const isSaveDisabled = !isPomodoroValid || !isShortBreakValid || !isLongBreakValid;

  const validationMessage = `Must be a whole number between ${MIN_DURATION} and ${MAX_DURATION}.`;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Settings</h3>

      {/* Timer Settings Form */}
      <form onSubmit={handleSubmit}>
        <h4 className="text-lg font-semibold mb-2">Time (minutes)</h4>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="pomodoro-time"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Pomodoro
            </label>
            <input
              type="text"
              id="pomodoro-time"
              inputMode="numeric"
              pattern="[0-9]*"
              className={cn(
                'w-full p-2 rounded-lg bg-input border',
                isPomodoroValid ? 'border-border' : 'border-red-500',
                'focus:ring-2 focus:ring-primary focus:border-transparent',
              )}
              aria-label="Pomodoro time in minutes"
              value={pomodoroTime}
              onChange={(e) => setPomodoroTime(e.target.value)}
            />
            {!isPomodoroValid && <p className="text-red-500 text-xs mt-1">{validationMessage}</p>}
          </div>
          <div className="flex-1">
            <label
              htmlFor="short-break-time"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Short Break
            </label>
            <input
              type="text"
              id="short-break-time"
              inputMode="numeric"
              pattern="[0-9]*"
              className={cn(
                'w-full p-2 rounded-lg bg-input border',
                isShortBreakValid ? 'border-border' : 'border-red-500',
                'focus:ring-2 focus:ring-primary focus:border-transparent',
              )}
              aria-label="Short break time in minutes"
              value={shortBreakTime}
              onChange={(e) => setShortBreakTime(e.target.value)}
            />
            {!isShortBreakValid && <p className="text-red-500 text-xs mt-1">{validationMessage}</p>}
          </div>
          <div className="flex-1">
            <label
              htmlFor="long-break-time"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Long Break
            </label>
            <input
              type="text"
              id="long-break-time"
              inputMode="numeric"
              pattern="[0-9]*"
              className={cn(
                'w-full p-2 rounded-lg bg-input border',
                isLongBreakValid ? 'border-border' : 'border-red-500',
                'focus:ring-2 focus:ring-primary focus:border-transparent',
              )}
              aria-label="Long break time in minutes"
              value={longBreakTime}
              onChange={(e) => setLongBreakTime(e.target.value)}
            />
            {!isLongBreakValid && <p className="text-red-500 text-xs mt-1">{validationMessage}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer bg-card text-card-foreground hover:bg-card/70"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isSaveDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer'
            }`}
            disabled={isSaveDisabled}
          >
            Save
          </button>
        </div>
      </form>

      {/* Appearance Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Appearance</h4>
        <div className="p-4 border-border border rounded-lg flex items-center justify-between">
          <span className="font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Account Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Account</h4>
        <div className="p-4 border border-border rounded-lg">
          <Auth />
        </div>
      </div>
    </div>
  );
}
