import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to conditionally combine Tailwind CSS classes.
 * It uses `clsx` to handle conditional classes and `tailwind-merge`
 * to intelligently merge and resolve conflicting Tailwind classes.
 *
 * @param inputs - A list of class values to combine.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
