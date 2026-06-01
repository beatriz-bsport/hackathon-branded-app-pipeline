import { type FC, useEffect, useMemo, useRef, useState } from "react";

import {
  buildLocalizedIframeUrl,
  buildSigmaError,
  isSigmaEventWorkbookChartError,
  isSigmaEventWorkbookError,
  isSigmaEventWorkbookPageheightOnchange,
} from "@bsport/api-business-insights/sigma";
import { useMatchMedia } from "@bsport/kaizen-primitive-core";
import { captureException } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

interface DashboardIframeProps {
  src: string;
  title: string;
  onSigmaMessage?: (eventData: unknown) => void;
  /** Placeholder height before first Sigma height event (desktop) */
  loadingHeight?: number;
  /** Placeholder height before first Sigma height event (mobile <600px) */
  loadingMobileHeight?: number;
  /** Horizontal translation applied (visual alignment tweak) */
  leftTranslate?: number;
}

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
  onSigmaMessage,
}) => {
  const { i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = !useMatchMedia("(min-width: 600px)"); // Match Sigma's mobile breakpoint

  // Use dynamic height from Sigma events
  const initialLoadingHeight =
    isMobile && loadingMobileHeight ? loadingMobileHeight : loadingHeight;
  const [iframeHeight, setIframeHeight] = useState(initialLoadingHeight);

  const localizedSrc = useMemo(() => {
    return buildLocalizedIframeUrl({
      baseIframeUrl: src,
      language: i18n.language,
      additionalParams: {
        ":responsive_height": "true",
        ":hide_element_interactions": "true",
      },
    });
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

      const eventData = event.data;

      onSigmaMessage?.(eventData);

      if (isSigmaEventWorkbookPageheightOnchange(eventData)) {
        setIframeHeight(eventData.pageHeight);
      }

      if (isSigmaEventWorkbookChartError(eventData)) {
        captureException(buildSigmaError(eventData));
      }

      if (isSigmaEventWorkbookError(eventData)) {
        captureException(buildSigmaError(eventData));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSigmaMessage]);

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
      loading="eager"
    />
  );
};
