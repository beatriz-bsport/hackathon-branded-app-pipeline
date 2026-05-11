import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  fetchPartnershipAccountsAPI,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchAccounts = fetchPartnershipAccountsAPI.bind(null, fetch);

export const aggregatorAccountsQueryOptions = (partnershipId: number) => {
  const queryFn = fetchAccounts.bind(null, { partnership: partnershipId });
  return queryOptions<PartnershipAccount[]>({
    queryKey: partnershipKeys.accounts(partnershipId),
    queryFn,
    staleTime: STALE_TIME,
  });
};

export const useAggregatorAccounts = (partnershipId: number) =>
  useSuspenseQuery(aggregatorAccountsQueryOptions(partnershipId));
