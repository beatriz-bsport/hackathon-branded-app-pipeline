import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type FetchNumberOfSessionsToCancelParams,
  fetchNumberOfSessionsToCancelAPI,
} from "@bsport/api-book";
import { DateTime } from "@bsport/datetime-manipulation";

import { fetch } from "#src/utils/fetch";

const fetchNumberOfSessionsToCancel = fetchNumberOfSessionsToCancelAPI.bind(
  null,
  fetch,
);

const numberOfCanceledSessionsQueryOptions = (
  params: FetchNumberOfSessionsToCancelParams,
) => {
  return queryOptions({
    queryKey: ["number_of_canceled_sessions", params],
    queryFn: () => fetchNumberOfSessionsToCancel(params),
  });
};

export const useFetchNumberOfSessionsToCancel = (
  start: DateTime | null,
  end: DateTime | null,
  params: Omit<FetchNumberOfSessionsToCancelParams, "start" | "end">,
) => {
  return useQuery({
    ...numberOfCanceledSessionsQueryOptions({
      ...params,
      start: start?.toISODate() ?? "",
      end: end?.toISODate() ?? "",
    }),
    enabled: !!start && !!end,
  });
};
