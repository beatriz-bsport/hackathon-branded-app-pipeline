import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteReferredMemberFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteReferredMemberFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist referred member filter row and invalidates `get_filters` cache.
 */
export const useDeleteReferredMemberFilterMutation = (
  smartlistId: string,
  params: UseDeleteReferredMemberFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deleteReferredMemberFilter(fetch, filterId),
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
    deleteReferredMemberFilterMutate: mutation.mutate,
    deleteReferredMemberFilter: mutation.mutateAsync,
  };
};
