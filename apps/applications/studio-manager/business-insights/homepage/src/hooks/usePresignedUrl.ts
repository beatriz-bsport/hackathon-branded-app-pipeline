import { useEffect, useState } from "react";

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
 *
 * @param dashboardType - The type of dashboard to fetch URL for
 * @returns State object with iframe URL, loading status, and error state
 */
export const usePresignedUrl = (
  dashboardType: DashboardType,
): UsePresignedUrlState => {
  const [state, setState] = useState<UsePresignedUrlState>({
    iframeUrl: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchUrl = async () => {
      try {
        if (!isMounted) return;

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await fetchPresignedUrl(dashboardType);

        if (data.presigned_url) {
          setState({
            iframeUrl: data.presigned_url,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            iframeUrl: null,
            isLoading: false,
            error: "errors.loadDashboard",
          });
        }
      } catch (error) {
        if (!isMounted) return;

        console.error(`Error fetching ${dashboardType} dashboard:`, error);
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
  }, [dashboardType]);

  return state;
};
