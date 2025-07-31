'use client';

import { useEffect, useState } from 'react';

import { COLORS } from '@/lib/constants';
import { Category } from '@/types';

interface CategoryFormProps {
  initialValues?: Category;
  onSubmit: (name: string, color: string, target: number) => void;
  onCancel: () => void;
}

/**
 * A form component for creating and editing categories.
 */
export function CategoryForm({ initialValues, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [color, setColor] = useState(initialValues?.color || COLORS[0]);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const initialTarget = initialValues?.target || 60;
    setHours(Math.floor(initialTarget / 60));
    setMinutes(initialTarget % 60);
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes > 0) {
        onSubmit(name.trim(), color, totalMinutes);
      }
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = parseInt(e.target.value, 10) || 0;
    if (newHours < 0) newHours = 0;
    if (newHours > 24) newHours = 24;
    setHours(newHours);
    if (newHours === 24) {
      setMinutes(0);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = parseInt(e.target.value, 10) || 0;
    if (newMinutes < 0) newMinutes = 0;
    if (newMinutes > 59) newMinutes = 59;

    if (hours === 24) {
      setMinutes(0);
    } else {
      setMinutes(newMinutes);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />

      <div>
        <label className="block text-sm text-muted-foreground mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                color === c ? 'ring-2 ring-white scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">Daily target</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={hours}
            onChange={handleHoursChange}
            className="w-24 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Target hours"
          />
          <span className="text-muted-foreground">hours</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minutes}
            onChange={handleMinutesChange}
            className="w-24 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Target minutes"
          />
          <span className="text-muted-foreground">min</span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors cursor-pointer"
        >
          {initialValues ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
