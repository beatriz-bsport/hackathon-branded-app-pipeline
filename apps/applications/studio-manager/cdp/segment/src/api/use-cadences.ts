import { useEffect } from "react";

import {
  fetchCadencesAction,
  selectCadences,
  useSequentialMarketingStore,
} from "@bsport/store-cdp-sequential-marketing";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export type CadencesParams = {
  ids?: number[];
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_ROWS_PER_PAGE = 20;

/**
 * Hook to fetch and manage cadences from the sequential marketing store
 * @param params - Parameters for fetching cadences (optional ids, page, pageSize)
 * @returns Object containing cadences, loading state, total count, and refetch function
 */
export function useCadences(params: CadencesParams) {
  const cadences = useSequentialMarketingStore(selectCadences);

  const fetchCadencesData = async () => {
    return fetchCadencesAction(fetch, {
      page: params.page ?? DEFAULT_PAGE,
      page_size: params.pageSize ?? DEFAULT_ROWS_PER_PAGE,
      id__in: params.ids,
    });
  };

  const [{ isLoading }, fetchData] = useAsync({
    asyncFn: fetchCadencesData,
    dependencies: [params.ids, params.page, params.pageSize],
  });

  useEffect(() => {
    // Only fetch if we have IDs to fetch
    if ((params.ids ?? []).length > 0) {
      fetchData();
    }
  }, [fetchData]);

  return {
    cadences,
    isLoading,
  };
}
