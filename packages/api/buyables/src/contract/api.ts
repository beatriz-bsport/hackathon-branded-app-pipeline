import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import {
  API_V0_URL_CONTRACT,
  API_V1_URL_CONTRACT,
  queryKeys,
} from "./constants";
import type { Contract } from "./types/models";
import type {
  ArchiveContractParams,
  FetchContractParams,
  FetchContractsParams,
  RestoreContractParams,
  UpdateContractParams,
  UpdateLegacyContractParams,
} from "./types/params";

// ----------------------------------------------------------------------------

const fetchContractsAPIConfig = (params: FetchContractsParams): ApiConfig => {
  return [`${API_V0_URL_CONTRACT}/${buildUrlParams(params)}`];
};

const fetchContractsAPI = async (
  fetch: Fetch<Contract[]>,
  params: FetchContractsParams,
): Promise<Contract[]> => {
  const [uri, init] = fetchContractsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchContractsQueryOptions = (
  fetch: Fetch<Contract[]>,
  params: FetchContractsParams,
) =>
  queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchContractsAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

const fetchContractAPIConfig = (params: FetchContractParams): ApiConfig => {
  return [`${API_V0_URL_CONTRACT}/${params.id}/`];
};

const fetchContractAPI = async (
  fetch: Fetch<Contract>,
  params: FetchContractParams,
): Promise<Contract> => {
  const [uri, init] = fetchContractAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchContractQueryOptions = (
  fetch: Fetch<Contract>,
  params: FetchContractParams,
) =>
  queryOptions({
    queryKey: queryKeys.detail(params.id),
    queryFn: () => fetchContractAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

const updateContractAPIConfig = (params: UpdateContractParams): ApiConfig => {
  return [
    `${API_V1_URL_CONTRACT}/${params.id}/`,
    {
      method: "PUT",
      body: JSON.stringify(params),
    },
  ];
};

export const updateContractAPI = async (
  fetch: Fetch<Contract>,
  params: UpdateContractParams,
): Promise<Contract> => {
  const [uri, init] = updateContractAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// ----------------------------------------------------------------------------

const updateLegacyContractAPIConfig = (
  params: UpdateLegacyContractParams,
): ApiConfig => {
  return [
    `${API_V0_URL_CONTRACT}/${params.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};

export const updateLegacyContractAPI = async (
  fetch: Fetch<Contract>,
  params: UpdateLegacyContractParams,
): Promise<Contract> => {
  const [uri, init] = updateLegacyContractAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// ----------------------------------------------------------------------------

const restoreContractAPIConfig = (params: RestoreContractParams): ApiConfig => {
  return [
    `${API_V0_URL_CONTRACT}/${params.id}/restore/`,
    {
      method: "PUT",
    },
  ];
};

const restoreContractAPI = async (
  fetch: Fetch<Contract>,
  params: RestoreContractParams,
): Promise<Contract> => {
  const [uri, init] = restoreContractAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const restoreContractMutationOptions = (fetch: Fetch<Contract>) =>
  mutationOptions({
    mutationFn: (params: RestoreContractParams) =>
      restoreContractAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

const archiveContractAPIConfig = (params: ArchiveContractParams): ApiConfig => {
  return [
    `${API_V0_URL_CONTRACT}/${params.id}/`,
    {
      method: "DELETE",
    },
  ];
};

const archiveContractAPI = async (
  fetch: Fetch<Contract>,
  params: ArchiveContractParams,
): Promise<Contract> => {
  const [uri, init] = archiveContractAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const archiveContractMutationOptions = (fetch: Fetch<Contract>) =>
  mutationOptions({
    mutationFn: (params: ArchiveContractParams) =>
      archiveContractAPI(fetch, params),
  });
