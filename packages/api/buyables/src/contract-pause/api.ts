import { mutationOptions } from "@tanstack/react-query";

import { type ApiConfig, Fetch } from "@bsport/store-base";

import { API_V0_URL_SUBSCRIPTION } from "#src/constants";

import type {
  ContractPause,
  ContractPauseInfo,
  CreateContractPauseParams,
  FetchContractPauseInfoParams,
} from "./types";

export const API_V0_URL_CONTRACT_PAUSE = `${API_V0_URL_SUBSCRIPTION}/contract_pause`;

// ----------------------------------------------------------------------------

const fetchContractPauseInfoAPIConfig = (
  params: FetchContractPauseInfoParams,
): ApiConfig => {
  return [
    `${API_V0_URL_CONTRACT_PAUSE}/get_info/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

const fetchContractPauseInfoAPI = async (
  fetch: Fetch<ContractPauseInfo>,
  params: FetchContractPauseInfoParams,
): Promise<ContractPauseInfo> => {
  const [uri, init] = fetchContractPauseInfoAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchContractPauseInfoMutationOptions = (
  fetch: Fetch<ContractPauseInfo>,
) =>
  mutationOptions({
    mutationFn: (params: FetchContractPauseInfoParams) =>
      fetchContractPauseInfoAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

const createContractPauseAPIConfig = (
  params: CreateContractPauseParams,
): ApiConfig => {
  return [
    `${API_V0_URL_CONTRACT_PAUSE}/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

const createContractPauseAPI = async (
  fetch: Fetch<ContractPause>,
  params: CreateContractPauseParams,
): Promise<{ data: ContractPause; backgroundTaskUuid: string | null }> => {
  const [uri, init] = createContractPauseAPIConfig(params);

  const { data, backgroundTaskUuid } = await fetch(uri, init);

  return { data, backgroundTaskUuid };
};

export const createContractPauseMutationOptions = (
  fetch: Fetch<ContractPause>,
) =>
  mutationOptions({
    mutationFn: (params: CreateContractPauseParams) =>
      createContractPauseAPI(fetch, params),
  });
