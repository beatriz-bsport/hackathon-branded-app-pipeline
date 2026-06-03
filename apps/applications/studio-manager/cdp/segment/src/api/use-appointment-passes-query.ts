import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchAppointmentPassesParams,
  appointmentPassesQueryOptions,
} from "@bsport/api-buyables/appointment-pass";
import { DEFAULT_PAGE_SIZE_PASS_OPTIONS } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

type UseAppointmentPassesQueryOptions = {
  /**
   * When true, the catalog includes disabled appointment passes by omitting the
   * API `disabled` filter. When false, only enabled passes are returned.
   */
  includeDisabled?: boolean;
};

/**
 * Loads appointment pass rows for filter pickers.
 * Uses a large page size to retrieve the full company catalog in one request.
 *
 * @param search - Optional text search query forwarded to the API.
 * @param options - Query options; set `includeDisabled` to include archived passes.
 */
export const useAppointmentPassesQuery = (
  search: string,
  { includeDisabled = false }: UseAppointmentPassesQueryOptions = {},
) => {
  const params: FetchAppointmentPassesParams = {
    page_size: DEFAULT_PAGE_SIZE_PASS_OPTIONS,
    ...(search ? { q: search } : {}),
  };

  if (!includeDisabled) {
    params.disabled = false;
  }

  return useSuspenseQuery(appointmentPassesQueryOptions(fetch, params));
};
