import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type FetchPassesParams,
  type Pass,
  passesInfiniteQueryOptions,
} from "@bsport/api-buyables";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { fetch } from "#src/utils/fetch";

const AVAILABLE_PASSES_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const PAGE_SIZE = 20;

type UseAvailablePassesParams = {
  companyId: number | undefined;
  sessionId: number;
  searchQuery?: string;
};

export const useAvailablePasses = ({
  companyId,
  sessionId,
  searchQuery,
}: UseAvailablePassesParams) => {
  const params: FetchPassesParams = {
    offer: sessionId,
    disabled: false,
    page_size: PAGE_SIZE,
    ...(searchQuery ? { q: searchQuery } : {}),
  };

  const { data: session } = useRetrieveSession(sessionId);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      ...passesInfiniteQueryOptions(fetch, params),
      placeholderData: keepPreviousData,
      enabled: !!companyId,
      staleTime: AVAILABLE_PASSES_STALE_TIME,
    });

  const passes = useMemo<Pass[]>(
    () =>
      (data?.pages.flatMap((page) => page.results) ?? []).filter(
        (pass) =>
          !pass.manager_only &&
          (pass.unlimited ||
            (!!pass.credits &&
              pass.credits >=
                (session.credit_price_override ?? session.credit_price ?? 0))),
      ),
    [data?.pages, session.credit_price_override, session.credit_price],
  );

  return {
    passes,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
