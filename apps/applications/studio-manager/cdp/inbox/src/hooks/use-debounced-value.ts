import { useEffect, useState } from "react";

import { DEFAULT_DEBOUNCE_DELAY, useDebounce } from "@bsport/use-debounce";

/**
 * Returns a debounced copy of `value` that only updates once `delay` ms have
 * passed without a change. Value-debounce pattern: the *setter* is debounced
 * while the raw input stays immediate, so the field feels responsive while the
 * derived value (used to drive a query) settles. Mirrors the member-search
 * precedent in the segment app.
 */
export const useDebouncedValue = <T = string>(
  value: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY,
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSetValue = useDebounce(setDebouncedValue, delay);

  useEffect(() => {
    debouncedSetValue(value);
  }, [value, debouncedSetValue]);

  return debouncedValue;
};
