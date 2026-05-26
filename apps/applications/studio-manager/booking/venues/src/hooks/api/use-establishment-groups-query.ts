import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchEstablishmentGroupsQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useEstablishmentGroupsQuery = () => {
  return useSuspenseQuery(fetchEstablishmentGroupsQueryOptions(fetch, {}));
};
