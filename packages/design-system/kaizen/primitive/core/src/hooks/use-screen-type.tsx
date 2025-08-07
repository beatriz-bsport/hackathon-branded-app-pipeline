import { useEffect, useState } from "react";

// 1. Use commonly accepted breakpoints
type ScreenType =
  | "extra-small-mobile"
  | "small-mobile"
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "small-desktop"
  | "desktop"
  | "large-desktop";

const BREAKPOINTS = [
  { min: 0, max: 319, type: "extra-small-mobile" }, // up to iPhone SE
  { min: 320, max: 479, type: "small-mobile" }, // small phones
  { min: 480, max: 600, type: "mobile" }, // regular phones
  { min: 601, max: 768, type: "tablet-portrait" }, // tablet portrait
  { min: 769, max: 1024, type: "tablet-landscape" }, // tablet landscape
  { min: 1025, max: 1280, type: "small-desktop" }, // small desktop
  { min: 1281, max: 1440, type: "desktop" }, // standard desktop
  { min: 1441, max: Infinity, type: "large-desktop" }, // large screens
] as const;

function getScreenType(width: number): ScreenType {
  return (
    BREAKPOINTS.find((b) => width >= b.min && width <= b.max)?.type || "desktop"
  );
}

function isMobileDevice(screenType: ScreenType): boolean {
  return (
    screenType === "extra-small-mobile" ||
    screenType === "small-mobile" ||
    screenType === "mobile"
  );
}
function isTabletDevice(screenType: ScreenType): boolean {
  return screenType === "tablet-portrait" || screenType === "tablet-landscape";
}
function isDesktopDevice(screenType: ScreenType): boolean {
  return (
    screenType === "small-desktop" ||
    screenType === "desktop" ||
    screenType === "large-desktop"
  );
}
function getIsResponsiveRequired(screenType: ScreenType): boolean {
  return isMobileDevice(screenType) || isTabletDevice(screenType);
}

export const useScreenType = () => {
  // 2. SSR safe: window might be undefined
  const getWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 1024;

  const [width, setWidth] = useState<number>(getWidth());
  const [screenType, setScreenType] = useState<ScreenType>(
    getScreenType(getWidth()),
  );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWidth(w);
      setScreenType(getScreenType(w));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenType,
    width,
    isMobile: isMobileDevice(screenType),
    isTablet: isTabletDevice(screenType),
    isDesktop: isDesktopDevice(screenType),
    isResponsiveRequired: getIsResponsiveRequired(screenType),
  };
};
