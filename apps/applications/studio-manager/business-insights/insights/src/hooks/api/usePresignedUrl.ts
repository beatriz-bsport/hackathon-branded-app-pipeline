import { useCallback, useEffect, useState } from "react";

import { useGenericToasts } from "#src/hooks/ui";
import type { DashboardType } from "#src/types/api";
import { fetchPresignedUrl } from "#src/utils/api";

type ErrorKeys = "errors.loadDashboard" | "errors.fetchFailed";

interface UsePresignedUrlState {
  /** The presigned URL for the dashboard iframe, or null if not loaded */
  iframeUrl: string | null;
  /** Whether the URL is currently being fetched */
  isLoading: boolean;
  /** Translation key for the error message, or null if no error */
  error: ErrorKeys | null;
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
  const { handleActionFailed } = useGenericToasts();
  const [state, setState] = useState<UsePresignedUrlState>({
    iframeUrl: null,
    isLoading: true,
    error: null,
  });

  const fetchUrl = useCallback(async () => {
    const setLoadingState = () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    };

    const setSuccessState = (url: string) => {
      setState({
        iframeUrl: url,
        isLoading: false,
        error: null,
      });
    };

    const setErrorState = (errorKey: ErrorKeys) => {
      setState({
        iframeUrl: null,
        isLoading: false,
        error: errorKey,
      });
    };

    try {
      setLoadingState();

      const data = await fetchPresignedUrl(dashboardType);

      if (data.presigned_url) {
        setSuccessState(data.presigned_url);
      } else {
        handleActionFailed("errors.loadDashboard");
        setErrorState("errors.loadDashboard");
      }
    } catch (error) {
      console.error(`Error fetching ${dashboardType} dashboard:`, error);
      handleActionFailed("errors.fetchFailed");
      setErrorState("errors.fetchFailed");
    }
  }, [dashboardType, handleActionFailed]);

  useEffect(() => {
    fetchUrl();
  }, [fetchUrl]);

  return state;
};
