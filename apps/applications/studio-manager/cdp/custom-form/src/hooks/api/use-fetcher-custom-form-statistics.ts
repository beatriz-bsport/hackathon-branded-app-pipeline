import type { PaginatedResponse } from "@bsport/store-base";
import {
  type CustomFormStatistics,
  fetchCustomFormStatisticsAction,
} from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchCustomFormStatisticsParams = {
  onSuccess?: (statistics: PaginatedResponse<CustomFormStatistics>) => void;
  onFailure?: (error: Error) => void;
};

const fetchFormStatistics = fetchCustomFormStatisticsAction.bind(null, fetch);

/**
 * Hook for fetching custom form related statistics.
 * @param params - Parameters for fetching the custom form statistics
 * @param params.onSuccess - Callback function to be called when the custom form statistics are fetched successfully
 * @param params.onFailure - Callback function to be called when the custom form statistics fetching fails
 * @returns Object containing the loading state and the fetch function
 */
export function useFetcherCustomFormStatistics({
  onSuccess,
  onFailure,
}: UseFetchCustomFormStatisticsParams = {}) {
  const [{ isLoading }, triggerFetchFormStatistics] = useAsync<
    typeof fetchFormStatistics
  >({
    asyncFn: fetchFormStatistics,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    fetchFormStatistics: triggerFetchFormStatistics,
  };
}
