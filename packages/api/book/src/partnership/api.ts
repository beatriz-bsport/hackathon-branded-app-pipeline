import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import { BOOKING_QUERY_KEY } from "#src/constants";

import type {
  ActivePartnershipAccount,
  CreatePartnershipAccountParams,
  CreateWellhubAccountParams,
  FetchActivePartnershipAccountsParams,
  FetchPartnershipAccountsParams,
  PartnershipAccount,
  PartnershipCompany,
  UpdatePartnershipAccountParams,
  ValidateExternalIdParams,
  ValidateExternalIdResponse,
} from "./types";

const PARTNERSHIP_ACCOUNTS_API_URL = "book/v1/partnership/partnership_account";
const PARTNERSHIP_COMPANIES_API_URL = "book/v1/partnership/partnership_company";

export const partnershipKeys = {
  all: [BOOKING_QUERY_KEY, "partnership"] as const,
  companies: () => [...partnershipKeys.all, "companies"] as const,
  company: (identifier: string) =>
    [...partnershipKeys.companies(), identifier] as const,
  accounts: (partnershipId: number) =>
    [...partnershipKeys.all, "accounts", partnershipId] as const,
  validateExternalId: (partnershipId: number, externalId: string) =>
    [
      ...partnershipKeys.all,
      "validate-external-id",
      partnershipId,
      externalId,
    ] as const,
  activePartnershipAccounts: (params: FetchActivePartnershipAccountsParams) =>
    [...partnershipKeys.all, "active", params] as const,
};

export const fetchPartnershipAccountsAPI = async (
  fetch: Fetch<PartnershipAccount[]>,
  params: FetchPartnershipAccountsParams,
): Promise<PartnershipAccount[]> => {
  const { data } = await fetch(
    `${PARTNERSHIP_ACCOUNTS_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

export const partnershipAccountsQueryOptions = (
  fetch: Fetch<PartnershipAccount[]>,
  params: FetchPartnershipAccountsParams,
) =>
  queryOptions({
    queryKey: partnershipKeys.accounts(params.partnership),
    queryFn: () => fetchPartnershipAccountsAPI(fetch, params),
  });

const WELLHUB_ACCOUNTS_STALE_TIME = 60 * 1000;

export const wellhubAccountsQueryOptions = (
  fetch: Fetch<PartnershipAccount[]>,
  partnershipId: number,
) =>
  queryOptions({
    queryKey: partnershipKeys.accounts(partnershipId),
    queryFn: () =>
      fetchPartnershipAccountsAPI(fetch, { partnership: partnershipId }),
    staleTime: WELLHUB_ACCOUNTS_STALE_TIME,
  });

export const fetchPartnershipCompaniesAPIConfig = (): ApiConfig => [
  `${PARTNERSHIP_COMPANIES_API_URL}/`,
];

export const fetchPartnershipCompaniesAPI = async (
  fetch: Fetch<PartnershipCompany[]>,
): Promise<PartnershipCompany[]> => {
  const [uri, init] = fetchPartnershipCompaniesAPIConfig();
  const { data } = await fetch(uri, init);
  return data;
};

export const activatePartnershipAccountAPIConfig = (params: {
  id: string;
}): ApiConfig => [
  `${PARTNERSHIP_ACCOUNTS_API_URL}/${params.id}/activate/`,
  { method: "POST" },
];

export const activatePartnershipAccountAPI = async (
  fetch: Fetch<PartnershipAccount>,
  params: { id: string },
): Promise<PartnershipAccount> => {
  const [uri, init] = activatePartnershipAccountAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const createPartnershipAccountAPIConfig = (
  params: CreatePartnershipAccountParams,
): ApiConfig => [
  `${PARTNERSHIP_ACCOUNTS_API_URL}/create_venue/`,
  { method: "POST", body: JSON.stringify(params) },
];

export const createPartnershipAccountAPI = async (
  fetch: Fetch<PartnershipAccount>,
  params: CreatePartnershipAccountParams,
): Promise<PartnershipAccount> => {
  const [uri, init] = createPartnershipAccountAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const updatePartnershipAccountAPIConfig = (
  params: UpdatePartnershipAccountParams,
): ApiConfig => [
  `${PARTNERSHIP_ACCOUNTS_API_URL}/${params.id}/`,
  {
    method: "PATCH",
    body: JSON.stringify({
      partnership: params.partnership,
      establishment_group: params.establishment_group,
    }),
  },
];

export const updatePartnershipAccountAPI = async (
  fetch: Fetch<PartnershipAccount>,
  params: UpdatePartnershipAccountParams,
): Promise<PartnershipAccount> => {
  const [uri, init] = updatePartnershipAccountAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const createWellhubAccountAPI = async (
  fetch: Fetch<PartnershipAccount>,
  params: CreateWellhubAccountParams,
): Promise<PartnershipAccount> => {
  const { data } = await fetch(
    `${PARTNERSHIP_ACCOUNTS_API_URL}/create_venue/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  return data;
};

export const validateExternalIdAPI = async (
  fetch: Fetch<ValidateExternalIdResponse>,
  params: ValidateExternalIdParams,
): Promise<ValidateExternalIdResponse> => {
  const { data } = await fetch(
    `${PARTNERSHIP_ACCOUNTS_API_URL}/validate-external-id/${buildUrlParams(params)}`,
  );
  return data;
};

export const validateWellhubExternalIdQueryOptions = (
  fetch: Fetch<ValidateExternalIdResponse>,
  partnershipId: number,
  externalId: string,
) => {
  const enabled = externalId.length > 0;
  const queryFn = validateExternalIdAPI.bind(null, fetch, {
    external_id: externalId,
    partnership: partnershipId,
  });
  return queryOptions<ValidateExternalIdResponse, Error, boolean>({
    queryKey: partnershipKeys.validateExternalId(partnershipId, externalId),
    queryFn,
    enabled,
    select: (data) => data.is_valid,
  });
};

export const deletePartnershipAccountAPIConfig = (params: {
  id: string;
}): ApiConfig => [
  `${PARTNERSHIP_ACCOUNTS_API_URL}/${params.id}/`,
  { method: "DELETE" },
];

export const deletePartnershipAccountAPI = async (
  fetch: Fetch<void>,
  params: { id: string },
): Promise<void> => {
  const [uri, init] = deletePartnershipAccountAPIConfig(params);
  await fetch(uri, init);
};

export const partnershipCompaniesQueryOptions = (
  fetch: Fetch<PartnershipCompany[]>,
) =>
  queryOptions({
    queryKey: partnershipKeys.companies(),
    queryFn: () => fetchPartnershipCompaniesAPI(fetch),
  });

export const fetchActivePartnershipAccountsAPIConfig = (
  params: FetchActivePartnershipAccountsParams,
): ApiConfig => [
  `${PARTNERSHIP_ACCOUNTS_API_URL}/active_for_offer/${buildUrlParams(params)}`,
];

export const fetchActivePartnershipAccountsAPI = async (
  fetch: Fetch<ActivePartnershipAccount[]>,
  params: FetchActivePartnershipAccountsParams,
): Promise<ActivePartnershipAccount[]> => {
  const [uri, init] = fetchActivePartnershipAccountsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const activePartnershipAccountsQueryOptions = (
  fetch: Fetch<ActivePartnershipAccount[]>,
  params: FetchActivePartnershipAccountsParams,
) =>
  queryOptions({
    queryKey: partnershipKeys.activePartnershipAccounts(params),
    queryFn: () => fetchActivePartnershipAccountsAPI(fetch, params),
  });
