'use client';

import { useState } from 'react';
import { Category, COLORS } from '@/types';

interface CategoryFormProps {
  initialValues?: Category;
  onSubmit: (name: string, color: string, target: number) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialValues, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [color, setColor] = useState(initialValues?.color || COLORS[0]);
  const [target, setTarget] = useState(initialValues?.target || 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color, target);
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
        <label className="block text-sm text-muted-foreground mb-2">
          Daily target: {target} minutes
        </label>
        <input
          type="range"
          min="15"
          max="240"
          step="15"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="w-full"
        />
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
