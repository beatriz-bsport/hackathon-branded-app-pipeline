import { useRef } from "react";

/**
 * A hook that provides utilities to manage document overflow.
 *
 * @returns An object containing:
 * - overflowValue: The current overflow value as a string
 * - setOverflowHidden: Function to set document overflow to 'hidden' (prevents scrolling)
 * - resetOverflow: Function to restore the original overflow value
 */
export const useDocumentOverflow = () => {
  const overflowValue = useRef("");

  const setOverflowHidden = () => {
    overflowValue.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };

  const resetOverflow = () => {
    document.body.style.overflow = overflowValue.current;
  };

  return {
    overflowValue: overflowValue.current,
    setOverflowHidden,
    resetOverflow,
  };
};
