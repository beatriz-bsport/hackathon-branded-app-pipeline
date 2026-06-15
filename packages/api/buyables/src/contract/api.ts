import { buildUrlParams } from "@bsport/store-base";

import {
  createAPI,
  createMutationOptions,
  createQueryOptions,
} from "#src/shared";

import {
  API_V0_URL_CONTRACT,
  API_V1_URL_CONTRACT,
  queryKeys,
} from "./constants";
import type { Contract, ContractWithBenefits } from "./types/models";
import type {
  ArchiveContractParams,
  FetchContractParams,
  FetchContractsParams,
  RestoreContractParams,
  UpdateContractParams,
  UpdateLegacyContractParams,
} from "./types/params";

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

export const updateLegacyContractAPI = createAPI<
  Contract,
  UpdateLegacyContractParams
>((params) => [
  `${API_V0_URL_CONTRACT}/${params.id}/`,
  {
    method: "PATCH",
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
