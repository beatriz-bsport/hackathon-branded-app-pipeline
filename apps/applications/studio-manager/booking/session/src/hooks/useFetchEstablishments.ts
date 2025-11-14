import { useCallback } from "react";

import {
  fetchEstablishmentsAction,
  selectEstablishments,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchEstablishments = () => {
  const establishments = useEstablishmentStore(selectEstablishments);
  const handleFetchEstablishments = useCallback(
    async ({ establishmentIds }: { establishmentIds: number[] }) => {
      return fetchEstablishmentsAction(fetch, {
        id__in: establishmentIds,
      });
    },
    [],
  );

  const [{ isLoading }, fetchEstablishments] = useAsync<
    typeof handleFetchEstablishments
  >({
    asyncFn: handleFetchEstablishments,
    dependencies: [handleFetchEstablishments],
    onFailure: console.error,
  });

  return {
    isLoading,
    establishments,
    fetchEstablishments,
  };
};
