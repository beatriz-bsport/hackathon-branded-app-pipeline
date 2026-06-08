import { useMutation, useQueryClient } from "@tanstack/react-query";

import { upsertExpensesCompleteFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertPurchaseHistoryFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a purchase history filter and invalidates `get_filters` cache.
 */
export const useUpsertPurchaseHistoryFilterMutation = (
  smartlistId: string,
  params: UseUpsertPurchaseHistoryFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertExpensesCompleteFilterMutationOptions(fetch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      params.onSuccess?.();
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    upsertPurchaseHistoryFilterMutate: mutation.mutate,
    upsertPurchaseHistoryFilter: mutation.mutateAsync,
  };
};
