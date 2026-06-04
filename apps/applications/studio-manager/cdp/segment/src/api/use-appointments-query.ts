import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchAppointmentsParams,
  fetchAppointmentsQueryOptions,
} from "@bsport/api-book/appointments";

import { fetch } from "#src/utils/fetch";

type UseAppointmentsQueryOptions = {
  /**
   * When true, the catalog includes unavailable (disabled) appointments by
   * omitting the API `available` filter. When false, only available appointments
   * are returned.
   */
  includeDisabled?: boolean;
};

/**
 * Loads appointment rows (PrivateService) for total-appointments filter pickers.
 *
 * @param options - Query options; set `includeDisabled` to include archived appointments.
 */
export const useAppointmentsQuery = ({
  includeDisabled = false,
}: UseAppointmentsQueryOptions = {}) => {
  const params: FetchAppointmentsParams = {
    mine: true,
  };

  if (!includeDisabled) {
    params.available = true;
  }

  return useSuspenseQuery(fetchAppointmentsQueryOptions(fetch, params));
};
