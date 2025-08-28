import { useMemo } from "react";

import { useTranslation } from "#src/utils/i18n";

interface DashboardIframeProps {
  src: string;
  title: string;
}

/**
 * Reusable iframe component for displaying dashboard content.
 * Ensures consistent iframe configuration across all dashboard pages.
 * Automatically appends the current locale to the Sigma embed URL using `:lng`.
 */
export const DashboardIframe = ({ src, title }: DashboardIframeProps) => {
  const { i18n } = useTranslation();

  const toSigmaLocale = (languageCode: string): string => {
    if (!languageCode) return "en";
    const parts = languageCode.split("-");
    if (parts.length === 1) return parts[0].toLowerCase();
    return `${parts[0].toLowerCase()}-${parts[1].toLowerCase()}`;
  };

  const localizedSrc = useMemo(() => {
    const lng = toSigmaLocale(i18n.language);
    try {
      const urlObj = new URL(src);
      urlObj.searchParams.set(":lng", lng);
      return urlObj.toString();
    } catch {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}:lng=${encodeURIComponent(lng)}`;
    }
  }, [src, i18n.language]);

  return (
    <iframe
      src={localizedSrc}
      className="w-full h-full border-0"
      title={title}
      allowFullScreen
      loading="lazy"
    />
  );
};
