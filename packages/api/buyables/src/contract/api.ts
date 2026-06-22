import { buildUrlParams } from "@bsport/store-base";

import {
  API_V0_URL_SUBSCRIPTION,
  API_V1_URL_SUBSCRIPTION,
  QUERY_KEY_MAIN,
} from "#src/constants";
import {
  createAPI,
  createMutationOptions,
  createQueryOptions,
} from "#src/shared";

import type { Contract, ContractWithBenefits } from "./types/models";
import type {
  ArchiveContractParams,
  FetchContractParams,
  FetchContractsParams,
  RestoreContractParams,
  SearchContractsParams,
  UpdateContractParams,
} from "./types/params";

// ----------------------------------------------------------------------------

export const API_V0_URL_CONTRACT = `${API_V0_URL_SUBSCRIPTION}/contract`;
export const API_V1_URL_CONTRACT = `${API_V1_URL_SUBSCRIPTION}/contract`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "contract"] as const,

  lists: () => [...queryKeys.all, "list"] as const,
  list: (params: FetchContractsParams) =>
    [...queryKeys.lists(), params] as const,

  searches: () => [...queryKeys.lists(), "search"] as const,
  search: (params: SearchContractsParams) =>
    [...queryKeys.searches(), params] as const,

  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
} as const;

// ----------------------------------------------------------------------------

export const fetchContractsQueryOptions = createQueryOptions<
  Contract[],
  FetchContractsParams
>(
  (params) => [`${API_V0_URL_CONTRACT}/${buildUrlParams(params)}`],
  (params) => queryKeys.list(params),
);

// ----------------------------------------------------------------------------

export const fetchContractQueryOptions = createQueryOptions<
  Contract,
  FetchContractParams
>(
  (params) => [`${API_V0_URL_CONTRACT}/${params.id}/`],
  (params) => queryKeys.detail(params.id),
);

// ----------------------------------------------------------------------------

export const searchContractsQueryOptions = createQueryOptions<
  Contract,
  SearchContractsParams
>(
  (params) => [`${API_V0_URL_CONTRACT}/search/${buildUrlParams(params)}/`],
  (params) => queryKeys.search(params),
);

// ----------------------------------------------------------------------------

export const updateContractAPI = createAPI<
  ContractWithBenefits,
  UpdateContractParams
>((params) => [
  `${API_V1_URL_CONTRACT}/${params.id}/?with_benefits=true`,
  {
    method: "PUT",
    body: JSON.stringify(params),
  },
]);

// ----------------------------------------------------------------------------

export const restoreContractMutationOptions = createMutationOptions<
  Contract,
  RestoreContractParams
>((params) => [
  `${API_V0_URL_CONTRACT}/${params.id}/restore/`,
  {
    method: "PUT",
  },
]);

// ----------------------------------------------------------------------------

export const archiveContractMutationOptions = createMutationOptions<
  Contract,
  ArchiveContractParams
>((params) => [
  `${API_V0_URL_CONTRACT}/${params.id}/`,
  {
    method: "DELETE",
  },
]);
