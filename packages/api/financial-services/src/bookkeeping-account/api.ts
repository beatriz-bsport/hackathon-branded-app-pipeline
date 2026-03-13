import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { API_URL_BOOKKEEPING_ACCOUNT } from "./constants";
import type { BookkeepingAccount } from "./types/models";
import type {
  CreateBookkeepingAccountParams,
  FetchBookkeepingAccountsParams,
} from "./types/params";

// ----------------------------------------------------------------------------

function getIsActiveKey(isActive?: boolean) {
  if (isActive == null) {
    return "all";
  }
  if (isActive) {
    return "active";
  }
  return "inactive";
}

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "bookkeeping-account"] as const,

  list: (isActive?: boolean) =>
    [...queryKeys.all, "list", getIsActiveKey(isActive)] as const,
} as const;

// ----------------------------------------------------------------------------

export const fetchBookkeepingAccountsAPIConfig = (
  params: FetchBookkeepingAccountsParams,
): ApiConfig => {
  return [`${API_URL_BOOKKEEPING_ACCOUNT}/${buildUrlParams(params)}`];
};

export const fetchBookkeepingAccountsAPI = async (
  fetch: Fetch<BookkeepingAccount[]>,
  params: FetchBookkeepingAccountsParams,
): Promise<BookkeepingAccount[]> => {
  const [uri, init] = fetchBookkeepingAccountsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchBookkeepingAccountsQueryOptions = (
  fetch: Fetch<BookkeepingAccount[]>,
  params: FetchBookkeepingAccountsParams,
) =>
  queryOptions({
    queryKey: queryKeys.list(params?.is_active),
    queryFn: () => fetchBookkeepingAccountsAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

export const createBookkeepingAccountAPIConfig = (
  params: CreateBookkeepingAccountParams,
): ApiConfig => {
  return [
    `${API_URL_BOOKKEEPING_ACCOUNT}/`,
    { method: "POST", body: JSON.stringify(params) },
  ];
};

export const createBookkeepingAccountAPI = async (
  fetch: Fetch<BookkeepingAccount>,
  params: CreateBookkeepingAccountParams,
): Promise<BookkeepingAccount> => {
  const [uri, init] = createBookkeepingAccountAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};
