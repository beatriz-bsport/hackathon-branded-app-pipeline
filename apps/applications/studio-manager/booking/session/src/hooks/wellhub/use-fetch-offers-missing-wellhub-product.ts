import { useQuery } from "@tanstack/react-query";

import {
  fetchOffersMissingWellhubProductAPI,
  wellhubKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const PAGE_SIZE = 10;

export const useFetchOffersMissingWellhubProduct = ({
  page,
  enabled,
}: { page?: number; enabled?: boolean } = {}) => {
  const currentPage = page ?? 1;
  return useQuery({
    queryKey: wellhubKeys.offersMissingProduct(currentPage, PAGE_SIZE),
    queryFn: () =>
      fetchOffersMissingWellhubProductAPI(fetch, currentPage, PAGE_SIZE),
    enabled,
  });
};
