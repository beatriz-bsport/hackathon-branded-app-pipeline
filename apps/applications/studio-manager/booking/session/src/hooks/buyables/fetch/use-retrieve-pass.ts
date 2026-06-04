import { useQuery } from "@tanstack/react-query";

import { retrievePassQueryOptions } from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch.js";

const PASS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useRetrievePass = (passId: number | null) => {
  return useQuery({
    ...retrievePassQueryOptions(fetch, passId!),
    enabled: !!passId,
    staleTime: PASS_STALE_TIME,
  });
};
