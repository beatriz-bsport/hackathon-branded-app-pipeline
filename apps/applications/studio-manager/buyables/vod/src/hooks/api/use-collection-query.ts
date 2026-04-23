import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchCollectionQueryOptions } from "@bsport/api-buyables/collection";

import { fetch } from "#src/utils/fetch";

export const useCollectionQuery = (id: number) =>
  useSuspenseQuery(fetchCollectionQueryOptions(fetch, { id }));
