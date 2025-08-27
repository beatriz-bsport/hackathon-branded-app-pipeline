import { useEffect, useState } from "react";

import { useGenericToasts } from "#src/hooks/ui";
import type { DashboardType } from "#src/types/api";
import { fetchPresignedUrl } from "#src/utils/api";

export type ErrorKeys = "errors.loadDashboard" | "errors.fetchFailed";

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

  useEffect(() => {
    let isMounted = true;

    const fetchUrl = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await fetchPresignedUrl(dashboardType);

        if (!isMounted) return;

        if (data.presigned_url) {
          setState({
            iframeUrl: data.presigned_url,
            isLoading: false,
            error: null,
          });
        } else {
          handleActionFailed("errors.loadDashboard");
          setState({
            iframeUrl: null,
            isLoading: false,
            error: "errors.loadDashboard",
          });
        }
      } catch (error) {
        if (!isMounted) return;

        console.error(`Error fetching ${dashboardType} dashboard:`, error);
        handleActionFailed("errors.fetchFailed");
        setState({
          iframeUrl: null,
          isLoading: false,
          error: "errors.fetchFailed",
        });
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [dashboardType, handleActionFailed]);

  return state;
};
