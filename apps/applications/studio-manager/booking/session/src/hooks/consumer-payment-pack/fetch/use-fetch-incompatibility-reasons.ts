import { useSuspenseQuery } from "@tanstack/react-query";

import { incompatibilityReasonsQueryOptions } from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export const useFetchIncompatibilityReasons = (id: number, sessionId: number) =>
  useSuspenseQuery(incompatibilityReasonsQueryOptions(fetch, id, sessionId));
