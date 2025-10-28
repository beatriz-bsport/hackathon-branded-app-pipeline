import { useCallback } from "react";

import {
  getIsoDateString,
  modifyTime,
  toDate,
  toDateTime,
} from "@bsport/datetime-manipulation";
import { fetchSubstitutionRequestsAction } from "@bsport/store-booking-substitution";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const SUBSTITUTION_REQUEST_OPEN = 1;

export const useFetchSubstitutionRequests = () => {
  const handleFetchSubstitutionRequests = useCallback(
    async ({ sessionIds }: { sessionIds: number[] }) => {
      const tomorrow = modifyTime({
        datetime: toDateTime(new Date()),
        duration: { day: 1 },
        operator: "plus",
      });

      /** @todo Ask booking team to fix offer__id_in filter to provide list of session ids */
      return fetchSubstitutionRequestsAction(fetch, {
        page_size: Math.max(1, sessionIds.length) * 10, // Make sure to encompass all concerned requests
        status: SUBSTITUTION_REQUEST_OPEN,
        offer_is_in_the_past: false,
        offer__date_start__lte: getIsoDateString(toDate(tomorrow)),
      });
    },
    [],
  );

  const [{ isLoading }, fetchSubstitutionRequests] = useAsync<
    typeof handleFetchSubstitutionRequests
  >({
    asyncFn: handleFetchSubstitutionRequests,
    dependencies: [handleFetchSubstitutionRequests],
    onFailure: console.error,
  });

  return {
    isLoading,
    fetchSubstitutionRequests,
  };
};
