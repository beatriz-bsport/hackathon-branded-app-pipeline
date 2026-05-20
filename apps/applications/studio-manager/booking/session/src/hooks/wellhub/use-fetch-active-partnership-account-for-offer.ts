import { useQuery } from "@tanstack/react-query";

import {
  fetchActivePartnershipAccountsAPI,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchActivePartnershipAccountForOffer = (
  offerId: number | null,
) => {
  const params = { offer: offerId! };
  return useQuery({
    queryKey: partnershipKeys.activePartnershipAccounts(params),
    queryFn: () => fetchActivePartnershipAccountsAPI(fetch, params),
    enabled: offerId !== null,
  });
};
