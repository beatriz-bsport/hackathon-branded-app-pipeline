import { useEffect, useMemo, useRef } from "react";

import {
  buildLocalizedIframeUrl,
  buildSigmaError,
  isSigmaEventWorkbookChartError,
  isSigmaEventWorkbookError,
} from "@bsport/api-business-insights/sigma";
import { captureException } from "@bsport/sm-backbone";

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

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const localizedSrc = useMemo(() => {
    return buildLocalizedIframeUrl({
      baseIframeUrl: src,
      language: i18n.language,
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

      if (isSigmaEventWorkbookChartError(eventData)) {
        captureException(buildSigmaError(eventData));
      }

      if (isSigmaEventWorkbookError(eventData)) {
        captureException(buildSigmaError(eventData));
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={localizedSrc}
      className="w-full h-full border-0"
      title={title}
      allowFullScreen
      loading="lazy"
    />
  );
};
