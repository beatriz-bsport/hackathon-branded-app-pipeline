import { type FC, useEffect, useMemo, useRef, useState } from "react";

import { useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

interface DashboardIframeProps {
  src: string;
  title: string;
  /** Placeholder height before first Sigma height event (desktop) */
  loadingHeight?: number;
  /** Placeholder height before first Sigma height event (mobile <600px) */
  loadingMobileHeight?: number;
  /** Horizontal translation applied (visual alignment tweak) */
  leftTranslate?: number;
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
  "nl-nl",
  "ru",
  "th",
  "ja",
  "pl",
]);

const DEFAULT_SIGMA_LOCALE_BY_LANGUAGE = new Map([["nl", "nl-nl"]]);

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
  const mappedLocale = DEFAULT_SIGMA_LOCALE_BY_LANGUAGE.get(lang);
  if (mappedLocale) return mappedLocale;
  return "en";
};

/**
 * Reusable iframe component for displaying dashboard content.
 * Ensures consistent iframe configuration across all dashboard pages.
 * Automatically appends the current locale to the Sigma embed URL using `:lng`.
 * Dynamically adjusts height based on Sigma's workbook:pageheight:onchange event.
 */
export const DashboardIframe: FC<DashboardIframeProps> = ({
  src,
  title,
  loadingHeight = 400,
  loadingMobileHeight,
  leftTranslate = 0,
}) => {
  const { i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = !useMatchMedia("(min-width: 600px)"); // Match Sigma's mobile breakpoint

  // Use dynamic height from Sigma events
  const initialLoadingHeight =
    isMobile && loadingMobileHeight ? loadingMobileHeight : loadingHeight;
  const [iframeHeight, setIframeHeight] = useState(initialLoadingHeight);

  const localizedSrc = useMemo(() => {
    const lng = coerceSigmaLocale(i18n.language);
    try {
      const urlObj = new URL(src);
      urlObj.searchParams.set(":lng", lng);
      urlObj.searchParams.set(":responsive_height", "true");
      urlObj.searchParams.set(":hide_element_interactions", "true");
      return urlObj.toString();
    } catch {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}:lng=${encodeURIComponent(lng)}&:responsive_height=true&:hide_element_interactions=true`;
    }
  }, [src, i18n.language]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from this iframe
      if (
        !iframeRef.current ||
        event.source !== iframeRef.current.contentWindow ||
        !event.data ||
        typeof event.data !== "object"
      ) {
        return;
      }

      const { type, pageHeight } = event.data as {
        type?: string;
        pageHeight?: number;
      };

      if (
        type === "workbook:pageheight:onchange" &&
        typeof pageHeight === "number"
      ) {
        setIframeHeight(Math.ceil(pageHeight));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={localizedSrc}
      className="w-full border-0"
      style={{
        height: iframeHeight,
        transform: `translate(${leftTranslate}px, 0px)`,
        width: `calc(100% + ${2 * Math.abs(leftTranslate)}px)`,
      }}
      title={title}
      allowFullScreen
      scrolling="no"
      loading="lazy"
    />
  );
};
