import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildLocalizedIframeUrl,
  buildSigmaError,
  isSigmaEventCreateSummary,
  isSigmaEventWorkbookChartError,
  isSigmaEventWorkbookError,
  isSigmaEventWorkbookPageheightOnchange,
  isSigmaEventWorkbookVariablesOnchange,
} from "@bsport/api-business-insights/sigma";
import { captureException } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export interface DashboardIframeProps {
  src: string;
  title: string;
  onSigmaMessage?: (eventData: unknown) => void;
  onVariablesChange?: (variables: Record<string, string>) => void;
  onCreateSummary?: (values: {
    "documentation-url"?: string;
    "element-ids"?: string[][];
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
  onSigmaMessage,
  onVariablesChange,
  onCreateSummary,
}: DashboardIframeProps) => {
  const { i18n } = useTranslation();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number | undefined>(
    undefined,
  );

  const localizedSrc = useMemo(() => {
    return buildLocalizedIframeUrl({
      baseIframeUrl: src,
      language: i18n.language,
      additionalParams: { ":responsive_height": "true" },
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
  }, [onSigmaMessage, onVariablesChange, onCreateSummary]);

  return (
    <iframe
      ref={iframeRef}
      src={localizedSrc}
      className="w-full border-0"
      style={{ height: iframeHeight, overflow: "hidden" }}
      title={title}
      allowFullScreen
      loading="lazy"
    />
  );
};
