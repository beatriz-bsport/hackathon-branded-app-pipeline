import { useEffect, useMemo, useRef } from "react";

import {
  buildLocalizedIframeUrl,
  buildSigmaError,
  isSigmaEventCreateSummary,
  isSigmaEventWorkbookChartError,
  isSigmaEventWorkbookError,
  isSigmaEventWorkbookVariablesOnchange,
} from "@bsport/api-business-insights/sigma";
import { captureException } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

interface DashboardIframeProps {
  src: string;
  title: string;
  onVariablesChange?: (variables: Record<string, string>) => void;
  onCreateSummary?: (values: {
    "page-id"?: string;
    "documentation-url"?: string;
  }) => void;
}

/**
 * Reusable iframe component for displaying dashboard content.
 * Ensures consistent iframe configuration across all dashboard pages.
 * Automatically appends the current locale to the Sigma embed URL using `:lng`.
 */
export const DashboardIframe = ({
  src,
  title,
  onVariablesChange,
  onCreateSummary,
}: DashboardIframeProps) => {
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

      if (
        isSigmaEventWorkbookVariablesOnchange(eventData) &&
        onVariablesChange
      ) {
        const decoded = Object.fromEntries(
          Object.entries(eventData.workbook.variables).map(([k, v]) => [
            k,
            decodeURIComponent(v),
          ]),
        );
        onVariablesChange?.(decoded);
      }

      if (isSigmaEventCreateSummary(eventData)) {
        onCreateSummary?.(eventData.values);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onVariablesChange, onCreateSummary]);

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
