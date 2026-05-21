import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type FetchSessionsParams,
  fetchMinimalSessionsAPI,
  sessionKeys,
} from "@bsport/api-book";
import type { DateTime } from "@bsport/datetime-manipulation";

import { fetch } from "#src/utils/fetch";

const fetchMinimalSessions = fetchMinimalSessionsAPI.bind(null, fetch);

const groupSessionsQueryOptions = (params: FetchSessionsParams) => {
  return queryOptions({
    queryKey: sessionKeys.minimalList(params),
    queryFn: () =>
      fetchMinimalSessions({
        ...params,
      }),
  });
};

export const useFetchSessions = (
  start: DateTime | null,
  end: DateTime | null,
  params: FetchSessionsParams,
) => {
  return useQuery({
    ...groupSessionsQueryOptions({
      ...params,
      min_date: start?.toISODate() ?? "",
      max_date: end?.toISODate() ?? "",
    }),
    enabled: !!start && !!end,
  });
};
