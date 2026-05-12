import { useEffect, useState } from "react";

import { useTheme } from "@bsport/kaizen-primitive-core";

/**
 * Detects whether Kaizen dark-mode class is present on root nodes.
 */
const getDarkModeFromDocumentClass = (): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  return (
    document.documentElement.classList.contains("kz-dark") ||
    document.body.classList.contains("kz-dark")
  );
};

/**
 * Resolves dark-mode state for Stripe/visual adaptations in payment flow.
 *
 * Combines class-based detection (runtime DOM mutations) and theme context.
 */
export const useDarkMode = (): boolean => {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(getDarkModeFromDocumentClass);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const updateDarkMode = () => setIsDarkMode(getDarkModeFromDocumentClass());

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode || theme === "dark";
};
