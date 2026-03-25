import { useSuspenseQuery } from "@tanstack/react-query";

import {
  PaginatedFetchSessionsParams,
  sessionStatusListQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchSessionStatusList = (
  sessionIds: number[],
  params?: Omit<PaginatedFetchSessionsParams, "id__in">,
) =>
  useSuspenseQuery(
    sessionStatusListQueryOptions(fetch, { id__in: sessionIds, ...params }),
  );
