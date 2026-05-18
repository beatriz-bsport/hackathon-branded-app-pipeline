import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type CancelMultipleSessionsParams,
  fetchNumberOfSessionsToCancelAPI,
  sessionKeys,
} from "@bsport/api-book";
import { DateTime } from "@bsport/datetime-manipulation";

import { fetch } from "#src/utils/fetch";

const fetchNumberOfSessionsToCancel = fetchNumberOfSessionsToCancelAPI.bind(
  null,
  fetch,
);

const numberOfCanceledSessionsQueryOptions = (
  params: CancelMultipleSessionsParams,
) => {
  return queryOptions({
    queryKey: sessionKeys.sessionsToCancelCount(params),
    queryFn: () => fetchNumberOfSessionsToCancel(params),
  });
};

export const useFetchNumberOfSessionsToCancel = (
  start: DateTime | null,
  end: DateTime | null,
  params: Omit<CancelMultipleSessionsParams, "start" | "end">,
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
