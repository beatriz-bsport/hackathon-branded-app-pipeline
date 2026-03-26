import { useQuery } from "@tanstack/react-query";

import {
  type FetchContractsParams,
  fetchContractsQueryOptions,
} from "@bsport/api-buyables/contract";

import { fetch } from "#src/utils/fetch";

export const useFetchContracts = (params: FetchContractsParams) =>
  useQuery(fetchContractsQueryOptions(fetch, params));
