import { useSuspenseQuery } from "@tanstack/react-query";

import { appointmentPassesQueryOptions } from "@bsport/api-buyables/appointment-pass";
import { DEFAULT_PAGE_SIZE_PASS_OPTIONS } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

/**
 * Loads appointment-pass (PrivatePass) rows for the active passes filter picker.
 * Uses a large page size to retrieve the full company catalog in one request.
 *
 * @param search - Optional text search query forwarded to the API.
 */
export const useAppointmentPassesQuery = (search: string) => {
  return useSuspenseQuery(
    appointmentPassesQueryOptions(fetch, {
      page_size: DEFAULT_PAGE_SIZE_PASS_OPTIONS,
      ...(search ? { q: search } : {}),
    }),
  );
};
