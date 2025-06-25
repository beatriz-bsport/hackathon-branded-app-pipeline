import { useEffect, useState } from "react";

import { DEFAULT_DEBOUNCE_DELAY, useDebounce } from "@bsport/use-debounce";

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
