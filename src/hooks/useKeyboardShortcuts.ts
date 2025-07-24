'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled: boolean = true) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const isTextInput =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement;

      shortcuts.forEach((shortcut) => {
        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase() ||
          event.code.toLowerCase() === shortcut.key.toLowerCase();

        if (!keyMatches) return;

        const ctrlMatch = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !shortcut.ctrl || (!event.ctrlKey && !event.metaKey);
        const cmdMatch = shortcut.cmd ? event.metaKey : !shortcut.cmd || !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !shortcut.shift || !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !shortcut.alt || !event.altKey;

        if (ctrlMatch && cmdMatch && shiftMatch && altMatch) {
          // Skip shortcuts when typing in text fields unless explicitly allowed
          if (isTextInput && !shortcut.key.includes('Escape')) return;

          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
        }
      });
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
};

export const useGlobalKeyboardShortcuts = () => {
  const isMac =
    typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? 'cmd' : 'ctrl';

  return { isMac, modifierKey };
};
