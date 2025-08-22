'use client';

import { useEffect } from 'react';

const useTabClock = (timeLeft: string, category?: string) => {
  useEffect(() => {
    const categoryPart = category ? `${category} ` : '';
    document.title = `${timeLeft} ${categoryPart} - Time to focus!`;
  }, [timeLeft, category]);
};

export default useTabClock;
