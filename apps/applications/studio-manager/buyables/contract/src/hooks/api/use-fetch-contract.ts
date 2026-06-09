import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchContractParams,
  fetchContractQueryOptions,
} from "@bsport/api-buyables/contract";

import { fetch } from "#src/utils/fetch";

const STALETIME_5_MIN = 5 * 60 * 1_000;

export const useFetchContract = (params: FetchContractParams) =>
  useSuspenseQuery({
    ...fetchContractQueryOptions(fetch, params),
    staleTime: STALETIME_5_MIN,
  });
