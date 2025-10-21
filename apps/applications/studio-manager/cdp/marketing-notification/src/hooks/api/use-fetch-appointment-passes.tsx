import { fetchAppointmentPassesAction } from "@bsport/store-buyables-appointment-pass";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchPaginatedAppointmentPassesBound = fetchAppointmentPassesAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching appointment passes list.
 *
 * This hook retrieves related appointment passes based on the authorized params that this endpoint accepets.
 *
 * @return Fetch function for fetching appointment passes
 */
export function useFetchAppointmentPasses() {
  const [{ isLoading }, fetchPaginatedAppointmentPasses] = useAsync<
    typeof fetchPaginatedAppointmentPassesBound
  >({
    asyncFn: fetchPaginatedAppointmentPassesBound,
  });

  return {
    handleFetchAppointmentPasses: fetchPaginatedAppointmentPasses,
    isAppointmentPassesLoading: isLoading,
  };
}
