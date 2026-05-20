import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  type FetchConsumerGiftcardsParams,
  fetchConsumerGiftcardsAPI,
  giftcardKeys,
} from "@bsport/api-buyables";
import type { Fetch } from "@bsport/fetch";

import { mapAndSortConsumerGiftcards } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/map-consumer-giftcards";
import type { PaymentFlowGiftCard } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/types";
import { i18nInstance, useTranslation } from "#src/i18n";

const DEFAULT_PAGE_SIZE = 4;
const GIFTCARDS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type UseFetchAvailableGiftcardsParams = {
  fetch: Fetch;
  memberId: number;
  enabled: boolean;
  pageSize?: number;
};

type FetchAvailableGiftcardsPage = Awaited<
  ReturnType<typeof fetchConsumerGiftcardsAPI>
>;

type UseFetchAvailableGiftcardsResult = {
  giftcards: PaymentFlowGiftCard[];
  count: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: UseInfiniteQueryResult<
    InfiniteData<FetchAvailableGiftcardsPage>
  >["fetchNextPage"];
};

export const useFetchAvailableGiftcards = ({
  fetch,
  memberId,
  enabled,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseFetchAvailableGiftcardsParams): UseFetchAvailableGiftcardsResult => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const queryParamsBase = {
    dst_member: memberId,
    active: true,
    has_amount_left: true,
    in_timeframe: true,
    page_size: pageSize,
  } satisfies Omit<FetchConsumerGiftcardsParams, "page">;

  const buildQueryParams = (page: number): FetchConsumerGiftcardsParams => ({
    ...queryParamsBase,
    page,
  });

  const {
    data,
    hasNextPage = false,
    isFetchingNextPage,
    isLoading,
    isError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: giftcardKeys.consumerGiftcardsList(queryParamsBase),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchConsumerGiftcardsAPI(fetch, buildQueryParams(pageParam)),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * pageSize;
      return loaded < lastPage.count ? lastPage.page + 1 : undefined;
    },
    staleTime: GIFTCARDS_STALE_TIME,
    enabled: enabled && memberId > 0,
  });

  const allGiftcards = data?.pages.flatMap((page) => page.results) ?? [];

  return {
    giftcards: mapAndSortConsumerGiftcards(
      allGiftcards,
      t("paymentMethod.selector.allMethodsOptions.giftCardCode"),
    ),
    count: data?.pages[0]?.count ?? 0,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    fetchNextPage,
  };
};
