import { useSuspenseQuery } from "@tanstack/react-query";

import { passesQueryOptions } from "@bsport/api-buyables/pass";
import { DEFAULT_PAGE_SIZE_PASS_OPTIONS } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

/**
 * Loads payment-pack (pass) rows for pickers. `DEFAULT_PAGE_SIZE_PASS_OPTIONS`
 * is sized for a single-page full catalog fetch so `payment_packs` ids in the
 * bookings filter (filter 22) can reference any pass returned by the API in
 * one round trip; the contract only requires `number[]` on save.
 */
export const usePassesQuery = (search: string) => {
  return useSuspenseQuery(
    passesQueryOptions(fetch, {
      disabled: false,
      page_size: DEFAULT_PAGE_SIZE_PASS_OPTIONS,
      ...(search ? { q: search } : {}),
    }),
  );
};
