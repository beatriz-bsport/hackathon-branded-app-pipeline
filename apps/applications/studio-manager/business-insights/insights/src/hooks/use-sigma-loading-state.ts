import { useCallback, useEffect, useEffectEvent, useState } from "react";

import type { DashboardType } from "@bsport/api-business-insights/embedded-analytics";
import {
  isSigmaEventWorkbookDataloaded,
  isSigmaEventWorkbookError,
  isSigmaEventWorkbookLoaded,
} from "@bsport/api-business-insights/sigma";

import { usePresignedUrl } from "#src/hooks/api";

export type SigmaLoadingStatus = "loading" | "loaded" | "error";

type UseSigmaLoadingState = {
  error: string | null;
  iframeUrl: string | null;
  onSigmaMessage: (eventData: unknown) => void;
  status: SigmaLoadingStatus;
};

export const useSigmaLoadingState = (
  dashboardType: DashboardType,
  { enabled = true }: { enabled?: boolean } = {},
): UseSigmaLoadingState => {
  const { error, iframeUrl, isLoading } = usePresignedUrl(dashboardType, {
    enabled,
  });
  const [status, setStatus] = useState<SigmaLoadingStatus>("loading");

  const forceLoaded = useEffectEvent(() => {
    if (status === "loading") {
      setStatus("loaded");
    }
  });

  useEffect(() => {
    if (isLoading || !iframeUrl) {
      setStatus("loading");
      return;
    }

    const timeout = setTimeout(forceLoaded, 5_000);
    return () => clearTimeout(timeout);
  }, [iframeUrl, isLoading]);

  useEffect(() => {
    if (error) {
      setStatus("error");
    }
  }, [error]);

  const onSigmaMessage = useCallback((eventData: unknown) => {
    // workbook:loaded fires when metadata is ready but elements haven't been
    // evaluated yet. In fixed-height iframes with no scrolling, Sigma may never
    // send this event if off-screen elements block completion. Fall back to
    // workbook:dataloaded which fires once visible data is done.
    if (
      isSigmaEventWorkbookLoaded(eventData) ||
      isSigmaEventWorkbookDataloaded(eventData)
    ) {
      setStatus("loaded");
      return;
    }

    if (isSigmaEventWorkbookError(eventData)) {
      setStatus("error");
    }
  }, []);

  return {
    error,
    iframeUrl,
    onSigmaMessage,
    status,
  };
};
