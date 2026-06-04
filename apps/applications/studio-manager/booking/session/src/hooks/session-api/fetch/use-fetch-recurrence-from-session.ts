import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  SESSION_STALE_TIME,
  fetchRecurrenceFromSessionAPI,
  sessionKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const fetchRecurrenceFromSession = fetchRecurrenceFromSessionAPI.bind(
  null,
  fetch,
);

const recurrenceFromSessionQueryOptions = (sessionId: number) => {
  return queryOptions({
    queryKey: sessionKeys.recurrence(sessionId),
    queryFn: () => fetchRecurrenceFromSession(sessionId),
    // The shared header hook now reads recurrence on every session tab; without
    // a staleTime the default (0) refetches it on each tab navigation.
    staleTime: SESSION_STALE_TIME,
  });
};

export const useFetchRecurrenceFromSession = (sessionId: number) => {
  return useQuery({
    ...recurrenceFromSessionQueryOptions(sessionId),
  });
};

/**
 * Suspense variant for the All Occurrences page gate: it must read
 * `recurrence_count` to decide whether to render or redirect, and the page
 * wraps it in a `QueryBoundary`. Header tab visibility uses the non-suspense
 * variant above instead (the Editor header has no Suspense boundary).
 */
export const useRetrieveRecurrenceFromSession = (sessionId: number) => {
  return useSuspenseQuery({
    ...recurrenceFromSessionQueryOptions(sessionId),
  });
};
