import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchGiftcardBackgroundListAPI } from "@bsport/api-buyables";
import type { Fetch } from "@bsport/fetch";

import { GIFTCARD_BACKGROUND_LIST_QUERY_KEY } from "./constants";

const GIFTCARD_BACKGROUND_LIST_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const giftcardBackgroundListQueryOptions = (
  companyId: number,
  fetch: Fetch,
) => {
  const fetchGiftcardBackgroundList = fetchGiftcardBackgroundListAPI.bind(
    null,
    fetch,
  );
  return queryOptions({
    queryKey: [GIFTCARD_BACKGROUND_LIST_QUERY_KEY, companyId],
    queryFn: () => fetchGiftcardBackgroundList(companyId),
    staleTime: GIFTCARD_BACKGROUND_LIST_STALE_TIME,
    enabled: !!companyId,
  });
};

export const useGiftcardBackgroundList = (
  companyId: number | undefined,
  fetch: Fetch,
) => {
  const result = useQuery({
    ...giftcardBackgroundListQueryOptions(companyId ?? 0, fetch),
    enabled: !!companyId,
  });
  return result;
};
