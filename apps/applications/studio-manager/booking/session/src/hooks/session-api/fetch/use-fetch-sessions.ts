import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type FetchSessionsParams,
  fetchMinimalSessionsAPI,
} from "@bsport/api-book";
import type { DateTime } from "@bsport/datetime-manipulation";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

const fetchMinimalSessions = fetchMinimalSessionsAPI.bind(null, fetch);

const groupSessionsQueryOptions = (params: FetchSessionsParams) => {
  return queryOptions({
    queryKey: [`${SESSIONS_QUERY_KEY}_group`, params],
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
