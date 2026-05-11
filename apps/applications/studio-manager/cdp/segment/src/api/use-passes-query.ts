import { useSuspenseQuery } from "@tanstack/react-query";

import { passesQueryOptions } from "@bsport/api-buyables/pass";
import { DEFAULT_PAGE_SIZE_PASS_OPTIONS } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

export const usePassesQuery = (search: string) => {
  return useSuspenseQuery(
    passesQueryOptions(fetch, {
      disabled: false,
      page_size: DEFAULT_PAGE_SIZE_PASS_OPTIONS,
      ...(search ? { q: search } : {}),
    }),
  );
};
