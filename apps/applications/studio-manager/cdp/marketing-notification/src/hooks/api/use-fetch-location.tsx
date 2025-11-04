import {
  type FetchEstablishmentParams,
  fetchEstablishmentsAction,
  searchEstablishmentsAction,
} from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchLocationsBound = fetchEstablishmentsAction.bind(null, fetch);

export const useFetchLocations = () => {
  const [{ isLoading: isLocationsLoading }, fetchLocations] = useAsync<
    typeof fetchLocationsBound
  >({
    asyncFn: fetchLocationsBound,
  });

  const handleFetchLocations = (params: FetchEstablishmentParams) => {
    fetchLocations(params);
  };

  const handleSearchLocations = async (
    query: string,
    params?: FetchEstablishmentParams,
  ) => {
    return await searchEstablishmentsAction(fetch, {
      q: query,
      ...params,
    });
  };

  return {
    handleFetchLocations,
    handleSearchLocations,
    isLocationsLoading,
  };
};
