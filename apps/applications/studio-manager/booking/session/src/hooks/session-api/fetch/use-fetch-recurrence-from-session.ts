import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchRecurrenceFromSessionAPI, sessionKeys } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const fetchRecurrenceFromSession = fetchRecurrenceFromSessionAPI.bind(
  null,
  fetch,
);

const recurrenceFromSessionQueryOptions = (sessionId: number) => {
  return queryOptions({
    queryKey: sessionKeys.recurrence(sessionId),
    queryFn: () => fetchRecurrenceFromSession(sessionId),
  });
};

export const useFetchRecurrenceFromSession = (sessionId: number) => {
  return useQuery({
    ...recurrenceFromSessionQueryOptions(sessionId),
  });
};
