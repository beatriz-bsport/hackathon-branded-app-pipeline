import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteActivePassesFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteActivePassesFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist active passes filter row and invalidates `get_filters` cache.
 */
export const useDeleteActivePassesFilterMutation = (
  smartlistId: string,
  params: UseDeleteActivePassesFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deleteActivePassesFilter(fetch, filterId),
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
    deleteActivePassesFilterMutate: mutation.mutate,
    deleteActivePassesFilter: mutation.mutateAsync,
  };
};
