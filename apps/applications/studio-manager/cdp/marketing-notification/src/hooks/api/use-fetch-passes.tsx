import { fetchPassesAction } from "@bsport/store-buyables-pass";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchPassesBound = fetchPassesAction.bind(null, fetch);

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

  return {
    handleFetchPasses: fetchPasses,
    isPassesLoading,
  };
}
