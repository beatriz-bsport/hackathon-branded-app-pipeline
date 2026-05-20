import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchEstablishmentsQueryOptions } from "@bsport/api-book";

import { VENUES_PAGE_SIZE } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

export const useVenuesListQuery = () => {
  return useSuspenseQuery(
    fetchEstablishmentsQueryOptions(fetch, {
      page_size: VENUES_PAGE_SIZE,
      disabled: false,
    }),
  );
};
