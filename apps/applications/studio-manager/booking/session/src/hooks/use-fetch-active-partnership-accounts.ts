import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  type ActivePartnershipAccount,
  fetchActivePartnershipAccountsAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const ACTIVE_PARTNERSHIP_ACCOUNTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type UseFetchActivePartnershipAccountsProps = {
  establishment?: number | null;
  dateStart?: string | null;
  enabled?: boolean;
};

const fetchActivePartnershipAccounts = fetchActivePartnershipAccountsAPI.bind(
  null,
  fetch,
);

const activePartnershipAccountsQueryOptions = ({
  establishment,
  dateStart,
  enabled = true,
}: UseFetchActivePartnershipAccountsProps) => {
  return queryOptions({
    queryKey: [
      "active-partnership-accounts",
      { establishment, dateStart },
    ] as const,
    queryFn: (): Promise<ActivePartnershipAccount[]> =>
      fetchActivePartnershipAccounts({
        establishment: establishment!,
        date_start: dateStart!,
      }),
    enabled: enabled && !!establishment && !!dateStart,
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
  enabled = true,
}: UseFetchActivePartnershipAccountsProps) => {
  return useSuspenseQuery(
    activePartnershipAccountsQueryOptions({
      establishment,
      dateStart,
      enabled,
    }),
  );
};
