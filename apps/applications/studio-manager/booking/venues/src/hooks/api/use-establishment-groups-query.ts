import { useSuspenseQuery } from "@tanstack/react-query";

import { searchEstablishmentGroupsQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useEstablishmentGroupsQuery = (searchQuery?: string) => {
  const q = searchQuery?.trim() ?? "";
  return useSuspenseQuery(searchEstablishmentGroupsQueryOptions(fetch, { q }));
};
