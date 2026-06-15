import { PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { API_V0_URL_SUBSCRIPTION, QUERY_KEY_MAIN } from "#src/constants";
import {
  createBgTaskMutationOptions,
  createMutationOptions,
  createQueryOptions,
} from "#src/shared";

import type {
  ContractPause,
  ContractPauseInfo,
  CreateContractPauseParams,
  DeleteContractPauseParams,
  FetchContractPauseInfoParams,
  FetchContractPausesParams,
  UpdateContractPauseNameParams,
  UpdateContractPauseParams,
} from "./types";

// ----------------------------------------------------------------------------

export const API_V0_URL_CONTRACT_PAUSE = `${API_V0_URL_SUBSCRIPTION}/contract_pause`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "contract-pause"] as const,

  lists: () => [...queryKeys.all, "list"] as const,
  listsByContract: (contractId?: number) =>
    [...queryKeys.lists(), contractId] as const,
  list: ({ contract, ...params }: FetchContractPausesParams) =>
    [...queryKeys.listsByContract(contract), params] as const,

  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
} as const;

// ----------------------------------------------------------------------------

export const fetchContractPausesQueryOptions = createQueryOptions<
  PaginatedResponse<ContractPause>,
  FetchContractPausesParams
>(
  (params) => [`${API_V0_URL_CONTRACT_PAUSE}/${buildUrlParams(params)}`],
  (params) => queryKeys.list(params),
);

// ----------------------------------------------------------------------------

export const fetchContractPauseInfoMutationOptions = createMutationOptions<
  ContractPauseInfo,
  FetchContractPauseInfoParams
>((params) => [
  `${API_V0_URL_CONTRACT_PAUSE}/get_info/`,
  {
    method: "POST",
    body: JSON.stringify(params),
  },
]);

// ----------------------------------------------------------------------------

export const createContractPauseMutationOptions = createBgTaskMutationOptions<
  ContractPause,
  CreateContractPauseParams
>((params) => [
  `${API_V0_URL_CONTRACT_PAUSE}/`,
  {
    method: "POST",
    body: JSON.stringify(params),
  },
]);

// ----------------------------------------------------------------------------

export const updateContractPauseMutationOptions = createBgTaskMutationOptions<
  ContractPause,
  UpdateContractPauseParams
>((params) => [
  `${API_V0_URL_CONTRACT_PAUSE}/${params.contract_pause_id}/`,
  {
    method: "PATCH",
    body: JSON.stringify(params),
  },
]);

// ----------------------------------------------------------------------------

export const updateContractPauseNameOnlyMutationOptions = createMutationOptions<
  ContractPause,
  UpdateContractPauseNameParams
>((params) => [
  `${API_V0_URL_CONTRACT_PAUSE}/${params.contract_pause_id}/update_only_name/`,
  {
    method: "POST",
    body: JSON.stringify({ name: params.name }),
  },
]);

// ----------------------------------------------------------------------------

export const deleteContractPauseMutationOptions = createMutationOptions<
  void,
  DeleteContractPauseParams
>((params) => [
  `${API_V0_URL_CONTRACT_PAUSE}/${params.contract_pause_id}/`,
  {
    method: "DELETE",
  },
]);
