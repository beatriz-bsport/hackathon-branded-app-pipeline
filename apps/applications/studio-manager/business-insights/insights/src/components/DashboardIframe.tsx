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

  // https://help.sigmacomputing.com/docs/manage-workbook-localization#supported-languages-and-locales
  const SUPPORTED_LOCALES = new Set([
    "en",
    "fr", // fr-fr isn't supported
    "fr-ca",
    "es",
    "de",
    "it",
    "pt",
    "ru",
    "th",
    "ja",
    "pl",
  ]);

  const coerceSigmaLocale = (languageCode: string): string => {
    if (!languageCode) return "en";
    const lc = languageCode.toLowerCase();
    if (SUPPORTED_LOCALES.has(lc)) return lc;
    const [lang] = lc.split("-");
    if (SUPPORTED_LOCALES.has(lang)) return lang;
    return "en";
  };

  const localizedSrc = useMemo(() => {
    const lng = coerceSigmaLocale(i18n.language);
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
