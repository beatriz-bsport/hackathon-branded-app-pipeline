import { type RefObject, useEffect, useState } from "react";

export type ContainerSize = { width: number; height: number };

export const useContainerSize = (
  ref: RefObject<HTMLElement | null>,
): ContainerSize => {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // Round so sub-pixel scroll/zoom noise doesn't trigger resetTransform
      // on the consuming canvas every frame.
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
};
