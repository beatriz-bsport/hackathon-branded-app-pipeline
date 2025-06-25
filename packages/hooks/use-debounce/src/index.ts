import { useCallback, useRef } from "react";

export const DEFAULT_DEBOUNCE_DELAY = 500;

export function useDebounce<T extends (...args: never[]) => void>(
  func: T,
  delay?: number,
): (...args: Parameters<T>) => void {
  // Ensure timeoutRef is defined and persists across renders
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalDelay = delay ?? DEFAULT_DEBOUNCE_DELAY;
  return useCallback(
    (...args: Parameters<T>) => {
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create a new timeout
      timeoutRef.current = setTimeout(() => {
        func(...args); // Call the provided function with the debounced arguments
      }, finalDelay);
    },
    [func, finalDelay], // Update only when func or delay changes
  );
}
