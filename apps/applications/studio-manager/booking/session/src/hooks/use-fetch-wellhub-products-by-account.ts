import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchWellhubProductsByAccountAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const WELLHUB_PRODUCTS_BY_ACCOUNT_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type UseFetchWellhubProductsByAccountProps = {
  partnershipAccountExternalId?: string | null;
  isLivestream?: boolean;
  enabled?: boolean;
};

const fetchWellhubProductsByAccount = fetchWellhubProductsByAccountAPI.bind(
  null,
  fetch,
);

const wellhubProductsByAccountQueryOptions = ({
  enabled = true,
}: UseFetchWellhubProductsByAccountProps) => {
  return queryOptions({
    queryKey: ["wellhub-products-by-account"],
    queryFn: () => fetchWellhubProductsByAccount(),
    enabled,
    staleTime: WELLHUB_PRODUCTS_BY_ACCOUNT_STALE_TIME,
  });
};

export const useFetchWellhubProductsByAccount = ({
  partnershipAccountExternalId,
  isLivestream = false,
  enabled = true,
}: UseFetchWellhubProductsByAccountProps) => {
  return useQuery({
    ...wellhubProductsByAccountQueryOptions({
      enabled: enabled && !!partnershipAccountExternalId,
    }),
    select: (data) => {
      const products =
        data?.products_by_partnership_account?.[
          partnershipAccountExternalId!
        ] ?? [];
      return products
        .filter((product) => isLivestream === product.virtual)
        .map((product) => ({
          label: product.name,
          id: product.product_id.toString(),
        }));
    },
  });
};
