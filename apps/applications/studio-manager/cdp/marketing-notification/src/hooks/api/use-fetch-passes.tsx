import {
  type FetchPassesParams,
  fetchPassesAction,
  searchPassesAction,
} from "@bsport/store-buyables-pass";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchPassesBound = fetchPassesAction.bind(null, fetch);

const searchPassesBound = searchPassesAction.bind(null, fetch);

/**
 * Hook for fetching passes list.
 *
 * This hook retrieves related passes based on the authorized params that this endpoint accepets.
 *
 * @return Fetch function for fetching passes
 */
export function useFetchPasses() {
  const [{ isLoading: isPassesLoading }, fetchPasses] = useAsync<
    typeof fetchPassesBound
  >({
    asyncFn: fetchPassesBound,
  });

  const handleSearchPasses = async (
    query: string,
    params?: FetchPassesParams,
  ) => {
    return await searchPassesBound({
      q: query,
      ...params,
    });
  };

  return {
    handleFetchPasses: fetchPasses,
    handleSearchPasses,
    isPassesLoading,
  };
}
