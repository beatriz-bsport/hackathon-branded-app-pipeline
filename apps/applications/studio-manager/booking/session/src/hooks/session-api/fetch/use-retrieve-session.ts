import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type RetrieveSessionParams,
  retrieveSessionQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useRetrieveSession = (
  sessionId: number,
  params?: RetrieveSessionParams,
) => useSuspenseQuery(retrieveSessionQueryOptions(fetch, sessionId, params));
