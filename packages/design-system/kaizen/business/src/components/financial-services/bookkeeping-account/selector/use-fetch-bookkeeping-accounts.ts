import { useQuery } from "@tanstack/react-query";

import {
  type FetchBookkeepingAccountsParams,
  fetchBookkeepingAccountsQueryOptions,
} from "@bsport/api-financial-services";
import type { Fetch } from "@bsport/fetch";

export type FetchBookkeepingAccountsQueryOptionsParams = {
  fetch: Fetch;
  apiParams: FetchBookkeepingAccountsParams;
};

export const useFetchBookkeepingAccounts = (
  params: FetchBookkeepingAccountsQueryOptionsParams,
) =>
  useQuery(
    fetchBookkeepingAccountsQueryOptions(params.fetch, params.apiParams),
  );
