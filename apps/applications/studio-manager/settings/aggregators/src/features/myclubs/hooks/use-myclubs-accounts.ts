import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  fetchPartnershipAccounts,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 60 * 1000; // 1 minute

const fetchAccounts = fetchPartnershipAccounts.bind(null, fetch);

export const myclubsAccountsQueryOptions = (partnershipId: number) => {
  const queryFn = fetchAccounts.bind(null, { partnership: partnershipId });
  return queryOptions<PartnershipAccount[]>({
    queryKey: partnershipKeys.accounts(partnershipId),
    queryFn,
    staleTime: STALE_TIME,
  });
};

export const useMyclubsAccounts = (partnershipId: number) =>
  useSuspenseQuery(myclubsAccountsQueryOptions(partnershipId));
