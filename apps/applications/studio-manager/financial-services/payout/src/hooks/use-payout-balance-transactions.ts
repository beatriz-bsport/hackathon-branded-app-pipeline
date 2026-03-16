import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import {
  type PayoutBalanceTransactionsListResponse,
  getPayoutBalanceTransactionsAPI,
} from "@bsport/api-financial-services/payout";

import { fetch } from "#src/utils/fetch";

export const DEFAULT_BT_PAGE_SIZE = 10;

export type UsePayoutBalanceTransactionsParams = {
  payoutId: number | null;
  enabled: boolean;
  page?: number;
  pageSize?: number;
};

export type UsePayoutBalanceTransactionsResult = {
  data: PayoutBalanceTransactionsListResponse | undefined;
  isFetching: boolean;
  error: Error | null;
};

export const usePayoutBalanceTransactions = ({
  payoutId,
  enabled,
  page = 1,
  pageSize = DEFAULT_BT_PAGE_SIZE,
}: UsePayoutBalanceTransactionsParams): UsePayoutBalanceTransactionsResult => {
  const previousPayoutIdRef = useRef<number | null>(null);

  const payoutIdChanged =
    previousPayoutIdRef.current !== null &&
    payoutId !== null &&
    payoutId !== previousPayoutIdRef.current;

  useEffect(() => {
    previousPayoutIdRef.current = payoutId;
  }, [payoutId]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["payout-balance-transactions", payoutId, page, pageSize],
    queryFn: () =>
      getPayoutBalanceTransactionsAPI(fetch, {
        payout_id: payoutId!,
        page,
        page_size: pageSize,
      }),
    enabled: enabled && payoutId != null,
    placeholderData: payoutIdChanged ? undefined : keepPreviousData,
  });

  return {
    data,
    isFetching,
    error,
  };
};
