import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchWellhubProductsAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const WELLHUB_PRODUCTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type UseFetchWellhubProductsProps = {
  wellhubGymId?: string;
  isLivestream?: boolean;
  enabled?: boolean;
};

const fetchWellhubProducts = fetchWellhubProductsAPI.bind(null, fetch);

const wellhubProductsQueryOptions = ({
  wellhubGymId,
  enabled = true,
}: UseFetchWellhubProductsProps) => {
  return queryOptions({
    queryKey: ["wellhub-products", wellhubGymId],
    queryFn: () => fetchWellhubProducts(),
    enabled: enabled && !!wellhubGymId,
    staleTime: WELLHUB_PRODUCTS_STALE_TIME,
  });
};

export const useFetchWellhubProducts = ({
  wellhubGymId,
  isLivestream = false,
  enabled = true,
}: UseFetchWellhubProductsProps) => {
  return useQuery({
    ...wellhubProductsQueryOptions({
      wellhubGymId,
      enabled,
    }),
    select: (data) => {
      const products = data?.products_by_wellhub_gym?.[wellhubGymId!] ?? [];
      return products
        .filter((product) => isLivestream === product.virtual)
        .map((product) => ({
          label: product.name,
          id: product.product_id.toString(),
        }));
    },
  });
};
