import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  type ActivePartnershipAccount,
  fetchActivePartnershipAccountsAPI,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const ACTIVE_PARTNERSHIP_ACCOUNTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type UseFetchActivePartnershipAccountsProps = {
  establishment?: number | null;
  dateStart?: string | null;
};

const fetchActivePartnershipAccounts = fetchActivePartnershipAccountsAPI.bind(
  null,
  fetch,
);

const activePartnershipAccountsQueryOptions = ({
  establishment,
  dateStart,
}: UseFetchActivePartnershipAccountsProps) => {
  const params = {
    establishment: establishment ?? undefined,
    date_start: dateStart ?? undefined,
  };
  return queryOptions({
    queryKey: partnershipKeys.activePartnershipAccounts(params),
    queryFn: (): Promise<ActivePartnershipAccount[]> => {
      if (!establishment || !dateStart) return Promise.resolve([]);
      return fetchActivePartnershipAccounts(params);
    },
    staleTime: ACTIVE_PARTNERSHIP_ACCOUNTS_STALE_TIME,
  });
};

/**
 * Fetches the partnership accounts that are active for a given establishment and date.
 * Used to populate the per-partner spot capping table in the session form.
 */
export const useFetchActivePartnershipAccounts = ({
  establishment,
  dateStart,
}: UseFetchActivePartnershipAccountsProps) => {
  return useSuspenseQuery(
    activePartnershipAccountsQueryOptions({
      establishment,
      dateStart,
    }),
  );
};
