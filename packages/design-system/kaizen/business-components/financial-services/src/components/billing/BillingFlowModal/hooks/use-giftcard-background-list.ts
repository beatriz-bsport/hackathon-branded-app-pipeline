import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchGiftcardBackgroundListAPI } from "@bsport/api-buyables";

import fetch from "#src/utils/fetch";

import { GIFTCARD_BACKGROUND_LIST_QUERY_KEY } from "./constants";

const GIFTCARD_BACKGROUND_LIST_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchGiftcardBackgroundList = fetchGiftcardBackgroundListAPI.bind(
  null,
  fetch,
);

export const giftcardBackgroundListQueryOptions = (companyId: number) => {
  return queryOptions({
    queryKey: [GIFTCARD_BACKGROUND_LIST_QUERY_KEY, companyId],
    queryFn: () => fetchGiftcardBackgroundList(companyId),
    staleTime: GIFTCARD_BACKGROUND_LIST_STALE_TIME,
    enabled: !!companyId,
  });
};

export const useGiftcardBackgroundList = (companyId: number | undefined) => {
  const result = useQuery({
    ...giftcardBackgroundListQueryOptions(companyId ?? 0),
    enabled: !!companyId,
  });
  return result;
};
