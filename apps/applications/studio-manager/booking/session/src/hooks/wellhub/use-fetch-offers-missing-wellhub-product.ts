import { useQuery } from "@tanstack/react-query";

import { fetchOffersMissingWellhubProductAPI } from "@bsport/api-book";

import { WELLHUB_MISSING_OFFERS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

const PAGE_SIZE = 10;

export const useFetchOffersMissingWellhubProduct = ({
  page,
  enabled,
}: { page?: number; enabled?: boolean } = {}) => {
  const currentPage = page ?? 1;
  return useQuery({
    queryKey: [WELLHUB_MISSING_OFFERS_QUERY_KEY, currentPage],
    queryFn: () =>
      fetchOffersMissingWellhubProductAPI(fetch, currentPage, PAGE_SIZE),
    enabled,
  });
};
