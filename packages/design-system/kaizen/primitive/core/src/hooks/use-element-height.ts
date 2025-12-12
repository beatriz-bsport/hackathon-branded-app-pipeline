import { type RefObject, useEffect, useState } from "react";

export function useElementHeight<T extends HTMLElement>({
  ref,
  enabled = true,
}: {
  ref: RefObject<T | null>;
  enabled?: boolean;
}): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref?.current;
    if (!enabled || !element || typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver((entries) => {
      const totalHeight = entries.reduce((total, entry) => {
        return total + (entry.borderBoxSize?.[0]?.blockSize ?? 0);
      }, 0);
      setHeight(totalHeight);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [ref, enabled]);

  return height;
}
