// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/hooks/use-fetch-wellhub-products-by-account.ts
import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchWellhubProductsByAccountAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 2 * 60 * 1000;

type Props = {
  partnershipAccountExternalId?: string | null;
  isLivestream?: boolean;
  enabled?: boolean;
};

const fetchWellhubProductsByAccount = fetchWellhubProductsByAccountAPI.bind(
  null,
  fetch,
);

const wellhubProductsByAccountQueryOptions = (enabled: boolean) =>
  queryOptions({
    queryKey: ["wellhub-products-by-account"],
    queryFn: () => fetchWellhubProductsByAccount(),
    enabled,
    staleTime: STALE_TIME,
  });

export const useFetchWellhubProductsByAccount = ({
  partnershipAccountExternalId,
  isLivestream = false,
  enabled = true,
}: Props) =>
  useQuery({
    ...wellhubProductsByAccountQueryOptions(
      enabled && !!partnershipAccountExternalId,
    ),
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
