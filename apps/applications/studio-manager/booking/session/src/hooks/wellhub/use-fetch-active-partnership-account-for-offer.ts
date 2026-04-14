import { useQuery } from "@tanstack/react-query";

import { fetchActivePartnershipAccountsAPI } from "@bsport/api-book";

import { WELLHUB_ACTIVE_PARTNERSHIP_ACCOUNT_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

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
