import { useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "#src/utils/i18n";

interface DashboardIframeProps {
  src: string;
  title: string;
  minHeight?: number;
}

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

/**
 * Coerce a language code to a Sigma-supported locale
 * @param languageCode - The language code to coerce
 * @returns A supported Sigma locale code
 */
const coerceSigmaLocale = (languageCode: string): string => {
  if (!languageCode) return "en";
  const lc = languageCode.toLowerCase();
  if (SUPPORTED_LOCALES.has(lc)) return lc;
  const [lang] = lc.split("-");
  if (SUPPORTED_LOCALES.has(lang)) return lang;
  return "en";
};

/**
 * Reusable iframe component for displaying dashboard content.
 * Ensures consistent iframe configuration across all dashboard pages.
 * Automatically appends the current locale to the Sigma embed URL using `:lng`.
 * Dynamically adjusts height based on Sigma's workbook:pageheight:onchange event.
 */
export const DashboardIframe = ({
  src,
  title,
  minHeight = 400,
}: DashboardIframeProps) => {
  const { i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(minHeight);

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

  useEffect(() => {
    /**
     * Listen for Sigma workbook height change events
     * Sigma sends postMessage events with the workbook height
     */
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from Sigma
      if (!event.data || typeof event.data !== "object") return;

      // Sigma sends events with type 'workbook:pageheight:onchange'
      if (
        event.data.type === "workbook:pageheight:onchange" &&
        typeof event.data.pageHeight === "number"
      ) {
        // Add some padding for safety (20px)
        const newHeight = Math.max(event.data.pageHeight + 20, minHeight);
        setIframeHeight(newHeight);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [minHeight]);

  return (
    <iframe
      ref={iframeRef}
      src={localizedSrc}
      className="w-full border-0"
      style={{ height: iframeHeight }}
      title={title}
      allowFullScreen
      loading="lazy"
    />
  );
};
