'use client';

import { useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

export function KeyboardShortcuts({ onClose }: KeyboardShortcutsProps) {
  const { isMac } = useGlobalKeyboardShortcuts();
  const modifierKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: ['Space'], description: 'Start/Pause timer' },
    { keys: ['R'], description: 'Reset timer' },
    { keys: ['Esc'], description: 'Close modals' },
    { keys: [modifierKey, 'N'], description: 'New project' },
    { keys: ['1-9'], description: 'Quick project selection' },
    { keys: ['↑', '↓'], description: 'Navigate between projects' },
    { keys: ['?'], description: 'Keyboard shortcuts' },
    { keys: ['S'], description: 'Settings' },
  ];

  return (
    <>
      <h3 className="text-2xl font-semibold mb-4"> Shortcuts</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <div className="flex gap-1">
              {shortcut.keys.map((key, keyIndex) => (
                <kbd
                  key={keyIndex}
                  className="px-2 py-1 text-xs font-semibold text-card-foreground bg-muted rounded border border-border min-w-[2rem] text-center"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
      >
        Close
      </button>
    </>
  );
}
