import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchContractsParams,
  fetchContractsQueryOptions,
} from "@bsport/api-buyables/contract";

import { fetch } from "#src/utils/fetch";

export const useContractsQuery = (params: FetchContractsParams) =>
  useSuspenseQuery(fetchContractsQueryOptions(fetch, params));
