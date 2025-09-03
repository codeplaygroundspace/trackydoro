'use client';

import { useEffect, useState } from 'react';

import { MAX_DURATION, MIN_DURATION } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/useSettingsStore';

import { Auth } from './Auth';

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
    timerFont,
    setPomodoro,
    setShortBreak,
    setLongBreak,
    setTimerFont,
  } = useSettingsStore();

  const [pomodoroTime, setPomodoroTime] = useState(String(initialPomodoro));
  const [shortBreakTime, setShortBreakTime] = useState(String(initialShortBreak));
  const [longBreakTime, setLongBreakTime] = useState(String(initialLongBreak));

  const handleFontChange = (font: typeof timerFont) => {
    setTimerFont(font);
  };

  // Keyboard navigation removed by request

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
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Timer Font</h4>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Select timer font">
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'retro',
                  value: 'Press Start 2P',
                  variable: '--font-press-start-2p',
                  display: '12:00',
                  label: 'Retro Game',
                },
                {
                  id: 'dos',
                  value: 'VT323',
                  variable: '--font-vt323',
                  display: '12:30',
                  label: 'Classic DOS',
                },
                {
                  id: 'tech',
                  value: 'Share Tech Mono',
                  variable: '--font-share-tech-mono',
                  display: '01:00',
                  label: 'Tech',
                },
                {
                  id: 'future',
                  value: 'Orbitron',
                  variable: '--font-orbitron',
                  display: '01:30',
                  label: 'Futuristic',
                },
                {
                  id: 'bold',
                  value: 'Rubik Mono One',
                  variable: '--font-rubik-mono-one',
                  display: '02:00',
                  label: 'Bold',
                },
                {
                  id: 'clean',
                  value: 'Fira Code',
                  variable: '--font-fira-code',
                  display: '02:30',
                  label: 'Clean',
                },
              ].map((font, index, fonts) => (
                <button
                  key={font.id}
                  type="button"
                  role="radio"
                  aria-checked={timerFont === font.value}
                  aria-label={`${font.label} font style, preview shows ${font.display}`}
                  onClick={() => handleFontChange(font.value as typeof timerFont)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleFontChange(font.value as typeof timerFont);
                    }
                  }}
                  className={cn(
                    'p-3 rounded-lg text-xl transition-all duration-200 cursor-pointer',
                    'border hover:border-primary/80',
                    timerFont === font.value
                      ? 'border-primary bg-card shadow-sm'
                      : 'border-border bg-transparent',
                    'flex flex-col items-center gap-2',
                  )}
                >
                  <div className="text-2xl" style={{ fontFamily: `var(${font.variable})` }}>
                    {font.display}
                  </div>
                  <div className="text-xs text-muted-foreground">{font.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

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
