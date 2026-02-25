import { useCallback, useRef } from "react";

export function useScrollReset(isMobile?: boolean) {
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    const ref = isMobile ? mobileRef : desktopRef;
    ref.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [isMobile]);

  return { mobileRef, desktopRef, scrollToTop };
}
