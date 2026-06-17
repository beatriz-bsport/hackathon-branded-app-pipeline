import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchContractPausesParams,
  fetchContractPausesQueryOptions,
} from "@bsport/api-buyables/contract-pause";

import { fetch } from "#src/utils/fetch";

const STALETIME_5_MIN = 5 * 60 * 1_000;

export const useContractPausesSuspenseQuery = (
  params: FetchContractPausesParams,
) =>
  useSuspenseQuery({
    ...fetchContractPausesQueryOptions(fetch, params),
    staleTime: STALETIME_5_MIN,
  });
