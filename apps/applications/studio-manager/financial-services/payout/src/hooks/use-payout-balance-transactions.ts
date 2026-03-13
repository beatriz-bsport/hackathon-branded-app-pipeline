import { useQuery } from "@tanstack/react-query";

import {
  type PayoutBalanceTransactionsListResponse,
  getPayoutBalanceTransactionsAPI,
} from "@bsport/api-financial-services";

import { fetch } from "#src/utils/fetch";

const DEFAULT_PAGE_SIZE = 20;

export type UsePayoutBalanceTransactionsParams = {
  payoutId: number | null;
  enabled: boolean;
  page?: number;
  pageSize?: number;
};

export type UsePayoutBalanceTransactionsResult = {
  data: PayoutBalanceTransactionsListResponse | undefined;
  isLoading: boolean;
  error: Error | null;
};

export const usePayoutBalanceTransactions = ({
  payoutId,
  enabled,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: UsePayoutBalanceTransactionsParams): UsePayoutBalanceTransactionsResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["payout-balance-transactions", payoutId, page, pageSize],
    queryFn: () =>
      getPayoutBalanceTransactionsAPI(fetch, {
        payout_id: payoutId!,
        page,
        page_size: pageSize,
      }),
    enabled: enabled && payoutId != null,
  });

  return {
    data,
    isLoading,
    error,
  };
};
