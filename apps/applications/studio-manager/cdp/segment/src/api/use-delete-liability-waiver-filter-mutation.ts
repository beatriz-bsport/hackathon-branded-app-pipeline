import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLiabilityWaiverFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteLiabilityWaiverFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a liability waiver filter and invalidates `get_filters` cache.
 */
export const useDeleteLiabilityWaiverFilterMutation = (
  smartlistId: string,
  params: UseDeleteLiabilityWaiverFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteLiabilityWaiverFilterMutationOptions(fetch),
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
    deleteLiabilityWaiverFilterMutate: mutation.mutate,
    deleteLiabilityWaiverFilter: mutation.mutateAsync,
  };
};
