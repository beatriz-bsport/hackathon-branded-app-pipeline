import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type CompatibleWithSessionParams,
  nonCompatibleBySessionQueryOptions,
} from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export const useFetchNonCompatibleBySession = (
  sessionId: number,
  queryParams: CompatibleWithSessionParams,
) =>
  useSuspenseQuery(
    nonCompatibleBySessionQueryOptions(fetch, sessionId, queryParams),
  );
