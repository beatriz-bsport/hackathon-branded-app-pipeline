import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpensesCompleteFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeletePurchaseHistoryFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a purchase history filter and invalidates `get_filters` cache.
 */
export const useDeletePurchaseHistoryFilterMutation = (
  smartlistId: string,
  params: UseDeletePurchaseHistoryFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteExpensesCompleteFilterMutationOptions(fetch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      showFilterDeleteSuccessToast();
      params.onSuccess?.();
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    deletePurchaseHistoryFilterMutate: mutation.mutate,
    deletePurchaseHistoryFilter: mutation.mutateAsync,
  };
};
