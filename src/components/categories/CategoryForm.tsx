'use client';

import { useEffect, useState } from 'react';

import { CATEGORY_COLOR_KEYS } from '@/lib/theme-colors';
import { Category } from '@/types';

interface CategoryFormProps {
  initialValues?: Category;
  onSubmit: (name: string, colorKey: Category['colorKey'], target: number) => void;
  onCancel: () => void;
}

/**
 * A form component for creating and editing categories.
 */
export function CategoryForm({ initialValues, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [colorKey, setColorKey] = useState<Category['colorKey']>(
    initialValues?.colorKey || 'emerald',
  );

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const initialTarget = initialValues?.target || 60;
    setHours(Math.floor(initialTarget / 60));
    setMinutes(initialTarget % 60);
    if (initialValues?.colorKey) setColorKey(initialValues.colorKey);
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes > 0) {
        onSubmit(name.trim(), colorKey, totalMinutes);
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
        <ColorKeySwatches selected={colorKey} onSelect={setColorKey} />
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

type ColorKeySwatchesProps = {
  selected: Category['colorKey'];
  onSelect: (key: Category['colorKey']) => void;
};

const ColorKeySwatches = ({ selected, onSelect }: ColorKeySwatchesProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORY_COLOR_KEYS.map((key) => {
        const bg = `oklch(var(--category-${key}) / 1)`;
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
              isSelected ? 'ring-2 ring-white scale-110' : ''
            }`}
            style={{ backgroundColor: bg }}
            aria-label={`Select color ${key}`}
            title={key}
          />
        );
      })}
    </div>
  );
};
