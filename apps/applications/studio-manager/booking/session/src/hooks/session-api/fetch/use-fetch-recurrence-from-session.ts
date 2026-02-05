import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchRecurrenceFromSessionAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const fetchRecurrenceFromSession = fetchRecurrenceFromSessionAPI.bind(
  null,
  fetch,
);

const recurrenceFromSessionQueryOptions = (sessionId: number) => {
  return queryOptions({
    queryKey: [`recurrence_from_session`, sessionId],
    queryFn: () => fetchRecurrenceFromSession(sessionId),
  });
};

export const useFetchRecurrenceFromSession = (sessionId: number) => {
  return useQuery({
    ...recurrenceFromSessionQueryOptions(sessionId),
  });
};
