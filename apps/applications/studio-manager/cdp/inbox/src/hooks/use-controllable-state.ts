import { useCallback, useState } from "react";

/**
 * Controlled/uncontrolled state pattern: when `value` is provided the caller
 * owns the state and we only emit `onChange`; otherwise an internal state is
 * used so the component works standalone (e.g. in Storybook).
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [isControlled ? value : internalValue, setValue];
}
