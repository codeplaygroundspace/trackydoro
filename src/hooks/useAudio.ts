'use client';

import { useEffect, useRef } from 'react';

interface UseAudioReturn {
  playSound: (soundType: 'complete' | 'start' | 'reset') => void;
}

export function useAudio(): UseAudioReturn {
  const audioRefs = useRef<{
    complete: HTMLAudioElement | null;
    start: HTMLAudioElement | null;
    reset: HTMLAudioElement | null;
  }>({
    complete: null,
    start: null,
    reset: null,
  });

  useEffect(() => {
    // Initialize audio elements
    const audios = {
      complete: new Audio('/sounds/sound-run-time.wav'),
      start: new Audio('/sounds/pomo-start.wav'),
      reset: new Audio('/sounds/UI_reset.wav'),
    };

    audioRefs.current = audios;

    // Cleanup function
    return () => {
      // Pause and clean up audio elements
      Object.values(audios).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const playSound = (soundType: 'complete' | 'start' | 'reset') => {
    const audio = audioRefs.current[soundType];
    if (audio) {
      audio.play().catch((error) => {
        console.error(`Error playing ${soundType} sound:`, error);
      });
    }
  };

  return { playSound };
}
