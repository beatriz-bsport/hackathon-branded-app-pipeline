import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type SessionStatusParams,
  sessionStatusQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchSessionStatus = (
  sessionId: number,
  params?: SessionStatusParams,
) => useSuspenseQuery(sessionStatusQueryOptions(fetch, sessionId, params));
