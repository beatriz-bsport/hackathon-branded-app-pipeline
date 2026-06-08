import { useCallback, useEffect, useEffectEvent, useState } from "react";

import type { DashboardType } from "@bsport/api-business-insights/embedded-analytics";
import {
  isSigmaEventWorkbookDataloaded,
  isSigmaEventWorkbookError,
  isSigmaEventWorkbookLoaded,
} from "@bsport/api-business-insights/sigma";

import { usePresignedUrl } from "./usePresignedUrl";

export type SigmaLoadingStatus = "loading" | "loaded" | "error";

type UseSigmaLoadingState = {
  error: string | null;
  iframeUrl: string | null;
  onSigmaMessage: (eventData: unknown) => void;
  status: SigmaLoadingStatus;
};

export const useSigmaLoadingState = (
  dashboardType: DashboardType,
): UseSigmaLoadingState => {
  const { error, iframeUrl, isLoading } = usePresignedUrl(dashboardType);
  const [status, setStatus] = useState<SigmaLoadingStatus>("loading");
  const [hasWorkbookLoaded, setHasWorkbookLoaded] = useState(false);

  const forceLoaded = useEffectEvent(() => {
    if (status === "loading") {
      setStatus("loaded");
    }
  });

  useEffect(() => {
    if (isLoading || !iframeUrl) {
      setStatus("loading");
      setHasWorkbookLoaded(false);
    }
  }, [iframeUrl, isLoading]);

  useEffect(() => {
    if (isLoading || !iframeUrl || !hasWorkbookLoaded) return;

    const timeout = setTimeout(forceLoaded, 5_000);
    return () => {
      clearTimeout(timeout);
    };
  }, [hasWorkbookLoaded, iframeUrl, isLoading]);

  useEffect(() => {
    if (error) {
      setStatus("error");
    }
  }, [error]);

  const onSigmaMessage = useCallback((eventData: unknown) => {
    if (isSigmaEventWorkbookDataloaded(eventData)) {
      setStatus("loaded");
      return;
    }

    if (isSigmaEventWorkbookLoaded(eventData)) {
      setHasWorkbookLoaded(true);
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
