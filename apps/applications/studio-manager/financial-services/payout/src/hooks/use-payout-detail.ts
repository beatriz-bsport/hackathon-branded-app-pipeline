import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  type PayoutDetailResponse,
  getPayoutDetailAPI,
} from "@bsport/api-financial-services";

import { fetch } from "#src/utils/fetch";

export type UsePayoutDetailParams = {
  payoutId: number | null;
  enabled: boolean;
};

export type UsePayoutDetailResult = {
  detail: PayoutDetailResponse | undefined;
  isFetching: boolean;
  error: Error | null;
};

export const usePayoutDetail = ({
  payoutId,
  enabled,
}: UsePayoutDetailParams): UsePayoutDetailResult => {
  const { data, isFetching, error } = useQuery({
    queryKey: ["payout-detail", payoutId],
    queryFn: () => getPayoutDetailAPI(fetch, { payout_id: payoutId! }),
    enabled: enabled && payoutId != null,
    placeholderData: keepPreviousData,
  });

  return {
    detail: data,
    isFetching,
    error,
  };
};
