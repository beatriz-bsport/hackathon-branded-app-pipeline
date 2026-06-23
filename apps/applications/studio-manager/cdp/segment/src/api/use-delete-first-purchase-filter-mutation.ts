import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFirstPurchaseFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteFirstPurchaseFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist first purchase filter row and invalidates `get_filters` cache.
 */
export const useDeleteFirstPurchaseFilterMutation = (
  smartlistId: string,
  params: UseDeleteFirstPurchaseFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deleteFirstPurchaseFilter(fetch, filterId),
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
    deleteFirstPurchaseFilterMutate: mutation.mutate,
    deleteFirstPurchaseFilter: mutation.mutateAsync,
  };
};
