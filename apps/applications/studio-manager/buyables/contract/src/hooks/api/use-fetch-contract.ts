import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchContractParams,
  fetchContractQueryOptions,
} from "@bsport/api-buyables/contract";

import { fetch } from "#src/utils/fetch";

export const useFetchContract = (params: FetchContractParams) =>
  useSuspenseQuery(fetchContractQueryOptions(fetch, params));
