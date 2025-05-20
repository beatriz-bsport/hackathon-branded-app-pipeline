import { useEffect, useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

const DEFAULT_DELAY = 350;

export const useDebouncedValue = <T = string>(
  value: T,
  delay: number = DEFAULT_DELAY,
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSetValue = useDebounce(setDebouncedValue, delay);

  useEffect(() => {
    debouncedSetValue(value);
  }, [value]);

  return debouncedValue;
};
