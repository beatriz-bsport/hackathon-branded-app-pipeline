import { useSuspenseQuery } from "@tanstack/react-query";

import { retrieveGroupActivityQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useRetrieveClass = (metaActivityId: number) =>
  useSuspenseQuery(retrieveGroupActivityQueryOptions(fetch, metaActivityId));
