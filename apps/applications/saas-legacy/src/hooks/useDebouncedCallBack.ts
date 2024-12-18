import React from 'react';

/**
 * Creates a debounced version of a callback function.
 *
 * @param {Function} callback - The callback function to be debounced.
 * @param {number} delay - The delay in milliseconds for the debounce.
 * @param {Array<any>} [dependencies] - Optional dependencies for the callback.
 * @returns {Function} - A debounced version of the callback function.
 */
const useDebouncedCallback = (
  callback: Function,
  delay: number,
  dependencies?: any[],
) => {
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  const comboDeps =
    dependencies && Array.isArray(dependencies)
      ? [callback, delay, ...dependencies]
      : [callback, delay];

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  /**
   * @param {...any} args - Arguments to be passed to the debounced callback.
   */

  return React.useCallback((...args) => {
    if (timeout.current != null) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, comboDeps);
};

export default useDebouncedCallback;
