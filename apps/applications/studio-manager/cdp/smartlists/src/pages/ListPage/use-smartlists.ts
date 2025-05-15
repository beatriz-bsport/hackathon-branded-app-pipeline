import { useEffect } from "react";

import {
  fetchSmartlistsAction,
  selectCount,
  selectSmartlists,
  useSmartlistStore,
} from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useDebouncedValue } from "#src/utils/use-debounced-value";

import { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } from "./constants";

export type SmartlistsParams = {
  page?: number;
  page_size?: number;
  search?: string;
};

export function useSmartlists(params: SmartlistsParams = {}) {
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

  return {
    smartlists,
    isLoading,
    totalItems,
  };
}
