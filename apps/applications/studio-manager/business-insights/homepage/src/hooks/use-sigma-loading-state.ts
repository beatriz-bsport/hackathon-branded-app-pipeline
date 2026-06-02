import { useCallback, useEffect, useState } from "react";

import type { DashboardType } from "@bsport/api-business-insights/embedded-analytics";
import {
  isSigmaEventWorkbookDataloaded,
  isSigmaEventWorkbookError,
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

  useEffect(() => {
    if (isLoading || iframeUrl) {
      setStatus("loading");
    }
  }, [iframeUrl, isLoading]);

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
