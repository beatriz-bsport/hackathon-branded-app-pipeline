import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type CompatibleWithSessionParams,
  compatibleBySessionQueryOptions,
} from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export const useFetchCompatibleBySession = (
  sessionId: number,
  queryParams: CompatibleWithSessionParams,
) =>
  useSuspenseQuery(
    compatibleBySessionQueryOptions(fetch, sessionId, queryParams),
  );
