// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/hooks/wellhub/use-fetch-active-partnership-account-for-offer.ts
import { useQuery } from "@tanstack/react-query";

import { fetchActivePartnershipAccountsAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const WELLHUB_ACTIVE_PARTNERSHIP_ACCOUNT_QUERY_KEY =
  "wellhub-active-partnership-account";

export const useFetchActivePartnershipAccountForOffer = (
  offerId: number | null,
) => {
  return useQuery({
    queryKey: [WELLHUB_ACTIVE_PARTNERSHIP_ACCOUNT_QUERY_KEY, offerId],
    queryFn: () =>
      fetchActivePartnershipAccountsAPI(fetch, { offer: offerId! }),
    enabled: offerId !== null,
  });
};
