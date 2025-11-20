import { useCallback } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { modifyTime, toDate, toDateTime } from "@bsport/datetime-manipulation";
import { fetchSubstitutionRequestsAction } from "@bsport/store-booking-substitution";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useCompanyTimezone } from "#src/utils/stores-interface";

const SUBSTITUTION_REQUEST_OPEN = 1;

export const useFetchSubstitutionRequests = () => {
  const companyTimezone = useCompanyTimezone();

  const handleFetchSubstitutionRequests = useCallback(
    async ({ sessionIds }: { sessionIds: number[] }) => {
      const tomorrow = toDate(
        modifyTime({
          datetime: toDateTime(new Date()),
          duration: { day: 1 },
          operator: "plus",
        }),
      );

      /** @todo Ask booking team to fix offer__id_in filter to provide list of session ids */
      /** @todo Change to /offer/with_pending_replacement_request/ endpoint */
      return fetchSubstitutionRequestsAction(fetch, {
        page_size: Math.max(1, sessionIds.length) * 10, // Make sure to encompass all concerned requests
        status: SUBSTITUTION_REQUEST_OPEN,
        offer_is_in_the_past: false,
        offer__date_start__lte: formatDateTime(
          tomorrow.toISOString(),
          DATETIME_FORMATS.ISO_DATE,
          { timeZone: companyTimezone },
        ),
      });
    },
    [companyTimezone],
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
