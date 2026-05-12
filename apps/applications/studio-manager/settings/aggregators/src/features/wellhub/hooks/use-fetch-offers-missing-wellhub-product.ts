// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/hooks/wellhub/use-fetch-offers-missing-wellhub-product.ts
import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchOffersMissingWellhubProductAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const PAGE_SIZE = 10;
const QUERY_KEY = "wellhub-missing-offers";

export const offersMissingWellhubProductQueryOptions = (page: number) =>
  queryOptions({
    queryKey: [QUERY_KEY, page],
    queryFn: () => fetchOffersMissingWellhubProductAPI(fetch, page, PAGE_SIZE),
  });

export const WELLHUB_MISSING_OFFERS_QUERY_KEY = QUERY_KEY;

export const useFetchOffersMissingWellhubProduct = (
  page: number,
  enabled = true,
) =>
  useQuery({
    ...offersMissingWellhubProductQueryOptions(page),
    enabled,
  });
