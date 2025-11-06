import {
  type FetchSmartlistsParams,
  type SmartlistOptions,
  fetchSearchSmartlistsAction,
  fetchSmartlistsAction,
} from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchSmartlistsBound = fetchSmartlistsAction.bind(null, fetch);

const searchSmartlistsBound = fetchSearchSmartlistsAction.bind(null, fetch);

/**
 * Hook for fetching smartlists data.
 *
 * This hook provides functionality to fetch smartlist data by their IDs.
 * It handles the API call and manages the loading state for the fetch operation.
 * The hook accepts an array of smartlist IDs and retrieves their corresponding
 * smartlist information for use in marketing notifications or other CDP features.
 *
 * @returns Object containing the fetch function for smartlists
 */
export function useFetchSmartlists() {
  const [{ isLoading }, fetchSmartlists] = useAsync<
    typeof fetchSmartlistsBound
  >({
    asyncFn: fetchSmartlistsBound,
  });

  /**
   * Fetches smartlists by their IDs.
   *
   * @param smartlistIds - Array of smartlist IDs to fetch data for
   */
  const handleFetchSmartlists = ({
    smartlistIds,
  }: {
    smartlistIds: number[];
  }) => {
    fetchSmartlists({
      id__in: smartlistIds,
      page: 1,
      page_size: smartlistIds.length,
    });
  };

  const handleSearchSmartlists = async (
    query: string,
    params: Required<FetchSmartlistsParams> & SmartlistOptions,
  ) => {
    return await searchSmartlistsBound({
      ...params,
      search: query.trim() ?? "",
    });
  };

  return {
    handleFetchSmartlists,
    handleSearchSmartlists,
    isSmartlistsLoading: isLoading,
  };
}
