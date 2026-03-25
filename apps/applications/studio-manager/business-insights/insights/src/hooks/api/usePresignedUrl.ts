import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  type DashboardType,
  fetchPresignedUrlQueryOptions,
} from "@bsport/api-business-insights/embedded-analytics";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const displayToastError = (message: string) =>
  toast({
    status: "critical",
    icon: "alert-circle",
    title: message,
    buttonIcon: "x-close",
  });

interface UsePresignedUrlState {
  /** The presigned URL for the dashboard iframe, or null if not loaded */
  iframeUrl: string | null;
  /** Whether the URL is currently being fetched */
  isLoading: boolean;
  /** Translation error message, or null if no error */
  error: string | null;
}

/**
 * Hook to fetch and manage presigned URL for dashboard iframes.
 * Automatically displays toast notifications for errors.
 *
 * @param dashboardType - The type of dashboard to fetch URL for
 * @returns State object with iframe URL, loading status, and error state
 */
export const usePresignedUrl = (
  dashboardType: DashboardType,
): UsePresignedUrlState => {
  const { t, i18n } = useTranslation("insights");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, error, isLoading, isSuccess, isError } = useQuery({
    ...fetchPresignedUrlQueryOptions(fetch, { dashboardType }),
    staleTime: 5 * 60 * 1000, // or align this with the presigned URL TTL
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    throwOnError: () => {
      return false;
    },
  });

  useEffect(() => {
    if (isError && !data?.presigned_url) {
      const errorMessage = t("errors.fetchFailed");
      displayToastError(errorMessage);
      setErrorMessage(errorMessage);
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.presigned_url, error, isError, i18n.language]);

  useEffect(() => {
    if (isSuccess && !data?.presigned_url) {
      const errorMessage = t("errors.loadDashboard");
      displayToastError(errorMessage);
      setErrorMessage(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, i18n.language]);

  useEffect(() => {
    if (data?.presigned_url) {
      setErrorMessage(null);
    }
  }, [data?.presigned_url]);

  return {
    error: errorMessage,
    iframeUrl: data?.presigned_url ?? null,
    isLoading,
  };
};
