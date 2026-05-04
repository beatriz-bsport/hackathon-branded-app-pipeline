import { queryOptions } from "@tanstack/react-query";

import { type Fetch, buildUrlParams } from "@bsport/store-base";

import { BOOKING_QUERY_KEY } from "#src/constants";

import type {
  ActivePartnershipAccount,
  FetchActivePartnershipAccountsParams,
  FetchPartnershipAccountsParams,
  PartnershipAccount,
  PartnershipCompany,
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
};

export const fetchPartnershipAccounts = async (
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
    queryFn: () => fetchPartnershipAccounts(fetch, params),
  });

export const fetchPartnershipCompanies = async (
  fetch: Fetch<PartnershipCompany[]>,
): Promise<PartnershipCompany[]> => {
  const { data } = await fetch(`${PARTNERSHIP_COMPANIES_API_URL}/`);
  return data;
};

export const partnershipCompaniesQueryOptions = (
  fetch: Fetch<PartnershipCompany[]>,
) =>
  queryOptions({
    queryKey: partnershipKeys.companies(),
    queryFn: () => fetchPartnershipCompanies(fetch),
  });

export const fetchActivePartnershipAccountsAPI = async (
  fetch: Fetch<ActivePartnershipAccount[]>,
  params: FetchActivePartnershipAccountsParams,
): Promise<ActivePartnershipAccount[]> => {
  const { data } = await fetch(
    `${PARTNERSHIP_ACCOUNTS_API_URL}/active_for_offer/${buildUrlParams(params)}`,
  );
  return data;
};

export const activePartnershipAccountsQueryOptions = (
  fetch: Fetch<ActivePartnershipAccount[]>,
  params: FetchActivePartnershipAccountsParams,
) =>
  queryOptions({
    queryKey: [...partnershipKeys.all, "active", params] as const,
    queryFn: () => fetchActivePartnershipAccountsAPI(fetch, params),
  });
