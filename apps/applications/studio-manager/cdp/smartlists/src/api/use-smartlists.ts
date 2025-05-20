import { useEffect, useState } from "react";

import {
  type FetchSmartlistsParams,
  fetchAllSmartlistsAction,
  fetchSmartlistsAction,
  selectCount,
  selectSmartlists,
  useSmartlistStore,
} from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useDebouncedValue } from "#src/utils/use-debounced-value";

import {
  DEFAULT_PAGE,
  DEFAULT_ROWS_PER_PAGE,
} from "../pages/ListPage/constants";

export type SmartlistsParams = Partial<FetchSmartlistsParams>;

export function useSmartlists(params: SmartlistsParams = {}) {
  const [refetchCount, setRefetchCount] = useState(0);
  const refetch = () => setRefetchCount((prev) => prev + 1);

  const smartlists = useSmartlistStore(selectSmartlists);
  const totalItems = useSmartlistStore(selectCount);

  const debouncedSearch = useDebouncedValue(params.search ?? "");

  const fetchSmartlists = async () => {
    return fetchSmartlistsAction(fetch, {
      page: params.page ?? DEFAULT_PAGE,
      page_size: params.page_size ?? DEFAULT_ROWS_PER_PAGE,
      search: debouncedSearch.trim(),
    });
  };

  const [{ isLoading }, fetchData] = useAsync<typeof fetchSmartlists>({
    asyncFn: fetchSmartlists,
    dependencies: [params.page, params.page_size, debouncedSearch.trim()],
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refetchCount > 0) {
      fetchAllSmartlistsAction(fetch, {
        page: params.page ?? DEFAULT_PAGE,
        page_size: params.page_size ?? DEFAULT_ROWS_PER_PAGE,
      });
    }
  }, [refetchCount]);

  return {
    smartlists,
    isLoading,
    totalItems,
    refetch,
  };
}
