'use client';

import { useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsModalProps) {
  const [pomodoroTime, setPomodoroTime] = useState(25); // Initial value for Pomodoro

  const handlePomodoroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPomodoroTime(Number(e.target.value));
  };

  const isSaveDisabled = pomodoroTime === 0;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4"> Settings</h3>
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
            type="number"
            id="pomodoro-time"
            className="w-full p-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Pomodoro time in minutes"
            value={pomodoroTime}
            onChange={handlePomodoroChange}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="short-break-time"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Short Break
          </label>
          <input
            type="number"
            id="short-break-time"
            className="w-full p-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Short break time in minutes"
            defaultValue={5} // Placeholder value
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="long-break-time"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Long Break
          </label>
          <input
            type="number"
            id="long-break-time"
            className="w-full p-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Long break time in minutes"
            defaultValue={15} // Placeholder value
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer bg-card text-card-foreground hover:bg-card/70"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            /* TODO: Implement save logic */ onClose();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer'}`}
          disabled={isSaveDisabled}
        >
          Save
        </button>
      </div>
    </div>
  );
}
