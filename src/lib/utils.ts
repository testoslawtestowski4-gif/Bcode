import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  // Check if we are in a browser environment before accessing document
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('no-animations')) {
    const filteredInputs = inputs.filter(input => {
      if (typeof input !== 'string') return true;
      // Filter out animation and transition related classes
      return !/^(transition|duration|ease|delay|animate)/.test(input);
    });
    return twMerge(clsx(filteredInputs));
  }
  
  return twMerge(clsx(inputs))
}
