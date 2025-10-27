import {
  type FetchEstablishmentParams,
  fetchEstablishmentGroupsAction,
  searchEstablishmentGroupsAction,
} from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchEstablishmentsBound = fetchEstablishmentGroupsAction.bind(
  null,
  fetch,
);

export const useFetchEstablishments = () => {
  const [{ isLoading: isEstablishmentsLoading }, fetchEstablishments] =
    useAsync<typeof fetchEstablishmentsBound>({
      asyncFn: fetchEstablishmentsBound,
    });

  const handleFetchEstablishments = (params: FetchEstablishmentParams) => {
    fetchEstablishments(params);
  };

  const handleSearchEstablishments = async (
    query: string,
    params?: FetchEstablishmentParams,
  ) => {
    return await searchEstablishmentGroupsAction(fetch, {
      q: query,
      ...params,
    });
  };

  return {
    handleFetchEstablishments,
    handleSearchEstablishments,
    isEstablishmentsLoading,
  };
};
